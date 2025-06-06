import { ChainId, Currency, CurrencyAmount, Price, Token, TradeType } from '@ubeswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import tryParseCurrencyAmount from 'lib/utils/tryParseCurrencyAmount'
import { useMemo, useRef } from 'react'
import { ClassicTrade, INTERNAL_ROUTER_PREFERENCE_PRICE } from 'state/routing/types'
import { useRoutingAPITrade } from 'state/routing/useRoutingAPITrade'
import { useSwapAndLimitContext } from 'state/swap/hooks'

import { SupportedInterfaceChain, asSupportedChain } from 'constants/chains'
import { CUSD_CELO, CUSD_CELO_ALFAJORES, USDC_MAINNET, DBCNativeCurrency, nativeOnChain, USDC_BSC } from '../constants/tokens'

// Stablecoin amounts used when calculating spot price for a given currency.
// The amount is large enough to filter low liquidity pairs.
export const STABLECOIN_AMOUNT_OUT: { [key in SupportedInterfaceChain]: CurrencyAmount<Token> } = {
  [ChainId.MAINNET]: CurrencyAmount.fromRawAmount(USDC_MAINNET, 100_000e6),
  [ChainId.CELO]: CurrencyAmount.fromRawAmount(CUSD_CELO, 10_000e18),
  [ChainId.CELO_ALFAJORES]: CurrencyAmount.fromRawAmount(CUSD_CELO_ALFAJORES, 10_000e6),
  [ChainId.BNB]: CurrencyAmount.fromRawAmount(USDC_BSC, 10_000e18),
  [ChainId.DBC]: CurrencyAmount.fromRawAmount(
    new DBCNativeCurrency(ChainId.DBC) as unknown as Token,  // 这里把原生币作为稳定币，去算 $价格
    10_000e18
  ),
}

/**
 * Returns the price in USDC of the input currency
 * @param currency currency to compute the USDC price of
 */
export default function useStablecoinPrice(currency?: Currency): Price<Currency, Token> | undefined {
  const chainId = asSupportedChain(currency?.chainId)
  const amountOut = chainId ? STABLECOIN_AMOUNT_OUT[chainId] : undefined
  const stablecoin = amountOut?.currency

  const { trade } = useRoutingAPITrade(
    false /* skip */,
    TradeType.EXACT_OUTPUT,
    amountOut,
    currency,
    INTERNAL_ROUTER_PREFERENCE_PRICE
  )
  const price = useMemo(() => {
    if (!currency || !stablecoin) {
      return undefined
    }

    // handle usdc
    if (currency?.wrapped.equals(stablecoin)) {
      return new Price(stablecoin, stablecoin, '1', '1')
    }

    // if initial quoting fails, we may end up with a DutchOrderTrade
    if (trade && trade instanceof ClassicTrade) {
      const { numerator, denominator } = trade.routes[0].midPrice
      return new Price(currency, stablecoin, denominator, numerator)
    }

    return undefined
  }, [currency, stablecoin, trade])

  const lastPrice = useRef(price)
  if (
    !price ||
    !lastPrice.current ||
    !price.equalTo(lastPrice.current) ||
    !price.baseCurrency.equals(lastPrice.current.baseCurrency)
  ) {
    lastPrice.current = price
  }
  return lastPrice.current
}

export function useStablecoinValue(currencyAmount: CurrencyAmount<Currency> | undefined | null) {
  const price = useStablecoinPrice(currencyAmount?.currency)

  return useMemo(() => {
    if (!price || !currencyAmount) return null
    try {
      return price.quote(currencyAmount)
    } catch (error) {
      return null
    }
  }, [currencyAmount, price])
}

/**
 *
 * @param fiatValue string representation of a USD amount
 * @returns CurrencyAmount where currency is stablecoin on active chain
 */
export function useStablecoinAmountFromFiatValue(fiatValue: number | null | undefined) {
  const { chainId } = useWeb3React()
  const { isChainSwitching } = useSwapAndLimitContext()
  const supportedChainId = asSupportedChain(chainId)
  
  // 如果正在切换链,返回undefined
  if (isChainSwitching) {
    return undefined
  }

  // Add early return if no supported chainId
  if (!supportedChainId) {
    console.warn(`Chain ${chainId} is not supported`)
    return undefined
  }

  // Add defensive check for STABLECOIN_AMOUNT_OUT
  if (!STABLECOIN_AMOUNT_OUT[supportedChainId]) {
    console.warn(`No stablecoin configured for chain ${chainId}`)
    return undefined
  }

  const stablecoin = STABLECOIN_AMOUNT_OUT[supportedChainId].currency

  return useMemo(() => {
    if (fiatValue === null || fiatValue === undefined || !chainId || !stablecoin) {
      return undefined
    }

    // trim for decimal precision when parsing
    const parsedForDecimals = fiatValue.toFixed(stablecoin.decimals).toString()
    try {
      // parse USD string into CurrencyAmount based on stablecoin decimals
      return tryParseCurrencyAmount(parsedForDecimals, stablecoin)
    } catch (error) {
      console.error('Failed to parse stablecoin amount:', error)
      return undefined
    }
  }, [chainId, fiatValue, stablecoin])
}
