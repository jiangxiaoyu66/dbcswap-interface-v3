import { ChainId, Currency, NONFUNGIBLE_POSITION_MANAGER_ADDRESSES, TradeType, UBE_ADDRESSES } from '@ubeswap/sdk-core'
import UniswapXBolt from 'assets/svg/bolt.svg'
import moonpayLogoSrc from 'assets/svg/moonpay.svg'
import { NATIVE_CHAIN_ID, nativeOnChain } from 'constants/tokens'
import { BigNumber } from 'ethers/lib/ethers'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { gqlToCurrency, logSentryErrorForUnsupportedChain, supportedChainIdFromGQLChain } from 'graphql/data/util'
import { t } from 'i18n'
import ms from 'ms'
import { useEffect, useState } from 'react'
import store from 'state'
import { addSignature } from 'state/signatures/reducer'
import { SignatureType, UniswapXOrderDetails } from 'state/signatures/types'
import { TransactionType as LocalTransactionType } from 'state/transactions/types'
import { UniswapXOrderStatus } from 'types/uniswapx'
import {
  AssetActivityPartsFragment,
  Currency as GQLCurrency,
  NftApprovalPartsFragment,
  NftApproveForAllPartsFragment,
  NftTransferPartsFragment,
  SwapOrderDetailsPartsFragment,
  SwapOrderStatus,
  SwapOrderType,
  TokenApprovalPartsFragment,
  TokenAssetPartsFragment,
  TokenTransferPartsFragment,
  TransactionDetailsPartsFragment,
  TransactionType,
} from 'uniswap/src/data/graphql/uniswap-data-api/__generated__/types-and-hooks'
import { isAddress, isSameAddress } from 'utilities/src/addresses'
import { currencyId } from 'utils/currencyId'
import { NumberType, useFormatter } from 'utils/formatNumbers'
import { MOONPAY_SENDER_ADDRESSES, OrderStatusTable, OrderTextTable } from '../constants'
import { Activity } from './types'

type TransactionChanges = {
  NftTransfer: NftTransferPartsFragment[]
  TokenTransfer: TokenTransferPartsFragment[]
  TokenApproval: TokenApprovalPartsFragment[]
  NftApproval: NftApprovalPartsFragment[]
  NftApproveForAll: NftApproveForAllPartsFragment[]
}

type FormatNumberOrStringFunctionType = ReturnType<typeof useFormatter>['formatNumberOrString']

// TODO: Move common contract metadata to a backend service
const UBE_IMG = 'https://raw.githubusercontent.com/DBCSwap/ubeswap-interface/main/src/assets/images/token-logo.png'

const ENS_IMG =
  'https://464911102-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/collections%2F2TjMAeHSzwlQgcOdL48E%2Ficon%2FKWP0gk2C6bdRPliWIA6o%2Fens%20transparent%20background.png?alt=media&token=bd28b063-5a75-4971-890c-97becea09076'

const COMMON_CONTRACTS: { [key: string]: Partial<Activity> | undefined } = {
  [UBE_ADDRESSES[ChainId.CELO].toLowerCase()]: {
    title: t`UBE Governance`,
    descriptor: t`Contract Interaction`,
    logos: [UBE_IMG],
  },
  // TODO(cartcrom): Add permit2-specific logo
  '0x000000000022d473030f116ddee9f6b43ac78ba3': {
    title: t`Permit2`,
    descriptor: t`DBCSwap Protocol`,
    logos: [UBE_IMG],
  },
  '0x4976fb03c32e5b8cfe2b6ccb31c09ba78ebaba41': {
    title: t`Ethereum Name Service`,
    descriptor: t`Public Resolver`,
    logos: [ENS_IMG],
  },
  '0x58774bb8acd458a640af0b88238369a167546ef2': {
    title: t`Ethereum Name Service`,
    descriptor: t`DNS Registrar`,
    logos: [ENS_IMG],
  },
  '0x084b1c3c81545d370f3634392de611caabff8148': {
    title: t`Ethereum Name Service`,
    descriptor: t`Reverse Registrar`,
    logos: [ENS_IMG],
  },
  '0x283af0b28c62c092c9727f1ee09c02ca627eb7f5': {
    title: t`Ethereum Name Service`,
    descriptor: t`ETH Registrar Controller`,
    logos: [ENS_IMG],
  },
}

const SPAMMABLE_ACTIVITY_TYPES = [TransactionType.Receive, TransactionType.Mint, TransactionType.Unknown]
function isSpam(
  { NftTransfer, TokenTransfer }: TransactionChanges,
  details: TransactionDetailsPartsFragment,
  account: string
): boolean {
  if (!SPAMMABLE_ACTIVITY_TYPES.includes(details.type) || details.from === account) return false
  return NftTransfer.some((nft) => nft.asset.isSpam) || TokenTransfer.some((t) => t.asset.project?.isSpam)
}

function callsPositionManagerContract(assetActivity: TransactionActivity) {
  const supportedChain = supportedChainIdFromGQLChain(assetActivity.chain)
  if (!supportedChain) return false
  return isSameAddress(assetActivity.details.to, NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[supportedChain])
}

// Gets counts for number of NFTs in each collection present
function getCollectionCounts(nftTransfers: NftTransferPartsFragment[]): { [key: string]: number | undefined } {
  return nftTransfers.reduce((acc, NFTChange) => {
    const key = NFTChange.asset.collection?.name ?? NFTChange.asset.name
    if (key) {
      acc[key] = (acc?.[key] ?? 0) + 1
    }
    return acc
  }, {} as { [key: string]: number | undefined })
}

function getSwapTitle(sent: TokenTransferPartsFragment, received: TokenTransferPartsFragment): string | undefined {
  const supportedSentChain = supportedChainIdFromGQLChain(sent.asset.chain)
  const supportedReceivedChain = supportedChainIdFromGQLChain(received.asset.chain)
  if (!supportedSentChain || !supportedReceivedChain) {
    logSentryErrorForUnsupportedChain({
      extras: { sentAsset: sent.asset, receivedAsset: received.asset },
      errorMessage: 'Invalid activity from unsupported chain received from GQL',
    })
    return undefined
  }
  if (
    sent.tokenStandard === NATIVE_CHAIN_ID &&
    isSameAddress(nativeOnChain(supportedSentChain).wrapped.address, received.asset.address)
  )
    return t`Wrapped`
  else if (
    received.tokenStandard === NATIVE_CHAIN_ID &&
    isSameAddress(nativeOnChain(supportedReceivedChain).wrapped.address, received.asset.address)
  ) {
    return t`Unwrapped`
  } else {
    return t`Swapped`
  }
}

function getSwapDescriptor({
  tokenIn,
  inputAmount,
  tokenOut,
  outputAmount,
}: {
  tokenIn: TokenAssetPartsFragment
  outputAmount: string
  tokenOut: TokenAssetPartsFragment
  inputAmount: string
}) {
  return `${inputAmount} ${tokenIn.symbol} for ${outputAmount} ${tokenOut.symbol}`
}

/**
 *
 * @param transactedValue Transacted value amount from TokenTransfer API response
 * @returns parsed & formatted USD value as a string if currency is of type USD
 */
function getTransactedValue(transactedValue: TokenTransferPartsFragment['transactedValue']): number | undefined {
  if (!transactedValue) return undefined
  const price = transactedValue?.currency === GQLCurrency.Usd ? transactedValue.value ?? undefined : undefined
  return price
}

type SwapAmounts = {
  inputAmount: string
  inputAmountRaw: string
  inputCurrencyId: string
  outputAmount: string
  outputAmountRaw: string
  outputCurrencyId: string
  sent: TokenTransferPartsFragment
  received: TokenTransferPartsFragment
}

// exported for testing
// eslint-disable-next-line import/no-unused-modules
export function parseSwapAmounts(
  changes: TransactionChanges,
  formatNumberOrString: FormatNumberOrStringFunctionType
): SwapAmounts | undefined {
  const sent = changes.TokenTransfer.find((t) => t.direction === 'OUT')
  // Any leftover native token is refunded on exact_out swaps where the input token is native
  const refund = changes.TokenTransfer.find(
    (t) => t.direction === 'IN' && t.asset.id === sent?.asset.id && t.asset.standard === NATIVE_CHAIN_ID
  )
  const received = changes.TokenTransfer.find((t) => t.direction === 'IN' && t !== refund)
  if (!sent || !received) return undefined
  const inputCurrencyId = sent.asset.standard === NATIVE_CHAIN_ID ? 'ETH' : sent.asset.address
  const outputCurrencyId = received.asset.standard === NATIVE_CHAIN_ID ? 'ETH' : received.asset.address
  if (!inputCurrencyId || !outputCurrencyId) return undefined

  const sentQuantity = parseUnits(sent.quantity, sent.asset.decimals)
  const refundQuantity = refund ? parseUnits(refund.quantity, refund.asset.decimals) : BigNumber.from(0)
  const receivedQuantity = parseUnits(received.quantity, received.asset.decimals)

  const adjustedInput = sentQuantity.sub(refundQuantity)
  const inputAmountRaw = adjustedInput.toString()
  const outputAmountRaw = receivedQuantity.toString()
  const inputAmount = formatNumberOrString({
    input: formatUnits(adjustedInput, sent.asset.decimals),
    type: NumberType.TokenNonTx,
  })
  const outputAmount = formatNumberOrString({ input: received.quantity, type: NumberType.TokenNonTx })
  return {
    sent,
    received,
    inputAmount,
    outputAmount,
    inputCurrencyId,
    outputCurrencyId,
    inputAmountRaw,
    outputAmountRaw,
  }
}

function parseSwap(changes: TransactionChanges, formatNumberOrString: FormatNumberOrStringFunctionType) {
  if (changes.NftTransfer.length > 0 && changes.TokenTransfer.length === 1) {
    const collectionCounts = getCollectionCounts(changes.NftTransfer)

    const title = changes.NftTransfer[0].direction === 'IN' ? t`Bought` : t`Sold`
    const descriptor = Object.entries(collectionCounts)
      .map(([collectionName, count]) => `${count} ${collectionName}`)
      .join()

    return { title, descriptor }
  }
  // Some swaps may have more than 2 transfers, e.g. swaps with fees on transfer
  if (changes.TokenTransfer.length >= 2) {
    const swapAmounts = parseSwapAmounts(changes, formatNumberOrString)

    if (swapAmounts) {
      const { sent, received, inputAmount, outputAmount } = swapAmounts
      return {
        title: getSwapTitle(sent, received),
        descriptor: getSwapDescriptor({ tokenIn: sent.asset, inputAmount, tokenOut: received.asset, outputAmount }),
        currencies: [gqlToCurrency(sent.asset), gqlToCurrency(received.asset)],
      }
    }
  }
  return { title: t`Unknown Swap` }
}

/**
 * Wrap/unwrap transactions are labelled as lend transactions on the backend.
 * This function parses the transaction changes to determine if the transaction is a wrap/unwrap transaction.
 */
function parseLend(changes: TransactionChanges, formatNumberOrString: FormatNumberOrStringFunctionType) {
  const native = changes.TokenTransfer.find((t) => t.tokenStandard === NATIVE_CHAIN_ID)?.asset
  const erc20 = changes.TokenTransfer.find((t) => t.tokenStandard === 'ERC20')?.asset
  if (native && erc20 && gqlToCurrency(native)?.wrapped.address === gqlToCurrency(erc20)?.wrapped.address) {
    return parseSwap(changes, formatNumberOrString)
  }
  return { title: t`Unknown Lend` }
}

function parseSwapOrder(
  changes: TransactionChanges,
  formatNumberOrString: FormatNumberOrStringFunctionType,
  assetActivity: TransactionActivity
) {
  const offchainOrderDetails = offchainOrderDetailsFromGraphQLTransactionActivity(
    assetActivity,
    changes,
    formatNumberOrString
  )
  return {
    ...parseSwap(changes, formatNumberOrString),
    prefixIconSrc: UniswapXBolt,
    offchainOrderDetails,
  }
}

export function offchainOrderDetailsFromGraphQLTransactionActivity(
  activity: AssetActivityPartsFragment & { details: TransactionDetailsPartsFragment },
  changes: TransactionChanges,
  formatNumberOrString: FormatNumberOrStringFunctionType
): UniswapXOrderDetails | undefined {
  const chainId = supportedChainIdFromGQLChain(activity.chain)
  if (!activity || !activity.details || !chainId) return undefined
  if (changes.TokenTransfer.length < 2) return undefined

  const swapAmounts = parseSwapAmounts(changes, formatNumberOrString)

  if (!swapAmounts) return undefined

  const { inputCurrencyId, outputCurrencyId, inputAmountRaw, outputAmountRaw } = swapAmounts

  return {
    orderHash: activity.details.hash,
    id: activity.details.id,
    offerer: activity.details.from,
    txHash: activity.details.hash,
    chainId,
    status: UniswapXOrderStatus.FILLED,
    addedTime: activity.timestamp,
    swapInfo: {
      isUniswapXOrder: true,
      type: LocalTransactionType.SWAP,
      tradeType: TradeType.EXACT_INPUT,
      inputCurrencyId,
      outputCurrencyId,
      inputCurrencyAmountRaw: inputAmountRaw,
      expectedOutputCurrencyAmountRaw: outputAmountRaw,
      minimumOutputCurrencyAmountRaw: outputAmountRaw,
      settledOutputCurrencyAmountRaw: outputAmountRaw,
    },
  }
}

function parseApprove(changes: TransactionChanges) {
  if (changes.TokenApproval.length === 1) {
    const title = parseInt(changes.TokenApproval[0].quantity) === 0 ? t`Revoked Approval` : t`Approved`
    const descriptor = `${changes.TokenApproval[0].asset.symbol}`
    const currencies = [gqlToCurrency(changes.TokenApproval[0].asset)]
    return { title, descriptor, currencies }
  }
  return { title: t`Unknown Approval` }
}

function parseLPTransfers(changes: TransactionChanges, formatNumberOrString: FormatNumberOrStringFunctionType) {
  const poolTokenA = changes.TokenTransfer[0]
  const poolTokenB = changes.TokenTransfer[1]

  const tokenAQuanitity = formatNumberOrString({ input: poolTokenA.quantity, type: NumberType.TokenNonTx })
  const tokenBQuantity = formatNumberOrString({ input: poolTokenB.quantity, type: NumberType.TokenNonTx })

  return {
    descriptor: `${tokenAQuanitity} ${poolTokenA.asset.symbol} and ${tokenBQuantity} ${poolTokenB.asset.symbol}`,
    logos: [poolTokenA.asset.project?.logo?.url, poolTokenB.asset.project?.logo?.url],
    currencies: [gqlToCurrency(poolTokenA.asset), gqlToCurrency(poolTokenB.asset)],
  }
}

type TransactionActivity = AssetActivityPartsFragment & { details: TransactionDetailsPartsFragment }
type OrderActivity = AssetActivityPartsFragment & { details: SwapOrderDetailsPartsFragment }

function parseSendReceive(
  changes: TransactionChanges,
  formatNumberOrString: FormatNumberOrStringFunctionType,
  assetActivity: TransactionActivity
) {
  // TODO(cartcrom): remove edge cases after backend implements
  // Edge case: Receiving two token transfers in interaction w/ V3 manager === removing liquidity. These edge cases should potentially be moved to backend
  if (changes.TokenTransfer.length === 2 && callsPositionManagerContract(assetActivity)) {
    return { title: t`Removed Liquidity`, ...parseLPTransfers(changes, formatNumberOrString) }
  }

  let transfer: NftTransferPartsFragment | TokenTransferPartsFragment | undefined
  let assetName: string | undefined
  let amount: string | undefined
  let currencies: (Currency | undefined)[] | undefined
  if (changes.NftTransfer.length === 1) {
    transfer = changes.NftTransfer[0]
    assetName = transfer.asset.collection?.name
    amount = '1'
  } else if (changes.TokenTransfer.length === 1) {
    transfer = changes.TokenTransfer[0]
    assetName = transfer.asset.symbol
    amount = formatNumberOrString({ input: transfer.quantity, type: NumberType.TokenNonTx })
    currencies = [gqlToCurrency(transfer.asset)]
  }

  if (transfer && assetName && amount) {
    const isMoonpayPurchase = MOONPAY_SENDER_ADDRESSES.some((address) => isSameAddress(address, transfer?.sender))

    if (transfer.direction === 'IN') {
      return isMoonpayPurchase && transfer.__typename === 'TokenTransfer'
        ? {
            title: t`Purchased`,
            descriptor: `${amount} ${assetName} ${t`for`} ${formatNumberOrString({
              input: getTransactedValue(transfer.transactedValue),
              type: NumberType.FiatTokenPrice,
            })}`,
            logos: [moonpayLogoSrc],
            currencies,
          }
        : {
            title: t`Received`,
            descriptor: `${amount} ${assetName} ${t`from`} `,
            otherAccount: isAddress(transfer.sender) || undefined,
            currencies,
          }
    } else {
      return {
        title: t`Sent`,
        descriptor: `${amount} ${assetName} ${t`to`} `,
        otherAccount: isAddress(transfer.recipient) || undefined,
        currencies,
      }
    }
  }
  return { title: t`Unknown Send` }
}

function parseMint(
  changes: TransactionChanges,
  formatNumberOrString: FormatNumberOrStringFunctionType,
  assetActivity: TransactionActivity
) {
  const collectionMap = getCollectionCounts(changes.NftTransfer)
  if (Object.keys(collectionMap).length === 1) {
    const collectionName = Object.keys(collectionMap)[0]

    // Edge case: Minting a v3 positon represents adding liquidity
    if (changes.TokenTransfer.length === 2 && callsPositionManagerContract(assetActivity)) {
      return { title: t`Added Liquidity`, ...parseLPTransfers(changes, formatNumberOrString) }
    }
    return { title: t`Minted`, descriptor: `${collectionMap[collectionName]} ${collectionName}` }
  }
  return { title: t`Unknown Mint` }
}

function parseUnknown(
  _changes: TransactionChanges,
  _formatNumberOrString: FormatNumberOrStringFunctionType,
  assetActivity: TransactionActivity
) {
  return { title: t`Contract Interaction`, ...COMMON_CONTRACTS[assetActivity.details.to.toLowerCase()] }
}

type TransactionTypeParser = (
  changes: TransactionChanges,
  formatNumberOrString: FormatNumberOrStringFunctionType,
  assetActivity: TransactionActivity
) => Partial<Activity>
const ActivityParserByType: { [key: string]: TransactionTypeParser | undefined } = {
  [TransactionType.Swap]: parseSwap,
  [TransactionType.Lend]: parseLend,
  [TransactionType.SwapOrder]: parseSwapOrder,
  [TransactionType.Approve]: parseApprove,
  [TransactionType.Send]: parseSendReceive,
  [TransactionType.Receive]: parseSendReceive,
  [TransactionType.Mint]: parseMint,
  [TransactionType.Unknown]: parseUnknown,
}

function getLogoSrcs(changes: TransactionChanges): Array<string | undefined> {
  // Uses set to avoid duplicate logos (e.g. nft's w/ same image url)
  const logoSet = new Set<string | undefined>()
  // Uses only NFT logos if they are present (will not combine nft image w/ token image)
  if (changes.NftTransfer.length > 0) {
    changes.NftTransfer.forEach((nftChange) => logoSet.add(nftChange.asset.image?.url))
  } else {
    changes.TokenTransfer.forEach((tokenChange) => logoSet.add(tokenChange.asset.project?.logo?.url))
    changes.TokenApproval.forEach((tokenChange) => logoSet.add(tokenChange.asset.project?.logo?.url))
  }
  return Array.from(logoSet)
}

function swapOrderTypeToSignatureType(swapOrderType: SwapOrderType): SignatureType {
  switch (swapOrderType) {
    case SwapOrderType.Limit:
      return SignatureType.SIGN_LIMIT
    case SwapOrderType.Dutch:
      return SignatureType.SIGN_UNISWAPX_ORDER
    case SwapOrderType.DutchV2:
      return SignatureType.SIGN_UNISWAPX_V2_ORDER
  }
}

function parseUniswapXOrder({ details, chain, timestamp }: OrderActivity): Activity | undefined {
  const supportedChain = supportedChainIdFromGQLChain(chain)
  if (!supportedChain) {
    logSentryErrorForUnsupportedChain({
      extras: { details },
      errorMessage: 'Invalid activity from unsupported chain received from GQL',
    })
    return undefined
  }

  // If the order is open, maybe add it to our local records (if it was initiated on this device, this will be a no-op).
  if (details.orderStatus === SwapOrderStatus.Open) {
    const inputCurrency = gqlToCurrency(details.inputToken)
    const outputCurrency = gqlToCurrency(details.outputToken)

    const inputTokenQuantity = parseUnits(details.inputTokenQuantity, details.inputToken.decimals).toString()
    const outputTokenQuantity = parseUnits(details.outputTokenQuantity, details.outputToken.decimals).toString()

    if (inputTokenQuantity === '0' || outputTokenQuantity === '0') {
      // TODO(WEB-3765): This is a temporary mitigation for a bug where the backend sends "0.000000" for small amounts.
      throw new Error('Invalid activity received from GQL')
    }

    store.dispatch(
      addSignature({
        type: swapOrderTypeToSignatureType(details.swapOrderType),
        offerer: details.offerer,
        id: details.hash,
        chainId: supportedChain,
        orderHash: details.hash,
        expiry: details.expiry,
        encodedOrder: details.encodedOrder,
        swapInfo: {
          type: LocalTransactionType.SWAP,
          inputCurrencyId: currencyId(inputCurrency),
          outputCurrencyId: currencyId(outputCurrency),
          isUniswapXOrder: true,
          // This doesn't affect the display, but we don't know this value from the remote activity.
          tradeType: TradeType.EXACT_INPUT,
          inputCurrencyAmountRaw: inputTokenQuantity,
          expectedOutputCurrencyAmountRaw: outputTokenQuantity,
          minimumOutputCurrencyAmountRaw: outputTokenQuantity,
        },
        status: UniswapXOrderStatus.OPEN,
        addedTime: timestamp * 1000,
      })
    )
    return undefined
  }

  // If the order is not open, render it like any other remote activity.
  const { inputToken, inputTokenQuantity, outputToken, outputTokenQuantity, orderStatus } = details
  const uniswapXOrderStatus = OrderStatusTable[orderStatus]
  const { status, statusMessage, title } = OrderTextTable[uniswapXOrderStatus]
  const descriptor = getSwapDescriptor({
    tokenIn: inputToken,
    inputAmount: inputTokenQuantity,
    tokenOut: outputToken,
    outputAmount: outputTokenQuantity,
  })

  return {
    hash: details.hash,
    chainId: supportedChain,
    status,
    statusMessage,
    offchainOrderDetails: {
      id: details.id,
      type: swapOrderTypeToSignatureType(details.swapOrderType),
      encodedOrder: details.encodedOrder,
      txHash: details.hash,
      orderHash: details.hash,
      offerer: details.offerer,
      chainId: supportedChain,
      status: uniswapXOrderStatus,
      addedTime: timestamp,
      swapInfo: {
        isUniswapXOrder: true,
        type: LocalTransactionType.SWAP,
        tradeType: TradeType.EXACT_INPUT,
        inputCurrencyId: inputToken.address ?? '',
        outputCurrencyId: outputToken.address ?? '',
        inputCurrencyAmountRaw: parseUnits(inputTokenQuantity, inputToken.decimals).toString(),
        expectedOutputCurrencyAmountRaw: parseUnits(outputTokenQuantity, outputToken.decimals).toString(),
        minimumOutputCurrencyAmountRaw: parseUnits(outputTokenQuantity, outputToken.decimals).toString(),
        settledOutputCurrencyAmountRaw: parseUnits(outputTokenQuantity, outputToken.decimals).toString(),
      },
    },
    timestamp,
    logos: [inputToken.project?.logo?.url, outputToken.project?.logo?.url],
    currencies: [gqlToCurrency(inputToken), gqlToCurrency(outputToken)],
    title,
    descriptor,
    from: details.offerer,
    prefixIconSrc: UniswapXBolt,
  }
}

function parseRemoteActivity(
  assetActivity: AssetActivityPartsFragment | undefined,
  account: string,
  formatNumberOrString: FormatNumberOrStringFunctionType
): Activity | undefined {
  try {
    if (!assetActivity) {
      return undefined
    }

    if (assetActivity.details.__typename === 'SwapOrderDetails') {
      // UniswapX orders are returned as SwapOrderDetails until they are filled onchain, at which point they are returned as TransactionDetails
      return parseUniswapXOrder(assetActivity as OrderActivity)
    }

    const changes = assetActivity.details.assetChanges.reduce(
      (acc: TransactionChanges, assetChange) => {
        if (assetChange?.__typename === 'NftApproval') acc.NftApproval.push(assetChange)
        else if (assetChange?.__typename === 'NftApproveForAll') acc.NftApproveForAll.push(assetChange)
        else if (assetChange?.__typename === 'NftTransfer') acc.NftTransfer.push(assetChange)
        else if (assetChange?.__typename === 'TokenTransfer') acc.TokenTransfer.push(assetChange)
        else if (assetChange?.__typename === 'TokenApproval') acc.TokenApproval.push(assetChange)

        return acc
      },
      { NftTransfer: [], TokenTransfer: [], TokenApproval: [], NftApproval: [], NftApproveForAll: [] }
    )

    const supportedChain = supportedChainIdFromGQLChain(assetActivity.chain)
    if (!supportedChain) {
      logSentryErrorForUnsupportedChain({
        extras: { assetActivity },
        errorMessage: 'Invalid activity from unsupported chain received from GQL',
      })
      return undefined
    }

    const defaultFields = {
      hash: assetActivity.details.hash,
      chainId: supportedChain,
      status: assetActivity.details.status,
      timestamp: assetActivity.timestamp,
      logos: getLogoSrcs(changes),
      title: assetActivity.details.type,
      descriptor: assetActivity.details.to,
      from: assetActivity.details.from,
      nonce: assetActivity.details.nonce,
      isSpam: isSpam(changes, assetActivity.details, account),
    }

    const parsedFields = ActivityParserByType[assetActivity.details.type]?.(
      changes,
      formatNumberOrString,
      assetActivity as TransactionActivity
    )
    return { ...defaultFields, ...parsedFields }
  } catch (e) {
    console.error('Failed to parse activity', e, assetActivity)
    return undefined
  }
}

export function parseRemoteActivities(
  assetActivities: (AssetActivityPartsFragment | undefined)[] | undefined,
  account: string,
  formatNumberOrString: FormatNumberOrStringFunctionType
) {
  return assetActivities?.reduce((acc: { [hash: string]: Activity }, assetActivity) => {
    const activity = parseRemoteActivity(assetActivity, account, formatNumberOrString)
    if (activity) acc[activity.hash] = activity
    return acc
  }, {})
}

const getTimeSince = (timestamp: number) => {
  const seconds = Math.floor(Date.now() - timestamp * 1000)

  let interval
  // TODO(cartcrom): use locale to determine date shorthands to use for non-english
  if ((interval = seconds / ms(`1y`)) > 1) return Math.floor(interval) + 'y'
  if ((interval = seconds / ms(`30d`)) > 1) return Math.floor(interval) + 'mo'
  if ((interval = seconds / ms(`1d`)) > 1) return Math.floor(interval) + 'd'
  if ((interval = seconds / ms(`1h`)) > 1) return Math.floor(interval) + 'h'
  if ((interval = seconds / ms(`1m`)) > 1) return Math.floor(interval) + 'm'
  else return Math.floor(seconds / ms(`1s`)) + 's'
}

/**
 * Keeps track of the time since a given timestamp, keeping it up to date every second when necessary
 * @param timestamp
 * @returns
 */
export function useTimeSince(timestamp: number) {
  const [timeSince, setTimeSince] = useState<string>(getTimeSince(timestamp))

  useEffect(() => {
    const refreshTime = () =>
      setTimeout(() => {
        if (Math.floor(Date.now() - timestamp * 1000) / ms(`61s`) <= 1) {
          setTimeSince(getTimeSince(timestamp))
          timeout = refreshTime()
        }
      }, ms(`1s`))

    let timeout = refreshTime()

    return () => {
      timeout && clearTimeout(timeout)
    }
  }, [timestamp])

  return timeSince
}
