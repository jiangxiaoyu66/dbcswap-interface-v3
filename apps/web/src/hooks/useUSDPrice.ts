import { NetworkStatus } from '@apollo/client'
import { ChainId, Currency, CurrencyAmount, Price, TradeType, Token } from '@ubeswap/sdk-core'
import { nativeOnChain } from 'constants/tokens'
import { PollingInterval, chainIdToBackendName, isGqlSupportedChain } from 'graphql/data/util'
import { useMemo, useCallback, useEffect, useState } from 'react'
import { ClassicTrade, INTERNAL_ROUTER_PREFERENCE_PRICE, TradeState } from 'state/routing/types'
import { useRoutingAPITrade } from 'state/routing/useRoutingAPITrade'
import { Chain, useTokenSpotPriceQuery } from 'uniswap/src/data/graphql/uniswap-data-api/__generated__/types-and-hooks'
import { getNativeTokenDBAddress } from 'utils/nativeTokens'
import { Protocol } from '@uniswap/router-sdk'

import useIsWindowVisible from './useIsWindowVisible'
import useStablecoinPrice from './useStablecoinPrice'
import { useDebouncedTrade } from './useDebouncedTrade'
import { DGC_DBC, SIC_DBC } from '@ubeswap/smart-order-router/src/providers/token-provider'
import { getClientSideQuote, getRouter } from 'lib/hooks/routing/clientSideSmartOrderRouter'

import { useWDBCStore } from 'store/dbcRatio'

// ETH amounts used when calculating spot price for a given currency.
// The amount is large enough to filter low liquidity pairs.
const ETH_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Currency> } = {
  [ChainId.MAINNET]: CurrencyAmount.fromRawAmount(nativeOnChain(ChainId.MAINNET), 50e18),
  [ChainId.ARBITRUM_ONE]: CurrencyAmount.fromRawAmount(nativeOnChain(ChainId.ARBITRUM_ONE), 10e18),
  [ChainId.OPTIMISM]: CurrencyAmount.fromRawAmount(nativeOnChain(ChainId.OPTIMISM), 10e18),
  [ChainId.POLYGON]: CurrencyAmount.fromRawAmount(nativeOnChain(ChainId.POLYGON), 10_000e18),
  [ChainId.CELO]: CurrencyAmount.fromRawAmount(nativeOnChain(ChainId.CELO), 10e18),
}

function useETHPrice(currency?: Currency): {
  data?: Price<Currency, Currency>
  isLoading: boolean
} {
  const chainId = currency?.chainId
  const isSupported = currency && isGqlSupportedChain(chainId)

  const amountOut = isSupported ? ETH_AMOUNT_OUT[chainId] : undefined
  const { trade, state } = useRoutingAPITrade(
    !isSupported /* skip */,
    TradeType.EXACT_OUTPUT,
    amountOut,
    currency,
    INTERNAL_ROUTER_PREFERENCE_PRICE
  )

  return useMemo(() => {
    if (!isSupported) {
      return { data: undefined, isLoading: false }
    }

    if (currency?.wrapped.equals(nativeOnChain(chainId).wrapped)) {
      return {
        data: new Price(currency, currency, '1', '1'),
        isLoading: false,
      }
    }

    if (!trade || state === TradeState.LOADING) {
      return { data: undefined, isLoading: state === TradeState.LOADING }
    }

    // if initial quoting fails, we may end up with a DutchOrderTrade
    if (trade && trade instanceof ClassicTrade) {
      const { numerator, denominator } = trade.routes[0].midPrice
      const price = new Price(currency, nativeOnChain(chainId), denominator, numerator)
      return { data: price, isLoading: false }
    }

    return { data: undefined, isLoading: false }
  }, [chainId, currency, isSupported, state, trade])
}



export function useUSDPrice(
  currencyAmount?: CurrencyAmount<Currency>,
  prefetchCurrency?: Currency
): {
  data?: number
  isLoading: boolean
} {




  const currency = currencyAmount?.currency ?? prefetchCurrency
  const chainId = currency?.chainId
  const chain = chainId ? chainIdToBackendName(chainId) : undefined

  // skip all pricing requests if the window is not focused
  const isWindowVisible = useIsWindowVisible()

  // Use ETH-based pricing if available.
  const { data: tokenEthPrice, isLoading: isTokenEthPriceLoading } = useETHPrice(currency)
  const isTokenEthPriced = Boolean(tokenEthPrice || isTokenEthPriceLoading)

  // console.log('useTokenSpotPriceQuery params:', {
  //   chain: chain ?? Chain.Ethereum,
  //   address: getNativeTokenDBAddress(chain ?? Chain.Ethereum),
  //   skip: !isTokenEthPriced || !isWindowVisible,
  //   pollInterval: PollingInterval.Normal,
  //   notifyOnNetworkStatusChange: true,
  //   fetchPolicy: 'cache-first',
  // })

  // const { data, networkStatus } = useTokenSpotPriceQuery({
  //   variables: { chain: chain ?? Chain.Ethereum, address: getNativeTokenDBAddress(chain ?? Chain.Ethereum) },
  //   // skip: !isTokenEthPriced || !isWindowVisible,
  //   skip: false,
  //   pollInterval: PollingInterval.Normal,
  //   notifyOnNetworkStatusChange: true,
  //   fetchPolicy: 'cache-first',
  // })

  // Use USDC-based pricing for chains not yet supported by backend (for ETH-based pricing).
  const stablecoinPrice = useStablecoinPrice(isTokenEthPriced ? undefined : currency)





  // 新增: 使用getState()获取状态
  const { pairPriceRatio,  wdbcPrice, isLoadingWdbcPrice } = useWDBCStore.getState()
  const ratioNum = pairPriceRatio?.[currencyAmount?.currency.symbol ?? '']


  if(pairPriceRatio?.[currencyAmount?.currency.symbol ?? '']) {
    console.log('pairPriceRatio拿到了', pairPriceRatio)
  }


  return useMemo(() => {
    if (!currencyAmount || !ratioNum || wdbcPrice === undefined) {
      return {
        data: undefined,
        isLoading: isLoadingWdbcPrice
      }
    }

    // 计算美元价值: 输入金额 * WDBC兑换比例 * WDBC美元价格
    const usdValue = parseFloat(currencyAmount.toExact()) * ratioNum * wdbcPrice

    return {
      data: usdValue,
      isLoading: false
    }
  }, [currencyAmount, ratioNum, wdbcPrice, isLoadingWdbcPrice])
}
