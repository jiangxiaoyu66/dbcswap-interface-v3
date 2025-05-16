import { ChainId } from '@ubeswap/sdk-core'
import { Connector } from '@web3-react/types'
import { networkConnection, uniwalletWCV2ConnectConnection, walletConnectV2Connection } from 'connection'
import { getChainInfo } from 'constants/chainInfo'
import { CHAIN_IDS_TO_NAMES, isSupportedChain } from 'constants/chains'
import { PUBLIC_RPC_URLS } from 'constants/networks'
import { useCallback } from 'react'
import { useAppDispatch } from 'state/hooks'
import { endSwitchingChain, startSwitchingChain } from 'state/wallets/reducer'
import { trace } from 'tracing/trace'
import { DBC_NETWORK_CONFIG, BSC_NETWORK_CONFIG } from 'connection/WalletConnectV2'

// 使用对象来跟踪链切换状态，而不是简单的布尔值
interface SwitchState {
  isPending: boolean;
  targetChainId?: number;
  lastAttemptTime: number;
}

// 链切换状态，每个链ID一个独立状态
const chainSwitchState: Record<number, SwitchState> = {};

export function useSwitchChain() {
  const dispatch = useAppDispatch()

  return useCallback(
    async (connector: Connector, chainId: number) => {
      console.log(`尝试切换到链ID: ${chainId}，类型: ${typeof chainId}`);
      
      // 检查链是否受支持
      const supported = isSupportedChain(chainId);
      console.log(`链ID ${chainId} 是否受支持: ${supported}`);
      
      if (!supported) {
        console.warn(`链ID ${chainId} 不被连接器支持 (${typeof connector})`);
        return;
      }

      // 获取当前链ID
      let currentChainId: string | null = null;
      if (connector.provider) {
        try {
          currentChainId = await connector.provider.request({ method: 'eth_chainId' });
        } catch (e) {
          console.error("获取当前链ID失败:", e);
        }
      }
      
      // 将十六进制chainId转换为十进制以进行比较
      const currentChainIdDecimal = currentChainId ? parseInt(currentChainId, 16) : null;
      console.log(`当前链ID: ${currentChainId} (十进制: ${currentChainIdDecimal}), 目标链ID: ${chainId}`);
      
      // 如果已经在目标链上，不需要切换
      if (currentChainIdDecimal === chainId) {
        console.log(`已经在目标链ID ${chainId} 上，不需要切换`);
        return true; // 返回true表示"成功"，因为已经在目标链上
      }
      
      // 检查此链ID的切换状态
      const now = Date.now();
      const state = chainSwitchState[chainId] || { isPending: false, lastAttemptTime: 0 };
      
      // 如果有相同目标的切换正在进行，且在短时间内，则跳过
      if (state.isPending && now - state.lastAttemptTime < 5000) {
        console.log(`正在进行切换到链ID ${chainId} 的操作，请稍等...`);
        return;
      }
      
      // 更新切换状态
      chainSwitchState[chainId] = {
        isPending: true,
        targetChainId: chainId,
        lastAttemptTime: now
      };

      return trace({ name: 'Switch chain', op: 'wallet.switch_chain' }, async (trace) => {
        dispatch(startSwitchingChain(chainId))
        try {
          if (
            [
              walletConnectV2Connection.connector,
              uniwalletWCV2ConnectConnection.connector,
              networkConnection.connector,
            ].includes(connector)
          ) {
            await connector.activate(chainId)
          } else {
            // 获取网络配置
            console.log("开始处理链ID切换:", chainId);
            
            let networkConfig = null;
            if (chainId === 19880818) { // DBC
              networkConfig = DBC_NETWORK_CONFIG;
            } else if (chainId === 56) { // BNB
              networkConfig = BSC_NETWORK_CONFIG;
            }
            
            if (!networkConfig) {
              console.warn(`不支持的链ID: ${chainId}`);
              return;
            }

            const provider = connector.provider;
            if (!provider) {
              console.warn('没有可用的provider');
              return;
            }

            try {
              // 检查当前链ID
              const currentChainId = await provider.request({ method: 'eth_chainId' });
              // 将目标 chainId 转换为十六进制
              const targetChainIdHex = `0x${chainId.toString(16)}`;

              console.log('网络切换尝试:', {
                currentChainId,
                targetChainIdHex,
                networkConfig,
                chainId
              });

              // 如果已经在目标链上，直接返回
              if (currentChainId === targetChainIdHex) {
                console.log('已经在目标链上');
                return true;
              }

              // 尝试切换网络
              try {
                await provider.request({
                  method: 'wallet_switchEthereumChain',
                  params: [{ chainId: targetChainIdHex }],
                });
                console.log('成功切换到链:', targetChainIdHex);
                return true; // 显式返回成功
              } catch (switchError: any) {
                // 再次检查网络是否已经切换（即使报错）
                const newChainId = await provider.request({ method: 'eth_chainId' });
                if (newChainId === targetChainIdHex) {
                  console.log('链已经切换到:', targetChainIdHex);
                  return true;
                }

                console.log('切换链失败，尝试添加网络:', switchError);

                // 处理特定错误码
                if (switchError.code === 4902 || switchError.code === -32603) {
                  try {
                    await provider.request({
                      method: 'wallet_addEthereumChain',
                      params: [{
                        chainId: targetChainIdHex,
                        chainName: networkConfig.chainName,
                        nativeCurrency: networkConfig.nativeCurrency,
                        rpcUrls: networkConfig.rpcUrls,
                        blockExplorerUrls: networkConfig.blockExplorerUrls
                      }],
                    });
                    console.log('成功添加网络');
                    return true;
                  } catch (addError) {
                    console.error('添加网络失败:', addError);
                    throw addError;
                  }
                } else {
                  console.warn('切换网络警告:', switchError);
                  throw switchError;
                }
              }
            } catch (error: any) {
              console.error('网络切换错误:', error);
              throw error;
            }
          }
          return true; // 默认返回成功
        } catch (error) {
          console.error('常规错误:', error);
          throw error;
        } finally {
          dispatch(endSwitchingChain());
          
          // 延迟重置切换标记
          setTimeout(() => {
            if (chainSwitchState[chainId]) {
              chainSwitchState[chainId].isPending = false;
            }
            console.log(`链ID ${chainId} 的切换状态已重置`);
          }, 2000);
        }
      })
    },
    [dispatch]
  )
}