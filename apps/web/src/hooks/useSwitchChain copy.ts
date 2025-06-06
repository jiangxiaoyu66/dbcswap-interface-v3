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

export function useSwitchChain() {
  const dispatch = useAppDispatch()

  return useCallback(
    async (connector: Connector, chainId: ChainId) => {
      if (!isSupportedChain(chainId)) {
        console.warn(`Chain ${chainId} not supported for connector (${typeof connector})`);
        return;
      }

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
            const networkConfig = chainId === 19880818 ? DBC_NETWORK_CONFIG : 
                                chainId === 56 ? BSC_NETWORK_CONFIG : null;
            
            if (!networkConfig) {
              console.warn(`Unsupported chain ID: ${chainId}`);
              return;
            }

            const provider = connector.provider;
            if (!provider) {
              console.warn('No provider available');
              return;
            }

            try {
              // 检查当前链ID
              const currentChainId = await provider.request({ method: 'eth_chainId' });
              const targetChainIdHex = networkConfig.chainId;

              // 如果已经在目标链上，直接返回
              if (currentChainId === targetChainIdHex) {
                return;
              }

              // 尝试切换网络
              try {
                await provider.request({
                  method: 'wallet_switchEthereumChain',
                  params: [{ chainId: targetChainIdHex }],
                });
              } catch (switchError: any) {
                // 再次检查网络是否已经切换（即使报错）
                const newChainId = await provider.request({ method: 'eth_chainId' });
                if (newChainId === targetChainIdHex) {
                  return;
                }

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
                  } catch (addError) {
                    console.warn('Failed to add network:', addError);
                  }
                } else {
                  console.warn('Switch network warning:', switchError);
                }
              }
            } catch (error: any) {
              console.warn('Network switch warning:', error);
            }
          }

          // 更新 URL 参数（如果需要的话）
          // if (isSupportedChain(chainId)) {
          //   try {
          //     const url = new URL(window.location.href)
          //     // 保持当前端口号
          //     const currentPort = url.port;
          //     url.searchParams.set('chain', CHAIN_IDS_TO_NAMES[chainId])
          //     if (currentPort) {
          //       url.port = currentPort;
          //     }
          //     window.history.replaceState(window.history.state, '', url)
          //   } catch (error) {
          //     console.warn('Failed to update URL:', error)
          //   }
          // }
        } catch (error: any) {
          console.warn('General warning:', error);
        } finally {
          dispatch(endSwitchingChain())
        }
      })
    },
    [dispatch]
  )
}