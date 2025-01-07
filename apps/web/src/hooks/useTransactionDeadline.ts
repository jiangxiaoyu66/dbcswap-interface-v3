import { BigNumber } from '@ethersproject/bignumber'
import { useWeb3React } from '@web3-react/core'
import { L2_CHAIN_IDS } from 'constants/chains'
import { L2_DEADLINE_FROM_NOW } from 'constants/misc'
import { useCallback, useMemo } from 'react'
import { useAppSelector } from 'state/hooks'

import { useInterfaceMulticall } from 'hooks/useContract'
import useCurrentBlockTimestamp from './useCurrentBlockTimestamp'

export default function useTransactionDeadline(): BigNumber | undefined {
  const { chainId } = useWeb3React()
  const ttl = useAppSelector((state) => state.user.userDeadline)
  const blockTimestamp = useCurrentBlockTimestamp()
  return useMemo(() => timestampToDeadline(chainId, blockTimestamp, ttl), [blockTimestamp, chainId, ttl])
}

/**
 * 返回一个异步函数，该函数会获取区块时间戳并结合用户设置的截止时间。
 * 应该用于所有提交的交易，因为它使用链上时间戳而不是客户端时间戳。
 * 
 * @returns 返回一个异步函数，该函数返回 Promise<BigNumber | undefined>
 */
export function useGetTransactionDeadline(): () => Promise<BigNumber | undefined> {
  const { chainId } = useWeb3React()
  const ttl = useAppSelector((state) => state.user.userDeadline)
  const multicall = useInterfaceMulticall()
  
  return useCallback(async () => {
    const blockTimestamp = await multicall.getCurrentBlockTimestamp()
    return timestampToDeadline(chainId, blockTimestamp, ttl)
  }, [chainId, multicall, ttl])
}

function timestampToDeadline(chainId?: number, blockTimestamp?: BigNumber, ttl?: number) {
  if (blockTimestamp && chainId && L2_CHAIN_IDS.includes(chainId)) return blockTimestamp.add(L2_DEADLINE_FROM_NOW)
  if (blockTimestamp && ttl) return blockTimestamp.add(ttl)
  return undefined
}
