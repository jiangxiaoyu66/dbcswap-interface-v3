import { MultiProtocolProvider, WarpCore } from '@hyperlane-xyz/sdk';
import { useState, useEffect, useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import styled, { keyframes } from 'styled-components';
import { ButtonPrimary } from 'components/Button';
import Column, { AutoColumn } from 'components/Column';
import { RowBetween } from 'components/Row';
import { ArrowLeft, ArrowRight } from 'react-feather';
import useSelectChain from 'hooks/useSelectChain';
import { ChainId } from '@ubeswap/sdk-core';

// 调试开关
const NETWORK_SWITCH_DEBUG = true;
// 全局变量，防止循环切换
let isNetworkSwitchPending = false;

const chainConfigs = {
  deepbrainchain: {
    chainId: 19880818,
    chainIdHex: '0x12F5B72',
    name: 'Deep Brain Chain',
    nativeCurrency: {
      name: 'Deep Brain Chain',
      symbol: 'DBC',
      decimals: 18
    },
    rpcUrls: ['https://rpc2.dbcwallet.io'],
    blockExplorerUrls: ['https://www.dbcscan.io'],
    iconUrls: ['https://raw.githubusercontent.com/dbchaincloud/media/main/logo.png']
  },
  bsc: {
    chainId: 56,
    chainIdHex: '0x38',
    name: 'BNB Smart Chain',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18
    },
    rpcUrls: ['https://bsc-dataseed1.bnbchain.org'],
    blockExplorerUrls: ['https://bscscan.com'],
    iconUrls: ['https://raw.githubusercontent.com/binance-chain/binance-chain-wiki/master/assets/bnb.png']
  }
};

// 样式组件
const FormWrapper = styled(Column)`
  max-width: 480px;
  width: 100%;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.surface1};
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid ${({ theme }) => theme.surface3};
  word-wrap: break-word;
  overflow-wrap: break-word;
  
  @media (max-width: 500px) {
    max-width: 100%;
    padding: 1rem;
  }
`;

const SectionTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.neutral2};
  margin-bottom: 8px;
`;

const ChainSelectorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const ChainSelector = styled.div`
  position: relative;
  width: 40%;
`;

const ChainLabel = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.neutral1};
`;

const ChainSelect = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: ${({ theme }) => theme.surface2};
  border: 1px solid ${({ theme }) => theme.surface3};
  border-radius: 12px;
  font-size: 16px;
  color: ${({ theme }) => theme.neutral1};
  appearance: none;
  cursor: pointer;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.accent1};
  }
`;

const rotate180 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(180deg);
  }
`;

const SwitchButton = styled.button`
  background: ${({ theme }) => theme.surface2};
  border: 1px solid ${({ theme }) => theme.surface3};
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  // margin-top: 1rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.surface3};
    opacity: 0.7;
    svg {
      animation: ${rotate180} 0.3s forwards;
    }
  }
  
  &:active {
    opacity: 0.6;
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
`;

const InputContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const InputField = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: ${({ theme }) => theme.surface2};
  border: 1px solid ${({ theme }) => theme.surface3};
  border-radius: 12px;
  font-size: 16px;
  color: ${({ theme }) => theme.neutral1};
  outline: none;
  word-wrap: break-word;
  overflow-wrap: break-word;

  &:focus {
    border-color: ${({ theme }) => theme.accent1};
  }
`;

const ErrorText = styled.div`
  color: ${({ theme }) => theme.critical};
  padding: 0.75rem;
  background-color: rgba(240, 50, 50, 0.1);
  border-radius: 12px;
  margin: 1rem 0;
  font-size: 14px;
  max-width: 100%;
  overflow: hidden;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

const TransactionPreview = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: ${({ theme }) => theme.surface2};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.surface3};
  max-width: 100%;
  overflow: hidden;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

const TransactionData = styled.pre`
  background-color: ${({ theme }) => theme.surface1};
  padding: 0.75rem;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 12px;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.neutral2};
  max-height: 200px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-word;
  word-wrap: break-word;
  display: block;
`;

const ActionButton = styled(ButtonPrimary)`
  padding: 0.75rem;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
`;

// 添加自动切换控制的样式组件
const AutoSwitchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 1rem;
  font-size: 14px;
`;

const SwitchLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
`;

const SwitchInput = styled.input`
  height: 0;
  width: 0;
  visibility: hidden;
  margin: 0;
  &:checked + span {
    background: ${({ theme }) => theme.accent1};
  }
  &:checked + span:after {
    left: calc(100% - 2px);
    transform: translateX(-100%);
  }
`;

const SwitchSlider = styled.span`
  cursor: pointer;
  width: 40px;
  height: 20px;
  background: ${({ theme }) => theme.surface3};
  display: block;
  border-radius: 100px;
  position: relative;
  margin-left: 8px;
  transition: 0.2s;
  &:after {
    content: "";
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    background: ${({ theme }) => theme.white || '#fff'};
    border-radius: 16px;
    transition: 0.2s;
  }
`;

const NetworkMismatchWarning = styled.div`
  color: ${({ theme }) => theme.deprecated_accentWarning};
  background-color: ${({ theme }) => theme.deprecated_accentWarningSoft || '#fff8e2'};
  padding: 12px;
  border-radius: 12px;
  margin: 12px 0;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

// 处理交易对象显示的函数
const formatTransactionData = (tx: any) => {
  if (!tx) return '';
  
  // 长字符串格式化（添加实际换行，不仅是软换行）
  const formatLongString = (str: string) => {
    if (!str || typeof str !== 'string' || str.length < 40) return str;
    // 每30个字符添加一个实际换行
    let formatted = '';
    for (let i = 0; i < str.length; i += 30) {
      formatted += str.slice(i, Math.min(i + 30, str.length));
      if (i + 30 < str.length) {
        formatted += '\n';
      }
    }
    return formatted;
  };
  
  // 格式化值（如ETH值）
  const formatValue = (value: any) => {
    if (!value) return '0';
    try {
      if (typeof value === 'string' && value.startsWith('0x')) {
        const etherValue = ethers.utils.formatEther(value);
        return `${parseFloat(parseFloat(etherValue).toFixed(6))} ETH`;
      } else if (value._hex) {
        const etherValue = ethers.utils.formatEther(value._hex);
        return `${parseFloat(parseFloat(etherValue).toFixed(6))} ETH`;
      }
    } catch (e) {
      // 如果转换失败，返回原始值
    }
    return String(value);
  };
  
  // 提取关键信息，转为简化文本
  try {
    const txType = tx.type || 'unknown';
    const txTo = tx.transaction?.to || 'N/A';
    const txValue = formatValue(tx.transaction?.value);
    
    const tokenInfo = tx.token ? 
      `代币: ${tx.token.symbol} (${tx.token.chainName})` : '';
    
    // 构造格式化文本
    return `类型: ${txType}\n发送至:\n${formatLongString(txTo)}\n\n数量: ${txValue}\n${tokenInfo}`;
  } catch (e) {
    // 如果处理失败，返回基本JSON字符串
    const simple = {
      type: tx.type,
      to: tx.transaction?.to || '',
      value: tx.transaction?.value || '0x0'
    };
    return JSON.stringify(simple, null, 2);
  }
};

export function TransferTokenForm() {
  const [txs, setTxs] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [amount, setAmount] = useState<string>('0.001');
  const [recipient, setRecipient] = useState<string>('0xde184A6809898D81186DeF5C0823d2107c001Da2');
  const [sourceChain, setSourceChain] = useState<'deepbrainchain' | 'bsc'>('deepbrainchain');
  const [destinationChain, setDestinationChain] = useState<'deepbrainchain' | 'bsc'>('bsc');
  const [autoSwitchNetwork, setAutoSwitchNetwork] = useState<boolean>(false);
  const { provider, account, chainId } = useWeb3React();
  const selectChain = useSelectChain();
  
  // 将链名称映射到ChainId枚举
  const getChainId = (chainName: string): ChainId => {
    switch (chainName) {
      case 'deepbrainchain':
        return ChainId.DBC;
      case 'bsc':
        return ChainId.BNB;
      default:
        return ChainId.DBC;
    }
  };

  // 当前链ID对应的链名称
  const getCurrentChainName = useCallback((): 'deepbrainchain' | 'bsc' | undefined => {
    if (NETWORK_SWITCH_DEBUG) {
      console.log("当前检测到的链ID:", chainId);
    }
    
    // 添加额外检查，避免临时状态造成误判
    if (chainId === 19880818) return 'deepbrainchain';
    if (chainId === 56) return 'bsc';
    
    // 检查provider中的信息
    if (provider) {
      try {
        const network = provider.network;
        if (NETWORK_SWITCH_DEBUG) {
          console.log("Provider网络信息:", network);
        }
        if (network && network.chainId === 19880818) return 'deepbrainchain';
        if (network && network.chainId === 56) return 'bsc';
      } catch (e) {
        console.error("获取网络信息出错:", e);
      }
    }
    
    return undefined;
  }, [chainId, provider]);

  // 使用项目的selectChain钩子切换到指定的网络
  const switchToNetwork = useCallback(async (chainName: 'deepbrainchain' | 'bsc') => {
    const targetChainId = getChainId(chainName);
    console.log("正在尝试切换到网络:", chainName, "链ID:", targetChainId);
    if (!targetChainId) {
      setError(`不支持的链: ${chainName}`);
      return false;
    }
    
    try {
      console.log(`正在切换到网络: ${chainName} (${targetChainId})`);
      // 调用前检查connector是否存在
      if (!selectChain) {
        console.error("selectChain函数不可用");
        setError("网络切换功能不可用");
        return false;
      }
      
      // 详细记录链ID类型
      console.log("目标链ID详情:", {
        targetChainId,
        type: typeof targetChainId,
        isChainIdEnum: targetChainId in ChainId
      });
      
      const success = await selectChain(targetChainId);
      if (success) {
        console.log(`成功切换到网络: ${chainName}`);
        
        // 添加延迟，让应用有时间完全处理网络变化
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 强制更新组件状态以反映新的网络
        if (chainName === sourceChain) {
          // 如果成功切换到源链，清除错误提示
          setError('');
        }
        
        return true;
      } else {
        console.log(`切换网络失败: ${chainName}`);
        return false;
      }
    } catch (error) {
      console.error(`切换网络错误:`, error);
      setError(`切换到${chainName}网络失败: ${error instanceof Error ? error.message : '未知错误'}`);
      return false;
    }
  }, [selectChain, sourceChain]);

  // 检测钱包当前连接的链是否与源链匹配
  const isConnectedToSourceChain = useCallback(() => {
    const currentChain = getCurrentChainName();
    const isMatched = currentChain === sourceChain;
    console.log(`网络匹配检查: 当前链=${currentChain}, 源链=${sourceChain}, 匹配=${isMatched}`);
    return isMatched;
  }, [getCurrentChainName, sourceChain]);

  // 当源链变化时自动切换网络，但仅在启用了自动切换选项时
  useEffect(() => {
    console.log("sourceChain 变化:", sourceChain, "自动切换:", autoSwitchNetwork);
    
    // 防止循环切换：只有当状态不匹配且启用了自动切换时才切换
    if (provider && account && autoSwitchNetwork) {
      // 检查当前是否已经在源链
      const isAlreadyOnSourceChain = isConnectedToSourceChain();
      
      // 添加防止循环切换的检查
      if (!isNetworkSwitchPending && !isAlreadyOnSourceChain) {
        console.log(`自动切换到源链 ${sourceChain} 中...`);
        
        // 设置标志防止重复切换
        isNetworkSwitchPending = true;
        
        switchToNetwork(sourceChain)
          .then(success => {
            if (success) {
              console.log(`自动切换到源链 ${sourceChain} 成功`);
              // 自动切换成功后清除任何错误提示
              setError('');
            } else {
              console.log(`自动切换到源链 ${sourceChain} 失败`);
            }
          })
          .catch(err => {
            console.error('自动切换网络失败:', err);
            setError(`自动切换网络失败: ${err instanceof Error ? err.message : '未知错误'}`);
          })
          .finally(() => {
            // 延迟重置标志
            setTimeout(() => {
              isNetworkSwitchPending = false;
              console.log('网络切换操作已完成，可以进行下一次切换');
            }, 5000);
          });
      } else if (isNetworkSwitchPending) {
        console.log('网络切换操作正在进行中，跳过重复切换');
      } else {
        console.log(`已经在源链 ${sourceChain} 上，无需切换`);
      }
    }
  }, [sourceChain, provider, account, switchToNetwork, autoSwitchNetwork, isConnectedToSourceChain]);

  // 处理链切换按钮点击
  const handleSwapChains = () => {
    const tempSource = sourceChain;
    const tempDest = destinationChain;
    
    setSourceChain(tempDest);
    setDestinationChain(tempSource);
  };

  // 处理源链选择变化
  const handleSourceChainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newChain = e.target.value as 'deepbrainchain' | 'bsc';
    setSourceChain(newChain);
  };

  const checkAndApproveToken = async (tokenAddress: string, spenderAddress: string, amount: string) => {
    if (!provider || !account) return false;
    
    try {
      const signer = provider.getSigner(account);
      const tokenContract = new ethers.Contract(
        tokenAddress,
        ['function approve(address spender, uint256 amount) returns (bool)', 'function allowance(address owner, address spender) view returns (uint256)'],
        signer
      );

      const allowance = await tokenContract.allowance(account, spenderAddress);
      if (allowance.lt(amount)) {
        const approveTx = await tokenContract.approve(spenderAddress, amount);
        await approveTx.wait();
      }
      return true;
    } catch (e) {
      console.error('授权失败:', e);
      return false;
    }
  };

  const handleSendTx = async (tx: any) => {
    if (!provider || !account) {
      setError('请先连接钱包');
      return;
    }
    
    try {
      // 打印交易详情用于调试
      console.log("交易详情:", {
        to: tx.transaction.to,
        data: tx.transaction.data,
        value: tx.transaction.value,
        type: tx.type,
        token: tx.token
      });

      const signer = provider.getSigner(account);
      
      // 构建交易请求
      const txRequest: any = {
        to: tx.transaction.to,
        data: tx.transaction.data,
      };

      // 处理 value 字段
      if (tx.transaction.value) {
        // 确保 value 是有效的十六进制字符串
        if (typeof tx.transaction.value === 'string' && tx.transaction.value.startsWith('0x')) {
          txRequest.value = tx.transaction.value;
        } else if (tx.transaction.value._hex) {
          txRequest.value = tx.transaction.value._hex;
        } else {
          // 如果都不是，尝试转换为BigNumber
          try {
            const valueAsBN = ethers.BigNumber.from(tx.transaction.value);
            txRequest.value = valueAsBN.toHexString();
          } catch (error) {
            console.error('无效的交易金额:', error);
            setError('无效的交易金额');
            return;
          }
        }
      } else {
        txRequest.value = '0x0'; // 如果没有 value，设置为 0
      }

      // 检查余额
      const balance = await provider.getBalance(account);
      const valueInWei = txRequest.value ? ethers.BigNumber.from(txRequest.value) : ethers.BigNumber.from(0);
      
      console.log('余额检查:', {
        balance: ethers.utils.formatEther(balance),
        required: ethers.utils.formatEther(valueInWei),
        valueHex: txRequest.value
      });

      if (balance.lt(valueInWei)) {
        setError(`余额不足，需要 ${ethers.utils.formatEther(valueInWei)} 代币`);
        return;
      }

      // 如果是代币转账，先检查授权
      if (tx.type === 'approve' && tx.token?.addressOrDenom) {
        const approved = await checkAndApproveToken(
          tx.token.addressOrDenom,
          tx.transaction.to,
          valueInWei.toString()
        );
        if (!approved) {
          setError('代币授权失败');
          return;
        }
      }

      console.log('发送交易:', txRequest);
      
      const txResponse = await signer.sendTransaction(txRequest);
      console.log('交易已发送:', txResponse.hash);
      await txResponse.wait();
      setError('');
      alert('交易已发送成功！');
    } catch (e: any) {
      console.error('交易失败:', e);
      if (e?.data?.message?.includes('insufficient value')) {
        setError('跨链手续费不足，请确保有足够的代币作为手续费');
      } else {
        setError('交易失败: ' + (e?.message || String(e)));
      }
    }
  };

  const handleClick = async () => {
    if (!amount || !recipient) {
      setError('请输入转账金额和接收地址');
      return;
    }

    // 如果当前有网络切换操作正在进行，等待完成
    if (isNetworkSwitchPending) {
      setError('网络切换操作正在进行中，请稍后再试');
      return;
    }

    // 检查网络是否匹配源链
    const isOnCorrectNetwork = isConnectedToSourceChain();
    if (!isOnCorrectNetwork) {
      // 如果启用了自动切换，尝试切换网络
      if (autoSwitchNetwork) {
        setError('正在尝试切换到正确的网络...');
        isNetworkSwitchPending = true;
        try {
          const success = await switchToNetwork(sourceChain);
          if (!success) {
            setError(`无法切换到${sourceChain === 'deepbrainchain' ? 'DBC' : 'BNB'}链，请手动切换`);
            isNetworkSwitchPending = false;
            return;
          }
          // 添加短暂延迟，确保网络已完全切换
          await new Promise(resolve => setTimeout(resolve, 1000));
        } finally {
          // 重置网络切换状态
          setTimeout(() => {
            isNetworkSwitchPending = false;
          }, 3000);
        }
      } else {
        // 否则显示警告并让用户手动切换
        setError(`请先将钱包切换到${sourceChain === 'deepbrainchain' ? 'DBC' : 'BNB'}链，或启用自动网络切换`);
        return;
      }
    }

    setError('');
    setTxs(null);
    try {
      const chainMetadata: any = {
        "bsc": {
            "blockExplorers": [
                {
                    "name": "BscScan",
                    "url": "https://bscscan.com",
                    "apiUrl": "https://api.bscscan.com/api",
                    "family": "etherscan"
                },
                {
                    "apiUrl": "https://api.bscscan.com/api",
                    "family": "etherscan",
                    "name": "BscScan",
                    "url": "https://bscscan.com"
                }
            ],
            "blocks": {
                "confirmations": 1,
                "estimateBlockTime": 3,
                "reorgPeriod": "finalized"
            },
            "chainId": 56,
            "deployer": {
                "name": "Abacus Works",
                "url": "https://www.hyperlane.xyz"
            },
            "displayName": "Binance Smart Chain",
            "displayNameShort": "Binance",
            "domainId": 56,
            "gasCurrencyCoinGeckoId": "binancecoin",
            "gnosisSafeTransactionServiceUrl": "https://safe-transaction-bsc.safe.global/",
            "name": "bsc",
            "nativeToken": {
                "decimals": 18,
                "name": "BNB",
                "symbol": "BNB"
            },
            "protocol": "ethereum",
            "rpcUrls": [
                {
                    "http": "https://bsc-dataseed1.bnbchain.org"
                },
                {
                    "http": "https://rpc.ankr.com/bsc"
                },
                {
                    "http": "https://bsc.drpc.org"
                },
                {
                    "http": "https://bscrpc.com"
                }
            ],
            "technicalStack": "other",
            "logoURI": "https://raw.githubusercontent.com/hyperlane-xyz/hyperlane-registry/main/chains/bsc/logo.svg"
        },
        "deepbrainchain": {
            "blockExplorers": [
                {
                    "apiUrl": "https://www.dbcscan.io/api",
                    "family": "blockscout",
                    "name": "dbcscan",
                    "url": "https://www.dbcscan.io"
                }
            ],
            "blocks": {
                "confirmations": 1,
                "estimateBlockTime": 6,
                "reorgPeriod": "finalized"
            },
            "chainId": 19880818,
            "deployer": {
                "name": "Abacus Works",
                "url": "https://www.hyperlane.xyz"
            },
            "displayName": "Deep Brain Chain",
            "domainId": 19880818,
            "gasCurrencyCoinGeckoId": "deepbrain-chain",
            "name": "deepbrainchain",
            "nativeToken": {
                "decimals": 18,
                "name": "DBC",
                "symbol": "DBC"
            },
            "protocol": "ethereum",
            "rpcUrls": [
                {
                    "http": "https://rpc2.dbcwallet.io"
                }
            ],
            "technicalStack": "polkadotsubstrate",
            "logoURI": "https://raw.githubusercontent.com/hyperlane-xyz/hyperlane-registry/main/chains/deepbrainchain/logo.svg"
        }
    }

    const tokens = [
      {
        chainName: 'bsc',
        standard: 'EvmHypCollateral',
        decimals: 18,
        symbol: 'USDT',
        name: 'Tether USD',
        addressOrDenom: '0xF528Aa0c86cBBbBb4288ecb8133D317DD528FD88',
        collateralAddressOrDenom: '0x55d398326f99059fF775485246999027B3197955',
        connections: [
          { token: 'ethereum|deepbrainchain|0x5155101187F8Faa1aD8AfeC7820c801870F81D52' },
        ],
      },
      {
        chainName: 'deepbrainchain',
        standard: 'EvmHypSynthetic',
        decimals: 18,
        symbol: 'USDT',
        name: 'Tether USD',
        addressOrDenom: '0x5155101187F8Faa1aD8AfeC7820c801870F81D52',
        connections: [
          { token: 'ethereum|bsc|0xF528Aa0c86cBBbBb4288ecb8133D317DD528FD88' },
        ],
      },
    ];

      const warpCoreConfig = { tokens, options: {} };
      const multiProvider = new MultiProtocolProvider(chainMetadata);

      console.log('初始化配置:', {
        amount,
        recipient,
        multiProvider,
        warpCoreConfig,
        chainMetadata,
      });
      
      const warpCore = WarpCore.FromConfig(multiProvider, warpCoreConfig);

      const tokenIndex = warpCore.tokens.findIndex((token: any) => token.chainName === sourceChain);

      if (tokenIndex === -1) {
        setError('未找到对应的代币配置');
        return;
      }

      const originToken = warpCore.tokens[tokenIndex];
      const originTokenAmount = originToken.amount(ethers.utils.parseUnits(amount, 18).toString());

      const txs = await warpCore.getTransferRemoteTxs({
        originTokenAmount,
        destination: destinationChain,
        sender: account || '',
        recipient,
      });

      setTxs(txs);
    } catch (e: any) {
      console.error('生成交易失败:', e);
      setError(e?.message || String(e));
    }
  };

  // 添加网络变化监听调试
  useEffect(() => {
    if (NETWORK_SWITCH_DEBUG) {
      console.log("==== 网络变化监听 ====");
      console.log("监听chainId变化:", chainId);
      console.log("当前源链:", sourceChain);
      console.log("=======================");
    }
  }, [chainId, sourceChain]);

  // 添加组件卸载时的清理工作
  useEffect(() => {
    return () => {
      if (NETWORK_SWITCH_DEBUG) {
        console.log("组件即将卸载，重置网络切换状态");
      }
      // 重置网络切换状态
      isNetworkSwitchPending = false;
    };
  }, []);

  return (
    <FormWrapper>
      <AutoColumn gap="16px">
        <AutoSwitchContainer>
          <SwitchLabel>
            <span>自动切换网络</span>
            <SwitchInput 
              type="checkbox" 
              checked={autoSwitchNetwork} 
              onChange={(e) => setAutoSwitchNetwork(e.target.checked)} 
            />
            <SwitchSlider />
          </SwitchLabel>
        </AutoSwitchContainer>
        
        {/* 当网络不匹配且没有启用自动切换时显示警告 */}
        {!isConnectedToSourceChain() && !autoSwitchNetwork && (
          <NetworkMismatchWarning>
            <div>
              当前连接的网络与源链不匹配。
              请切换到 {sourceChain === 'deepbrainchain' ? 'DBC' : 'BNB'} 链。
            </div>
            <ButtonPrimary 
              onClick={() => switchToNetwork(sourceChain)} 
              style={{ padding: '6px 12px', fontSize: '14px', marginLeft: '8px' }}
            >
              切换网络
            </ButtonPrimary>
          </NetworkMismatchWarning>
        )}
        
        <RowBetween>
          <ChainLabel>从:</ChainLabel>
          <ChainLabel>到:</ChainLabel>
        </RowBetween>
        
        <ChainSelectorContainer>
          <ChainSelector>
            <ChainSelect 
              value={sourceChain} 
              onChange={handleSourceChainChange}
            >
              <option value="deepbrainchain">DBC</option>
              <option value="bsc">BSC</option>
            </ChainSelect>
          </ChainSelector>
          
          <SwitchButton onClick={handleSwapChains} type="button">
            <svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
              <path d="M7.56 17.01L8.68875 15.8812L6.48375 13.6762H11.55V12.1012H6.48375L8.68875 9.89625L7.56 8.7675L3.43875 12.8887L7.56 17.01ZM13.44 12.4425L17.5612 8.32125L13.4662 4.2L12.3112 5.32875L14.5162 7.53375H9.45V9.10875H14.5162L12.3112 11.3137L13.44 12.4425ZM10.5 21C9.065 21 7.70875 20.7244 6.43125 20.1731C5.15375 19.6219 4.03813 18.8694 3.08437 17.9156C2.13062 16.9619 1.37812 15.8462 0.826875 14.5687C0.275625 13.2912 0 11.935 0 10.5C0 9.0475 0.275625 7.6825 0.826875 6.405C1.37812 5.1275 2.13062 4.01625 3.08437 3.07125C4.03813 2.12625 5.15375 1.37812 6.43125 0.826875C7.70875 0.275625 9.065 0 10.5 0C11.9525 0 13.3175 0.275625 14.595 0.826875C15.8725 1.37812 16.9837 2.12625 17.9287 3.07125C18.8738 4.01625 19.6219 5.1275 20.1731 6.405C20.7244 7.6825 21 9.0475 21 10.5C21 11.935 20.7244 13.2912 20.1731 14.5687C19.6219 15.8462 18.8738 16.9619 17.9287 17.9156C16.9837 18.8694 15.8725 19.6219 14.595 20.1731C13.3175 20.7244 11.9525 21 10.5 21ZM10.5 19.425C12.985 19.425 15.0937 18.5544 16.8262 16.8131C18.5587 15.0719 19.425 12.9675 19.425 10.5C19.425 8.015 18.5587 5.90625 16.8262 4.17375C15.0937 2.44125 12.985 1.575 10.5 1.575C8.0325 1.575 5.92812 2.44125 4.18687 4.17375C2.44563 5.90625 1.575 8.015 1.575 10.5C1.575 12.9675 2.44563 15.0719 4.18687 16.8131C5.92812 18.5544 8.0325 19.425 10.5 19.425Z" fill="currentColor"></path>
            </svg>
          </SwitchButton>
          
          <ChainSelector>
            <ChainSelect 
              value={destinationChain}
              onChange={(e) => setDestinationChain(e.target.value as 'deepbrainchain' | 'bsc')}
            >
              <option value="bsc">BSC</option>
              <option value="deepbrainchain">DBC</option>
            </ChainSelect>
          </ChainSelector>
        </ChainSelectorContainer>
        
        <InputContainer>
          <SectionTitle>转账金额:</SectionTitle>
          <InputField
            type="text"
            placeholder="输入转账金额"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </InputContainer>
        
        <InputContainer>
          <SectionTitle>接收地址:</SectionTitle>
          <InputField
            type="text"
            placeholder="输入接收地址"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </InputContainer>
        
        <ActionButton onClick={handleClick}>
          生成跨链交易对象
        </ActionButton>
        
        {error && <ErrorText>{error}</ErrorText>}
        
        {txs && Array.isArray(txs) && txs.map((tx: any, idx: number) => (
          <TransactionPreview key={idx}>
            <TransactionData>
              {formatTransactionData(tx)}
            </TransactionData>
            <ActionButton onClick={() => handleSendTx(tx)}>
              发起链上交易
            </ActionButton>
          </TransactionPreview>
        ))}
      </AutoColumn>
    </FormWrapper>
  );
}