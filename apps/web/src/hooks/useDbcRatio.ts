import { CurrencyAmount, Currency } from '@ubeswap/sdk-core'
import { Protocol } from '@uniswap/router-sdk'
import { INTERNAL_ROUTER_PREFERENCE_PRICE } from 'state/routing/types'
import { getClientSideQuote, getRouter } from 'lib/hooks/routing/clientSideSmartOrderRouter'
import { useWDBCStore } from 'store/dbcRatio'

// WDBC合约地址
export const WDBC_ADDRESS = "0xD7EA4Da7794c7d09bceab4A21a6910D9114Bc936"

export async function calculateWDBCRatio(currencyAmount: CurrencyAmount<Currency>): Promise<{ token: string | undefined, ratioNum: number | undefined } | undefined> {
  const {
    pairPriceRatio: cachedRatio,
    ratioLoadingPairs,
    setRatio,
    setRatioLoadingPair
  } = useWDBCStore.getState()

  const tokenSymbol = currencyAmount.currency.symbol
  if (!tokenSymbol) return

  const tokenInAddress = currencyAmount.currency.isNative
    ? WDBC_ADDRESS
    : currencyAmount.currency.wrapped.address

  console.log('calculateWDBCRatio-tokenInAddress', tokenInAddress, 'currencyAmount', currencyAmount, "isLoading", ratioLoadingPairs[tokenSymbol])

  if (currencyAmount.currency.isNative) {
    return {
      token: tokenSymbol,
      ratioNum: 1
    }
  }

  // 如果该交易对已经在加载中,直接返回
  if (ratioLoadingPairs[tokenSymbol]) {
    return
  }
  else {
    setRatioLoadingPair({ [tokenSymbol]: true })
  }

  try {
    // console.log('WDBC比率查询参数:', {
    //   tokenInAddress,
    //   isNative: currencyAmount.currency.isNative,
    //   amount: currencyAmount.quotient.toString()
    // })

    const QUOTE_ARGS = {
      account: "0xde184A6809898D81186DeF5C0823d2107c001Da2",
      amount: currencyAmount.quotient.toString(),
      tradeType: 0,
      tokenInAddress: tokenInAddress,
      tokenInChainId: 19880818,
      tokenInDecimals: currencyAmount.currency.decimals,
      tokenInSymbol: currencyAmount.currency.symbol ?? '',
      tokenOutAddress: WDBC_ADDRESS,
      tokenOutChainId: 19880818,
      tokenOutDecimals: 18,
      tokenOutSymbol: "WDBC",
      routerPreference: INTERNAL_ROUTER_PREFERENCE_PRICE,
      sendPortionEnabled: true,
      needsWrapIfUniswapX: false,
      uniswapXForceSyntheticQuotes: false
    }

    const router = getRouter(QUOTE_ARGS.tokenInChainId)
    const quoteResult: any = await getClientSideQuote(QUOTE_ARGS, router, {
      protocols: [Protocol.V2, Protocol.V3, Protocol.MIXED]
    })

    // console.log('报价结果:', {
    //   quoteResult,
    //   inputAmount: QUOTE_ARGS.amount,
    //   outputAmount: quoteResult?.quote
    // })

    if (quoteResult?.data?.quote?.quote) {
      const ratioNum = parseFloat(quoteResult.data.quote.quote) / parseFloat(QUOTE_ARGS.amount)
      // console.log('计算得到的新比率:', ratioNum)

      setRatioLoadingPair({ [tokenSymbol]: false })
      return {
        token: tokenSymbol,
        ratioNum: ratioNum
      }
    }

    // setRatio(1)
    // setIsLoadingRatio(false)
    // return 1
  } catch (error) {
    console.error('获取WDBC比率失败:', error)
    setRatioLoadingPair({ [tokenSymbol]: false })

    if (currencyAmount.currency.isNative) {
      return {
        token: tokenSymbol,
        ratioNum: 1
      }
    }
  }

  setRatioLoadingPair({ [tokenSymbol]: false })
  return undefined
}