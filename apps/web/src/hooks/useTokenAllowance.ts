import { ContractTransaction } from '@ethersproject/contracts'
import { InterfaceEventName } from '@ubeswap/analytics-events'
import { CurrencyAmount, MaxUint256, Token } from '@ubeswap/sdk-core'
import { sendAnalyticsEvent, useTrace as useAnalyticsTrace } from 'analytics'
import { useTokenContract } from 'hooks/useContract'
import { useSingleCallResult } from 'lib/hooks/multicall'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ApproveTransactionInfo, TransactionType } from 'state/transactions/types'
import { trace } from 'tracing/trace'
import { UserRejectedRequestError } from 'utils/errors'
import { didUserReject } from 'utils/swapErrorToUserReadableMessage'

const MAX_ALLOWANCE = MaxUint256.toString()

export function useTokenAllowance(
  token?: Token,    // [1] 代币合约对象
  owner?: string,   // [2] 授权的所有者地址
  spender?: string  // [3] 被授权的花费者地址
): {
  tokenAllowance?: CurrencyAmount<Token>  // [4] 返回授权额度
  isSyncing: boolean                      // [5] 返回是否正在同步状态
} {
  // [6] 获取代币合约实例
  const contract = useTokenContract(token?.address, false)
  // [7] 缓存 allowance 方法的入参
  const inputs = useMemo(() => [owner, spender], [owner, spender])

  // [8] 调试日志：输出基本参数信息
  console.log('Debug useTokenAllowance:', {
    contractAddress: token?.address,
    hasContract: !!contract,
    owner,
    spender,
    inputs
  })

  // [9] 调试日志：检查合约方法是否存在
  console.log('Debug contract methods:', {
    hasAllowanceMethod: contract?.allowance ? 'yes' : 'no',
    contractMethods: contract ? Object.keys(contract.functions) : []
  })

  // [10] 控制区块查询频率的状态
  const [blocksPerFetch, setBlocksPerFetch] = useState<1>()
  // [11] RPC调用：通过 multicall 获取授权额度
  const singleCallResult = useSingleCallResult(contract, 'allowance', inputs, { blocksPerFetch })
  
  // [12] 调试日志：输出调用结果详情
  console.log('Debug allowance call details:', singleCallResult)

  // [13] 解构调用结果
  const { result, syncing: isSyncing, error } = singleCallResult

  // [14] 将结果转换为字符串，避免不必要的重渲染
  const rawAmount = result?.toString()
  // [15] 将原始数值转换为 CurrencyAmount 对象
  const allowance = useMemo(
    () => (token && rawAmount ? CurrencyAmount.fromRawAmount(token, rawAmount) : undefined),
    [token, rawAmount]
  )
  // [16] 当授权额度为0时，每个区块都重新检查
  useEffect(() => setBlocksPerFetch(allowance?.equalTo(0) ? 1 : undefined), [allowance])

  // [17] 调试日志：输出最终结果
  console.log("useTokenAllowance",{ tokenAllowance: allowance, isSyncing }, token, owner, spender, allowance);
  
  // [18] 返回缓存的结果对象
  return useMemo(() => ({ tokenAllowance: allowance, isSyncing }), [allowance, isSyncing])
}

export function useUpdateTokenAllowance(
  amount: CurrencyAmount<Token> | undefined,
  spender: string
): () => Promise<{ response: ContractTransaction; info: ApproveTransactionInfo }> {
  const contract = useTokenContract(amount?.currency.address)
  const analyticsTrace = useAnalyticsTrace()

  return useCallback(
    () =>
      trace({ name: 'Allowance', op: 'permit.allowance' }, async (trace) => {
        try {
          if (!amount) throw new Error('missing amount')
          if (!contract) throw new Error('missing contract')
          if (!spender) throw new Error('missing spender')

          const allowance = amount.equalTo(0) ? '0' : MAX_ALLOWANCE
          const response = await trace.child({ name: 'Approve', op: 'wallet.approve' }, async (walletTrace) => {
            try {
              return await contract.approve(spender, allowance)
            } catch (error) {
              if (didUserReject(error)) {
                walletTrace.setStatus('cancelled')
                const symbol = amount?.currency.symbol ?? 'Token'
                throw new UserRejectedRequestError(`${symbol} token allowance failed: User rejected`)
              } else {
                throw error
              }
            }
          })
          sendAnalyticsEvent(InterfaceEventName.APPROVE_TOKEN_TXN_SUBMITTED, {
            chain_id: amount.currency.chainId,
            token_symbol: amount.currency.symbol,
            token_address: amount.currency.address,
            ...analyticsTrace,
          })
          return {
            response,
            info: {
              type: TransactionType.APPROVAL,
              tokenAddress: contract.address,
              spender,
              amount: allowance,
            },
          }
        } catch (error: unknown) {
          if (error instanceof UserRejectedRequestError) {
            trace.setStatus('cancelled')
            throw error
          } else {
            const symbol = amount?.currency.symbol ?? 'Token'
            throw new Error(`${symbol} token allowance failed: ${error instanceof Error ? error.message : error}`)
          }
        }
      }),
    [amount, contract, spender, analyticsTrace]
  )
}

export function useRevokeTokenAllowance(
  token: Token | undefined,
  spender: string
): () => Promise<{ response: ContractTransaction; info: ApproveTransactionInfo }> {
  const amount = useMemo(() => (token ? CurrencyAmount.fromRawAmount(token, 0) : undefined), [token])

  return useUpdateTokenAllowance(amount, spender)
}
