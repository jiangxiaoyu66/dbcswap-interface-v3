import { InterfacePageName } from '@ubeswap/analytics-events'
import { ChainId, Currency } from '@ubeswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import { Trace } from 'analytics'
import { NetworkAlert } from 'components/NetworkAlert/NetworkAlert'
import { SwitchLocaleLink } from 'components/SwitchLocaleLink'
import SwapHeader from 'components/swap/SwapHeader'
import { SwapTab } from 'components/swap/constants'
import { PageWrapper, SwapWrapper } from 'components/swap/styled'
import { asSupportedChain } from 'constants/chains'
import { useCurrency } from 'hooks/Tokens'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useScreenSize } from 'hooks/useScreenSize'
import { SendForm } from 'pages/Swap/Send/SendForm'
import { ReactNode, useMemo, useCallback, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { InterfaceTrade, TradeState } from 'state/routing/types'
import { isPreviewTrade } from 'state/routing/utils'
import { SwapAndLimitContextProvider, SwapContextProvider } from 'state/swap/SwapContext'
import { queryParametersToCurrencyState } from 'state/swap/hooks'
import { CurrencyState, SwapAndLimitContext } from 'state/swap/types'
import { useIsDarkMode } from '../../theme/components/ThemeToggle'
import { LimitFormWrapper } from './Limit/LimitForm'
import { SwapForm } from './SwapForm'
// import { calculateWDBCRatio } from 'hooks/useDbcRatio'
import { useWDBCStore } from 'store/dbcRatio'
import { CurrencyAmount } from '@ubeswap/sdk-core'
import { calculateWDBCRatio } from 'hooks/useDbcRatio'

export function getIsReviewableQuote(
  trade: InterfaceTrade | undefined,
  tradeState: TradeState,
  swapInputError?: ReactNode
): boolean {
  if (swapInputError) return false
  // if the current quote is a preview quote, allow the user to progress to the Swap review screen
  if (isPreviewTrade(trade)) return true

  return Boolean(trade && tradeState === TradeState.VALID)
}

// 新增: 定义API响应类型
interface DBCPriceResponse {
  status: number
  code: string
  msg: string
  content: {
    dbc_price: number
    update_time: string | null
    percent_change_24h: number
  }
}

export default function SwapPage({ className }: { className?: string }) {
  const location = useLocation()
  const {  setWdbcPrice, setIsLoadingWdbcPrice } = useWDBCStore()

  const { chainId: connectedChainId } = useWeb3React()
  const supportedChainId = asSupportedChain(connectedChainId)
  const chainId = supportedChainId || ChainId.CELO

  const parsedQs = useParsedQueryString()
  const parsedCurrencyState = useMemo(() => {
    return queryParametersToCurrencyState(parsedQs)
  }, [parsedQs])

  const initialInputCurrency = useCurrency(parsedCurrencyState.inputCurrencyId, chainId)
  const initialOutputCurrency = useCurrency(parsedCurrencyState.outputCurrencyId, chainId)





  // 获取WDBC价格
  const fetchWDBCPrice = useCallback(async () => {
    setIsLoadingWdbcPrice(true)
    try {
      const response = await fetch('https://dbchaininfo.congtu.cloud/query/dbc_info?language=CN')
      const data: DBCPriceResponse = await response.json()
      if (data.status === 1) {
        setWdbcPrice(data.content.dbc_price)
      }
    } catch (error) {
      console.error('Failed to fetch WDBC price:', error)
    } finally {
      setIsLoadingWdbcPrice(false)
    }
  }, [])

  const { pairPriceRatio, setRatio, setRatioLoadingPair, wdbcPrice,  } = useWDBCStore()

  const fetchWDBCRatio = useCallback(async (currencyAmount?: CurrencyAmount<Currency>) => {
    if (!currencyAmount) {
        console.log('fetchWDBCRatio: currencyAmount为空，直接返回')
        return
    }
    try {
        console.log('fetchWDBCRatio开始计算:', currencyAmount)
        const result = await calculateWDBCRatio(currencyAmount)
        console.log('fetchWDBCRatio计算结果:', result)
        
        if (result && result.ratioNum) {
            const newRatio = {
                ...pairPriceRatio,
                [result.token as string]: result.ratioNum
            }

            setRatio(newRatio)
        }
    } catch (error) {
        console.error('fetchWDBCRatio错误:', error)
    } finally {
      setRatioLoadingPair(
        {
          [currencyAmount.currency.symbol as string]: false
        }
      )
    }
  }, [])


  // 定期获取WDBC价格
  useEffect(() => {
    fetchWDBCPrice() // 初始调用
    
    const intervalId = setInterval(() => {
      fetchWDBCPrice()
      fetchWDBCRatio({
        "numerator": [
            731797216,
            836099643,
            85
        ],
        "denominator": [
            1
        ],
        "currency": {
            "chainId": 19850818,
            "decimals": 18,
            "symbol": "DGC",
            "isNative": false,
            "isToken": true,
            "address": "0xC260ed583545d036ed99AA5C76583a99B7E85D26"
        },
        "decimalScale": [
            660865024,
            931322574
        ]
    })
    }, 30000) // 每30秒更新一次
    
    return () => clearInterval(intervalId)
  }, [])




  return (
    <Trace page={InterfacePageName.SWAP_PAGE} shouldLogImpression>
      <PageWrapper>
        <Swap
          className={className}
          chainId={chainId}
          disableTokenInputs={supportedChainId === undefined}
          initialInputCurrency={initialInputCurrency}
          initialOutputCurrency={initialOutputCurrency}
          syncTabToUrl={true}
        />
        {/* <NetworkAlert /> */}
      </PageWrapper>
      {location.pathname === '/swap' && <SwitchLocaleLink />}
    </Trace>
  )
}

/**
 * The swap component displays the swap interface, manages state for the swap, and triggers onchain swaps.
 *
 * In most cases, chainId should refer to the connected chain, i.e. `useWeb3React().chainId`.
 * However if this component is being used in a context that displays information from a different, unconnected
 * chain (e.g. the TDP), then chainId should refer to the unconnected chain.
 */
export function Swap({
  className,
  initialInputCurrency,
  initialOutputCurrency,
  chainId,
  onCurrencyChange,
  disableTokenInputs = false,
  compact = false,
  syncTabToUrl,
}: {
  className?: string
  chainId?: ChainId
  onCurrencyChange?: (selected: CurrencyState) => void
  disableTokenInputs?: boolean
  initialInputCurrency?: Currency
  initialOutputCurrency?: Currency
  compact?: boolean
  syncTabToUrl: boolean
}) {
  const isDark = useIsDarkMode()
  const screenSize = useScreenSize()

  return (
    <SwapAndLimitContextProvider
      chainId={chainId}
      initialInputCurrency={initialInputCurrency}
      initialOutputCurrency={initialOutputCurrency}
    >
      {/* TODO: Move SwapContextProvider inside Swap tab ONLY after SwapHeader removes references to trade / autoSlippage */}
      <SwapAndLimitContext.Consumer>
        {({ currentTab }) => (
          <SwapContextProvider>
            <SwapWrapper isDark={isDark} className={className} id="swap-page">
              <SwapHeader compact={compact || !screenSize.sm} syncTabToUrl={syncTabToUrl} />
              {currentTab === SwapTab.Swap && (
                <SwapForm onCurrencyChange={onCurrencyChange} disableTokenInputs={disableTokenInputs} />
              )}
              {currentTab === SwapTab.Limit && <LimitFormWrapper onCurrencyChange={onCurrencyChange} />}
              {currentTab === SwapTab.Send && (
                <SendForm disableTokenInputs={disableTokenInputs} onCurrencyChange={onCurrencyChange} />
              )}
            </SwapWrapper>
          </SwapContextProvider>
        )}
      </SwapAndLimitContext.Consumer>
    </SwapAndLimitContextProvider>
  )
}
