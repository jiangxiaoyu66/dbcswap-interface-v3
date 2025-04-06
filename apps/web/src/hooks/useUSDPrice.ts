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
import { log } from '@ubeswap/smart-order-router'

// ETH amounts used when calculating spot price for a given currency.
// The amount is large enough to filter low liquidity pairs.
const ETH_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Currency> } = {
  [ChainId.MAINNET]: CurrencyAmount.fromRawAmount(nativeOnChain(ChainId.MAINNET), 50e18),
  [ChainId.ARBITRUM_ONE]: CurrencyAmount.fromRawAmount(nativeOnChain(ChainId.ARBITRUM_ONE), 10e18),
  [ChainId.OPTIMISM]: CurrencyAmount.fromRawAmount(nativeOnChain(ChainId.OPTIMISM), 10e18),
  [ChainId.POLYGON]: CurrencyAmount.fromRawAmount(nativeOnChain(ChainId.POLYGON), 10_000e18),
  [ChainId.CELO]: CurrencyAmount.fromRawAmount(nativeOnChain(ChainId.CELO), 10e18),
}





export function useUSDPrice(
  currencyAmount?: CurrencyAmount<Currency>,
  prefetchCurrency?: Currency
): {
  data?: number
  isLoading: boolean
} {
  const currency = currencyAmount?.currency ?? prefetchCurrency
  const [xaaRate, setXaaRate] = useState<number>(0)
  const [xaaDbcRateState, setXaaDbcRateState] = useState<number>(0)
  const [isLoadingXaaRate, setIsLoadingXaaRate] = useState(false)
  const [currencyUsdValueFromXaaSwap, setCurrencyUsdValueFromXaaSwap] = useState<number | undefined>(undefined)

  // 从全局状态获取WDBC相关数据
  const { pairPriceRatio, wdbcPrice, isLoadingWdbcPrice } = useWDBCStore.getState()
  const ratioNum = pairPriceRatio?.[currencyAmount?.currency?.symbol ?? '']

  useEffect(() => {
    let isMounted = true

    const fetchXaaRate = async () => {
      if (!currency?.isToken || !currencyAmount) {
        console.log('提前返回条件检查:', {
          hasToken: currency?.isToken,
          hasCurrencyAmount: !!currencyAmount,
          currencySymbol: currency?.symbol
        })
        return
      }
      
      try {
        setIsLoadingXaaRate(true)
        const tokenAddress = (currency as Token).address
        console.log('正在获取XAA汇率，tokenAddress:', tokenAddress)
        const result = await getTokenXaaRate(tokenAddress)
        console.log('getTokenXaaRate结果:', result)
        
        if (!result || !isMounted) {
          console.log('result为空或组件已卸载')
          return
        }

        const { xaaRate: fetchedXaaRate, xaaDbcRate: fetchedXaaDbcRate } = result
        console.log('获取到的汇率:', {
          fetchedXaaRate,
          fetchedXaaDbcRate,
          wdbcPrice,
          currencyAmount: currencyAmount.toExact()
        })
        
        if (typeof fetchedXaaRate === 'number') {
          setXaaRate(fetchedXaaRate)
        }
        
        if (typeof fetchedXaaDbcRate === 'number') {
          setXaaDbcRateState(fetchedXaaDbcRate)
        }

        // 确保所有必要的值都存在并且有效
        const currentWdbcPrice = wdbcPrice // 在验证前获取当前值
        if (
          typeof fetchedXaaRate === 'number' && 
          fetchedXaaRate > 0 && 
          typeof fetchedXaaDbcRate === 'number' && 
          fetchedXaaDbcRate > 0 && 
          typeof currentWdbcPrice === 'number' && 
          currentWdbcPrice > 0
        ) {
          const amount = parseFloat(currencyAmount.toExact())
          console.log('计算USD价值的输入值:', {
            amount,
            fetchedXaaRate,
            fetchedXaaDbcRate,
            currentWdbcPrice
          })
          
          const usdValue = amount * fetchedXaaRate * fetchedXaaDbcRate * currentWdbcPrice

          debugger
          console.log('计算得到的USD价值:', usdValue)
          
          if (!isNaN(usdValue) && isFinite(usdValue) && usdValue > 0) {
            console.log('设置新的USD价值:', usdValue)
            setCurrencyUsdValueFromXaaSwap(usdValue)
          } else {
            console.log('计算结果无效，不更新USD价值')
            setCurrencyUsdValueFromXaaSwap(undefined)
          }
        } else {
          console.log('无法计算USD价值，参数无效:', {
            hasValidXaaRate: typeof fetchedXaaRate === 'number' && fetchedXaaRate > 0,
            hasValidXaaDbcRate: typeof fetchedXaaDbcRate === 'number' && fetchedXaaDbcRate > 0,
            hasValidWdbcPrice: typeof currentWdbcPrice === 'number' && currentWdbcPrice > 0
          })
          setCurrencyUsdValueFromXaaSwap(undefined)
        }
      } catch (error) {
        console.error('获取XAA汇率时出错:', error)
        setCurrencyUsdValueFromXaaSwap(undefined)
      } finally {
        if (isMounted) {
          setIsLoadingXaaRate(false)
        }
      }
    }

    fetchXaaRate()

    return () => {
      isMounted = false
    }
  }, [currency, currencyAmount, wdbcPrice])

  return useMemo(() => {
    // 检查是否正在加载任何必要的数据
    const isLoading = isLoadingWdbcPrice || isLoadingXaaRate;

    // 检查所有必要的数据是否都已准备好
    const hasRequiredData = currencyAmount && 
                          (ratioNum !== undefined && ratioNum !== 0) && 
                          (wdbcPrice !== undefined && wdbcPrice !== 0);

    // 如果正在加载或缺少必要数据，返回加载状态
    if (isLoading || !hasRequiredData) {
      return {
        data: undefined,
        isLoading: true
      }
    }

    // 计算基于比率的USD价值
    const usdValue = parseFloat(currencyAmount.toExact()) * ratioNum * wdbcPrice;
    
    // 检查计算结果是否有效
    const isValidUsdValue = !isNaN(usdValue) && isFinite(usdValue) && usdValue > 0;
    
    // 优先使用XAA交换得到的价值，如果没有则使用比率计算的价值
    const finalValue = currencyUsdValueFromXaaSwap ?? (isValidUsdValue ? usdValue : undefined);

    return {
      data: finalValue,
      isLoading: false
    }
  }, [currencyAmount, ratioNum, wdbcPrice, isLoadingWdbcPrice, isLoadingXaaRate, currencyUsdValueFromXaaSwap])
}



const SUBGRAPH_URL =  'https://dbcswap.io/subgraph/name/ianlapham/dbcswap-v3-mainnet';
export const XAA_TOKEN_ADDRESS = "0x16d83f6b17914a4e88436251589194ca5ac0f452";
export const DBC_TOKEN_ADDRESS = "0xD7EA4Da7794c7d09bceab4A21a6910D9114Bc936";


interface TokenRateInfo {
  symbol: string;
  address: string;
  xaaRate: number;
  xaaDbcRate?: number;
  timestamp: string;
}

/**
 * 获取单个代币与XAA的兑换比例
 * @param tokenAddress 代币地址
 * @returns Promise<TokenRateInfo | null> 返回代币与XAA的兑换比例信息，如果未找到则返回null
 */
export const getTokenXaaRate = async (tokenAddress: string): Promise<TokenRateInfo | null> => {
  try {
    console.log('开始获取代币兑换比例，tokenAddress:', tokenAddress)
    
    // 如果是XAA代币本身，直接返回1:1的比例
    if (tokenAddress.toLowerCase() === XAA_TOKEN_ADDRESS.toLowerCase()) {
      // 构造查询XAA/DBC交易池的GraphQL查询
      const query = `
        query GetXaaDbcRate {
          pools(
            where: {
              and: [
                {
                  or: [
                    { token0: "${XAA_TOKEN_ADDRESS.toLowerCase()}" },
                    { token1: "${XAA_TOKEN_ADDRESS.toLowerCase()}" }
                  ]
                },
                {
                  or: [
                    { token0: "${DBC_TOKEN_ADDRESS.toLowerCase()}" },
                    { token1: "${DBC_TOKEN_ADDRESS.toLowerCase()}" }
                  ]
                }
              ]
            }
            orderBy: totalValueLockedUSD
            orderDirection: desc
          ) {
            token0 {
              id
              symbol
            }
            token1 {
              id
              symbol
            }
            swaps(
              first: 1,
              orderBy: timestamp,
              orderDirection: desc
            ) {
              amount0
              amount1
              timestamp
            }
          }
        }
      `;

      const response = await fetch(SUBGRAPH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`网络响应错误: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      // 获取XAA/DBC兑换比例
      const xaaDbcPool = data.data.pools[0];
      let xaaDbcRate = 1; // 默认值为1

      if (xaaDbcPool?.swaps?.length > 0) {
        const isXaaToken0 = xaaDbcPool.token0.id.toLowerCase() === XAA_TOKEN_ADDRESS.toLowerCase();
        const latestSwap = xaaDbcPool.swaps[0];
        const amount0 = parseFloat(latestSwap.amount0);
        const amount1 = parseFloat(latestSwap.amount1);
        
        if (amount0 !== 0 && amount1 !== 0) {
          xaaDbcRate = isXaaToken0 ? Math.abs(amount1 / amount0) : Math.abs(amount0 / amount1);
        }
      }

      return {
        symbol: 'XAA',
        address: XAA_TOKEN_ADDRESS,
        xaaRate: 1,
        xaaDbcRate,
        timestamp: xaaDbcPool?.swaps[0]?.timestamp || Math.floor(Date.now() / 1000).toString()
      };
    }

    const query = `
      query GetTokenAndXaaDbcRate {
        tokenPools: pools(
          where: {
            and: [
              {
                or: [
                  { token0: "${tokenAddress.toLowerCase()}" },
                  { token1: "${tokenAddress.toLowerCase()}" }
                ]
              },
              {
                or: [
                  { token0: "${XAA_TOKEN_ADDRESS.toLowerCase()}" },
                  { token1: "${XAA_TOKEN_ADDRESS.toLowerCase()}" }
                ]
              }
            ]
          }
          orderBy: totalValueLockedUSD
          orderDirection: desc
        ) {
          token0 {
            id
            symbol
          }
          token1 {
            id
            symbol
          }
          swaps(
            first: 1,
            orderBy: timestamp,
            orderDirection: desc
          ) {
            amount0
            amount1
            timestamp
          }
        }
        xaaDbcPools: pools(
          where: {
            and: [
              {
                or: [
                  { token0: "${XAA_TOKEN_ADDRESS.toLowerCase()}" },
                  { token1: "${XAA_TOKEN_ADDRESS.toLowerCase()}" }
                ]
              },
              {
                or: [
                  { token0: "${DBC_TOKEN_ADDRESS.toLowerCase()}" },
                  { token1: "${DBC_TOKEN_ADDRESS.toLowerCase()}" }
                ]
              }
            ]
          }
          orderBy: totalValueLockedUSD
          orderDirection: desc
        ) {
          token0 {
            id
            symbol
          }
          token1 {
            id
            symbol
          }
          swaps(
            first: 1,
            orderBy: timestamp,
            orderDirection: desc
          ) {
            amount0
            amount1
            timestamp
          }
        }
      }
    `;

    console.log('发送GraphQL查询到:', SUBGRAPH_URL)
    const response = await fetch(SUBGRAPH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      console.error('网络响应错误:', response.status, response.statusText)
      throw new Error(`网络响应错误: ${response.status}`);
    }

    const data = await response.json();
    console.log('GraphQL响应数据:', data)
    
    if (data.errors) {
      console.error('查询错误:', data.errors);
      throw new Error(data.errors[0].message);
    }

    // 获取代币与XAA的兑换比例
    const tokenPool = data.data.tokenPools[0];
    if (!tokenPool || !tokenPool.swaps || tokenPool.swaps.length === 0) {
      console.log('未找到该代币与XAA的交易对或交易数据');
      return null;
    }

    const isXaaToken0 = tokenPool.token0.id.toLowerCase() === XAA_TOKEN_ADDRESS.toLowerCase();
    const isTargetToken0 = tokenPool.token0.id.toLowerCase() === tokenAddress.toLowerCase();
    const targetToken = isTargetToken0 ? tokenPool.token0 : tokenPool.token1;
    const tokenLatestSwap = tokenPool.swaps[0];

    const tokenAmount0 = parseFloat(tokenLatestSwap.amount0);
    const tokenAmount1 = parseFloat(tokenLatestSwap.amount1);

    if (tokenAmount0 === 0 || tokenAmount1 === 0) {
      console.log('交易金额为0')
      return null;
    }

    // 计算代币兑换比例
    const xaaRate = !isXaaToken0 ? Math.abs(tokenAmount1 / tokenAmount0) : Math.abs(tokenAmount0 / tokenAmount1);
    console.log('计算得到的xaaRate:', xaaRate)

    // 获取XAA/DBC兑换比例
    let xaaDbcRate: number | undefined;
    const xaaDbcPool = data.data.xaaDbcPools[0];
    if (xaaDbcPool?.swaps?.length > 0) {
      const isXaaToken0InDbcPool = xaaDbcPool.token0.id.toLowerCase() === XAA_TOKEN_ADDRESS.toLowerCase();
      const xaaDbcLatestSwap = xaaDbcPool.swaps[0];
      const dbcAmount0 = parseFloat(xaaDbcLatestSwap.amount0);
      const dbcAmount1 = parseFloat(xaaDbcLatestSwap.amount1);
      
      if (dbcAmount0 !== 0 && dbcAmount1 !== 0) {
        xaaDbcRate = isXaaToken0InDbcPool ? Math.abs(dbcAmount1 / dbcAmount0) : Math.abs(dbcAmount0 / dbcAmount1);
        console.log('计算得到的xaaDbcRate:', xaaDbcRate)
      }
    }

    // 如果没有获取到xaaDbcRate，使用默认值1
    if (xaaDbcRate === undefined) {
      console.log('使用默认xaaDbcRate: 1')
      xaaDbcRate = 1;
    }

    const result = {
      symbol: targetToken.symbol || '未知代币',
      address: targetToken.id,
      xaaRate,
      xaaDbcRate,
      timestamp: tokenLatestSwap.timestamp
    };

    console.log('返回的TokenRateInfo:', result)
    return result;

  } catch (error) {
    console.error('获取代币兑换比例失败:', error);
    return null;
  }
}; 





