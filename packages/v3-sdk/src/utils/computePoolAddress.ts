import { defaultAbiCoder } from '@ethersproject/abi'
import { getCreate2Address } from '@ethersproject/address'
import { keccak256 } from '@ethersproject/solidity'
import { Token } from '@ubeswap/sdk-core'
import { FeeAmount, POOL_INIT_CODE_HASH } from '../constants'

/**
 * Computes a pool address
 * @param factoryAddress The Uniswap V3 factory address
 * @param tokenA The first token of the pair, irrespective of sort order
 * @param tokenB The second token of the pair, irrespective of sort order
 * @param fee The fee tier of the pool
 * @param initCodeHashManualOverride Override the init code hash used to compute the pool address if necessary
 * @returns The pool address
 */
export function computePoolAddress({
  factoryAddress,
  tokenA,
  tokenB,
  fee,
  initCodeHashManualOverride,
}: {
  factoryAddress: string
  tokenA: Token
  tokenB: Token
  fee: FeeAmount
  initCodeHashManualOverride?: string
}): string {
  // 输入参数调试
  console.log('=== computePoolAddress Input Parameters ===')
  console.log('Factory Address:', factoryAddress)
  console.log('TokenA:', {
    address: tokenA?.address,
    chainId: tokenA?.chainId,
    symbol: tokenA?.symbol
  })
  console.log('TokenB:', {
    address: tokenB?.address,
    chainId: tokenB?.chainId,
    symbol: tokenB?.symbol
  })
  console.log('Fee:', fee)
  console.log('InitCodeHashOverride:', initCodeHashManualOverride)

  const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA] // does safety checks

  // 排序后的结果
  console.log('=== After Token Sorting ===')
  console.log('Token0:', {
    address: token0?.address,
    symbol: token0?.symbol
  })
  console.log('Token1:', {
    address: token1?.address,
    symbol: token1?.symbol
  })

  try {
    const result = getCreate2Address(
      factoryAddress,
      keccak256(
        ['bytes'],
        [defaultAbiCoder.encode(['address', 'address', 'uint24'], [token0.address, token1.address, fee])]
      ),
      initCodeHashManualOverride ?? POOL_INIT_CODE_HASH
    )

    // 计算结果
    console.log('=== Computation Result ===')
    console.log('Computed Pool Address:', result)
    console.log('Used Init Code Hash:', initCodeHashManualOverride ?? POOL_INIT_CODE_HASH)

    return result
  } catch (error) {
    // 错误信息
    console.error('=== Error in computePoolAddress ===')
    console.error('Error:', error.message)
    console.error('Parameters at error:', {
      factoryAddress,
      token0Address: token0?.address,
      token1Address: token1?.address,
      fee
    })
    throw error
  }
}
