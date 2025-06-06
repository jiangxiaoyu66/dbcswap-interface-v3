import { ChainId, Currency } from '@ubeswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import { SwapTab } from 'components/swap/constants'
import usePrevious from 'hooks/usePrevious'
import { PropsWithChildren, useEffect, useMemo, useState } from 'react'

import { useDerivedSwapInfo } from './hooks'
import { CurrencyState, SwapAndLimitContext, SwapContext, SwapState, initialSwapState } from './types'

export function SwapAndLimitContextProvider({
  children,
  chainId,
  initialInputCurrency,
  initialOutputCurrency,
}: PropsWithChildren<{
  chainId?: ChainId
  initialInputCurrency?: Currency
  initialOutputCurrency?: Currency
}>) {
  const { chainId: connectedChainId } = useWeb3React()
  const [currentTab, setCurrentTab] = useState<SwapTab>(SwapTab.Swap)
  const [isChainSwitching, setIsChainSwitching] = useState(false)

  const [currencyState, setCurrencyState] = useState<CurrencyState>({
    inputCurrency: initialInputCurrency,
    outputCurrency: initialOutputCurrency,
  })

  const prefilledState = useMemo(
    () => ({
      inputCurrency: initialInputCurrency,
      outputCurrency: initialOutputCurrency,
    }),
    [initialInputCurrency, initialOutputCurrency]
  )

  const previousConnectedChainId = usePrevious(connectedChainId)
  const previousPrefilledState = usePrevious(prefilledState)

  useEffect(() => {
    if (chainId && connectedChainId !== chainId) {
      setIsChainSwitching(true)
      return
    }
    setIsChainSwitching(false)
  }, [chainId, connectedChainId])

  useEffect(() => {
    const combinedCurrencyState = { ...currencyState, ...prefilledState }
    const chainChanged = previousConnectedChainId && previousConnectedChainId !== connectedChainId
    const prefilledInputChanged = Boolean(
      previousPrefilledState?.inputCurrency
        ? !prefilledState.inputCurrency?.equals(previousPrefilledState.inputCurrency)
        : prefilledState.inputCurrency
    )
    const prefilledOutputChanged = Boolean(
      previousPrefilledState?.outputCurrency
        ? !prefilledState?.outputCurrency?.equals(previousPrefilledState.outputCurrency)
        : prefilledState.outputCurrency
    )

    if (chainChanged || prefilledInputChanged || prefilledOutputChanged) {
      setCurrencyState({
        inputCurrency: combinedCurrencyState.inputCurrency ?? undefined,
        outputCurrency: combinedCurrencyState.outputCurrency ?? undefined,
      })
    }
  }, [connectedChainId, currencyState, prefilledState, previousConnectedChainId, previousPrefilledState])

  const value = useMemo(() => {
    return {
      currencyState,
      setCurrencyState,
      currentTab,
      setCurrentTab,
      prefilledState,
      chainId,
      isChainSwitching,
    }
  }, [currencyState, setCurrencyState, currentTab, setCurrentTab, prefilledState, chainId, isChainSwitching])

  if (isChainSwitching) {
    return <div>正在切换到目标链...</div>
  }

  return <SwapAndLimitContext.Provider value={value}>{children}</SwapAndLimitContext.Provider>
}

export function SwapContextProvider({ children }: { children: React.ReactNode }) {
  const [swapState, setSwapState] = useState<SwapState>({
    ...initialSwapState,
  })
  const { chainId: connectedChainId } = useWeb3React()
  const previousConnectedChainId = usePrevious(connectedChainId)

  useEffect(() => {
    const chainChanged = previousConnectedChainId && previousConnectedChainId !== connectedChainId
    if (chainChanged) {
      setSwapState((prev) => ({ ...prev, typedValue: '' }))
    }
  }, [connectedChainId, previousConnectedChainId])

  if (!connectedChainId) {
    return null
  }

  return <SwapContext.Provider value={{ swapState, setSwapState, derivedSwapInfo: useDerivedSwapInfo(swapState) }}>{children}</SwapContext.Provider>
}
