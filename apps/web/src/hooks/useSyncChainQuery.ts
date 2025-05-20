import { useWeb3React } from '@web3-react/core'
import { CHAIN_IDS_TO_NAMES, isSupportedChain } from 'constants/chains'
import { ParsedQs } from 'qs'
import { useEffect, useRef } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'

import useParsedQueryString from './useParsedQueryString'
import useSelectChain from './useSelectChain'

function getChainIdFromName(name: string) {
  // 特殊处理 DBC 链
  if (name === 'dbc') {
    return 19880818 // DBC 链的 chainId
  }
  const entry = Object.entries(CHAIN_IDS_TO_NAMES).find(([, n]) => n === name)
  const chainId = entry?.[0]
  return chainId ? parseInt(chainId) : undefined
}

function getParsedChainId(parsedQs: ParsedQs) {
  const chain = parsedQs.chain
  if (typeof chain !== 'string') return

  const chainId = getChainIdFromName(chain)
  if (chainId) return chainId
}

export default function useSyncChainQuery() {
  const { chainId, isActive, account } = useWeb3React()
  const parsedQs = useParsedQueryString()
  const chainIdRef = useRef(chainId)
  const accountRef = useRef(account)
  const { pathname } = useLocation()

  useEffect(() => {
    // Update chainIdRef when the account is retrieved from Web3React
    if (account && account !== accountRef.current) {
      chainIdRef.current = chainId
      accountRef.current = account
    }
  }, [account, chainId])

  const urlChainId = getParsedChainId(parsedQs)

  const selectChain = useSelectChain()

  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    // 如果是在 Warp 页面，不执行自动链切换
    if (pathname.startsWith('/warp')) {
      return
    }

    // 如果 URL 中指定了 DBC 链，不允许自动切换到其他链
    const chainParam = searchParams.get('chain')
    if (chainParam === 'dbc') {
      if (chainId !== 19880818) {
        selectChain(19880818)
      }
      return
    }

    // Change a user's chain on pageload if the connected chainId does not match the query param chain
    if (isActive && urlChainId && chainIdRef.current === chainId && chainId !== urlChainId) {
      selectChain(urlChainId)
    }
    // If a user has a connected wallet and has manually changed their chain, update the query parameter if it's supported
    else if (account && chainIdRef.current !== chainId && chainId !== urlChainId) {
      // 如果当前在 swap 或 pool 页面，且 URL 中指定了 DBC 链，不更新 chain 参数
      if ((pathname.startsWith('/swap') || pathname.startsWith('/pool')) && chainParam === 'dbc') {
        return
      }

      if (isSupportedChain(chainId)) {
        searchParams.set('chain', CHAIN_IDS_TO_NAMES[chainId])
      } else {
        searchParams.delete('chain')
      }
      setSearchParams(searchParams, { replace: true })
    }
    // If a user has a connected wallet and the chainId matches the query param chain, update the chainIdRef
    else if (isActive && chainId === urlChainId) {
      chainIdRef.current = urlChainId
    }
  }, [urlChainId, selectChain, searchParams, isActive, chainId, account, setSearchParams, pathname])
}
