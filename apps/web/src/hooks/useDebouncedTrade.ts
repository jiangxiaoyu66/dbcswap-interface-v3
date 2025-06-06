import { Currency, CurrencyAmount, Percent, TradeType } from '@ubeswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import { WRAPPED_NATIVE_CURRENCY } from 'constants/tokens'
import { useMemo } from 'react'
import { ClassicTrade, InterfaceTrade, QuoteMethod, RouterPreference, TradeState } from 'state/routing/types'
import { usePreviewTrade } from 'state/routing/usePreviewTrade'
import { useRoutingAPITrade } from 'state/routing/useRoutingAPITrade'
import { useRouterPreference } from 'state/user/hooks'

import useAutoRouterSupported from './useAutoRouterSupported'
import useDebounce from './useDebounce'

// Prevents excessive quote requests between keystrokes.
const DEBOUNCE_TIME = 350
const DEBOUNCE_TIME_QUICKROUTE = 50

export function useDebouncedTrade(
  tradeType: TradeType,
  amountSpecified?: CurrencyAmount<Currency>,
  otherCurrency?: Currency,
  routerPreferenceOverride?: RouterPreference.X,
  account?: string,
  inputTax?: Percent,
  outputTax?: Percent
): {
  state: TradeState
  trade?: InterfaceTrade
  swapQuoteLatency?: number
}

export function useDebouncedTrade(
  tradeType: TradeType,
  amountSpecified?: CurrencyAmount<Currency>,
  otherCurrency?: Currency,
  routerPreferenceOverride?: RouterPreference.API,
  account?: string,
  inputTax?: Percent,
  outputTax?: Percent
): {
  state: TradeState
  trade?: ClassicTrade
  swapQuoteLatency?: number
}
/**
 * Returns the debounced v2+v3 trade for a desired swap.
 * @param tradeType whether the swap is an exact in/out
 * @param amountSpecified the exact amount to swap in/out
 * @param otherCurrency the desired output/payment currency
 * @param routerPreferenceOverride force useRoutingAPITrade to use a specific RouterPreference
 * @param account the connected address
 *
 */
export function useDebouncedTrade(
  tradeType: TradeType,
  amountSpecified?: CurrencyAmount<Currency>,
  otherCurrency?: Currency,
  routerPreferenceOverride?: RouterPreference,
  account?: string,
  inputTax?: Percent,
  outputTax?: Percent
): {
  state: TradeState
  trade?: InterfaceTrade
  method?: QuoteMethod
  swapQuoteLatency?: number
} {
  const { chainId } = useWeb3React()
  const autoRouterSupported = useAutoRouterSupported()

  const inputs = useMemo<[CurrencyAmount<Currency> | undefined, Currency | undefined]>(
    () => [amountSpecified, otherCurrency],
    [amountSpecified, otherCurrency]
  )
  const isDebouncing = useDebounce(inputs, DEBOUNCE_TIME) !== inputs

  const isPreviewTradeDebouncing = useDebounce(inputs, DEBOUNCE_TIME_QUICKROUTE) !== inputs

  const isWrap = useMemo(() => {
    if (!chainId || !amountSpecified || !otherCurrency) return false
    const weth = WRAPPED_NATIVE_CURRENCY[chainId]
    return Boolean(
      (amountSpecified.currency.isNative && weth?.equals(otherCurrency)) ||
      (otherCurrency.isNative && weth?.equals(amountSpecified.currency))
    )
  }, [amountSpecified, chainId, otherCurrency])

  const [routerPreference] = useRouterPreference()

  const skipBothFetches = !autoRouterSupported || isWrap
  const skipRoutingFetch = skipBothFetches || isDebouncing

  const skipPreviewTradeFetch = skipBothFetches || isPreviewTradeDebouncing

  const previewTradeResult = usePreviewTrade(
    skipPreviewTradeFetch,
    tradeType,
    amountSpecified,
    otherCurrency,
    inputTax,
    outputTax
  )

  if (previewTradeResult.state === TradeState.VALID) {
    console.log("previewTradeResult:", previewTradeResult,


      skipPreviewTradeFetch,
      tradeType,
      amountSpecified,
      otherCurrency,
      inputTax,
      outputTax
    );
  }




  const routingApiTradeResult = useRoutingAPITrade(
    skipRoutingFetch,
    tradeType,
    amountSpecified,
    otherCurrency,
    routerPreferenceOverride ?? routerPreference,
    account,
    inputTax,
    outputTax
  )

  if (routingApiTradeResult.state === TradeState.VALID) {
    console.log("routingApiTradeResult:", routingApiTradeResult,
      skipRoutingFetch,
      tradeType,
      amountSpecified,
      otherCurrency,
      routerPreferenceOverride ?? routerPreference,
      account,
      inputTax,
      outputTax
    );
  }

  return previewTradeResult.currentTrade && !routingApiTradeResult.currentTrade
    ? previewTradeResult
    : routingApiTradeResult
}
