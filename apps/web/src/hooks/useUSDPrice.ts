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

// 首先添加一个缓存机制
const tokenRateCache = new Map<string, {
  data: TokenRateInfo;
  timestamp: number;
}>();

// 缓存过期时间设置为5分钟
const CACHE_EXPIRY = 5 * 60 * 1000; 

// 添加一个新的 hook 用于缓存请求结果
function useTokenXaaRate(tokenAddress?: string) {
  const [rateInfo, setRateInfo] = useState<TokenRateInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchRate = async () => {
      if (!tokenAddress) return;

      // 检查缓存
      const cached = tokenRateCache.get(tokenAddress.toLowerCase());
      if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
        setRateInfo(cached.data);
        return;
      }

      setIsLoading(true);
      try {
        const result = await getTokenXaaRate(tokenAddress);
        if (result && isMounted) {
          // 更新缓存
          tokenRateCache.set(tokenAddress.toLowerCase(), {
            data: result,
            timestamp: Date.now()
          });
          setRateInfo(result);
        }
      } catch (error) {
        console.error('获取代币汇率失败:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchRate();

    return () => {
      isMounted = false;
    };
  }, [tokenAddress]);

  return { rateInfo, isLoading };
}

export function useUSDPrice(
  currencyAmount?: CurrencyAmount<Currency>,
  prefetchCurrency?: Currency
): {
  data?: number
  isLoading: boolean
} {
  const currency = currencyAmount?.currency ?? prefetchCurrency
  const tokenAddress = currency?.isToken ? (currency as Token).address : undefined;
  
  const { rateInfo, isLoading: isLoadingXaaRate } = useTokenXaaRate(tokenAddress);
  const { pairPriceRatio, wdbcPrice, isLoadingWdbcPrice } = useWDBCStore.getState()
  const ratioNum = pairPriceRatio?.[currency?.symbol ?? '']

  return useMemo(() => {
    const isLoading = isLoadingWdbcPrice || isLoadingXaaRate;

    console.log("调试", currency, currencyAmount, rateInfo);
    

    if (!currencyAmount || isLoading || !rateInfo) {
      return {
        data: undefined,
        isLoading: true
      };
    }

    const amount = parseFloat(currencyAmount.toExact());

    if(currency?.symbol === 'DBC') {
      debugger
      if(wdbcPrice) {
        return {
          data: amount * wdbcPrice,
          isLoading: false
        }
      }
    }

    // 如果有 XAA 汇率信息，使用它计算
    if (rateInfo.xaaRate && rateInfo.xaaDbcRate && wdbcPrice) {
      const usdValue = amount * rateInfo.xaaRate * rateInfo.xaaDbcRate * wdbcPrice;
      if (!isNaN(usdValue) && isFinite(usdValue) && usdValue > 0) {
        return {
          data: usdValue,
          isLoading: false
        };
      }
    }

    // 回退到使用比率计算
    if (ratioNum && wdbcPrice) {
      const usdValue = amount * ratioNum * wdbcPrice;
      if (!isNaN(usdValue) && isFinite(usdValue) && usdValue > 0) {
        return {
          data: usdValue,
          isLoading: false
        };
      }
    }

    return {
      data: undefined,
      isLoading: false
    };
  }, [currencyAmount, rateInfo, wdbcPrice, ratioNum, isLoadingWdbcPrice, isLoadingXaaRate])
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





