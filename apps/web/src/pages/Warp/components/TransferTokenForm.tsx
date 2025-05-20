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
import { ChainLogo } from 'components/Logo/ChainLogo';

// Update debug messages
const NETWORK_SWITCH_DEBUG = true;

// 简化配置
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
  // max-width: 480px;
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
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  gap: 12px;
`;

const ChainSelector = styled.div`
  position: relative;
  min-width: 200px;
`;

const ChainLabel = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.neutral1};
`;

const ChainSelect = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: ${({ theme }) => theme.surface2};
  border: 1px solid ${({ theme }) => theme.surface3};
  border-radius: 12px;
  cursor: pointer;
  
  &:hover {
    border-color: ${({ theme }) => theme.accent1};
  }
`;

const ChainOption = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  cursor: pointer;
  
  &:hover {
    background: ${({ theme }) => theme.surface3};
  }
`;

const ChainIcon = styled.div`
  width: 24px;
  height: 24px;
  margin-right: 8px;
`;

const ChainName = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.neutral1};
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
  margin-bottom: 6px;
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

const InputLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.neutral2};
  margin-bottom: 8px;
`;

const InputField = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  padding-right: 80px;
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

// 添加新的样式组件
const TransactionLink = styled.a`
  color: ${({ theme }) => theme.accent1};
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const TransactionStatus = styled.div<{ status: 'success' | 'pending' | 'error' }>`
  padding: 12px;
  border-radius: 12px;
  background-color: ${({ status, theme }) => 
    status === 'success' ? 'rgba(0, 168, 107, 0.1)' :
    status === 'error' ? 'rgba(240, 50, 50, 0.1)' :
    'rgba(255, 171, 0, 0.06)'};
  color: ${({ status, theme }) => 
    status === 'success' ? '#00a86b' :
    status === 'error' ? '#e53935' :
    '#ff9800'};
  margin-bottom: 12px;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

// Add new styled components
const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

const RecipientInfo = styled.div`
  padding: 12px;
  background: ${({ theme }) => theme.surface2};
  border-radius: 12px;
  font-size: 14px;
  color: ${({ theme }) => theme.neutral2};
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AddressText = styled.span`
  color: ${({ theme }) => theme.neutral1};
  font-family: monospace;
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
      `Token: ${tx.token.symbol} (${tx.token.chainName})` : '';
    
    // 构造格式化文本
    return `Type: ${txType}\nSent to:\n${formatLongString(txTo)}\n\nAmount: ${txValue}\n${tokenInfo}`;
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

// Add validation function
const validateAmount = (value: string): string => {
  // 直接允许数字和一个小数点
  if (value === '.') return '0.';
  
  // 如果为空，返回空字符串
  if (!value) return '';
  
  // 处理输入的数字和小数点
  let result = '';
  let hasDecimal = false;
  
  for (let i = 0; i < value.length; i++) {
    const char = value[i];
    
    // 允许数字
    if (char >= '0' && char <= '9') {
      result += char;
    }
    // 只允许一个小数点
    else if (char === '.' && !hasDecimal) {
      result += char;
      hasDecimal = true;
    }
  }
  
  // 确保小数位不超过18位
  if (hasDecimal) {
    const parts = result.split('.');
    if (parts.length === 2 && parts[1].length > 18) {
      result = parts[0] + '.' + parts[1].slice(0, 18);
    }
  }
  
  return result;
};

// 添加防抖hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function TransferTokenForm() {
  const [txs, setTxs] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [sourceChain, setSourceChain] = useState<'deepbrainchain' | 'bsc'>('deepbrainchain');
  const [destinationChain, setDestinationChain] = useState<'deepbrainchain' | 'bsc'>('bsc');
  const [txStatus, setTxStatus] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [lastTxHash, setLastTxHash] = useState<string>('');
  const [lastTxChain, setLastTxChain] = useState<'deepbrainchain' | 'bsc'>('deepbrainchain');
  
  const { provider, account, chainId } = useWeb3React();
  const selectChain = useSelectChain();

  // 将链名称映射到ChainId枚举 - 简单化映射
  const getChainId = useCallback((chainName: 'deepbrainchain' | 'bsc'): ChainId => {
    return chainName === 'deepbrainchain' ? ChainId.DBC : ChainId.BNB;
  }, []);

  // 当前连接的链 - 极简实现
  const currentChain = useCallback((): 'deepbrainchain' | 'bsc' | undefined => {
    return chainId === ChainId.DBC ? 'deepbrainchain' : 
           chainId === ChainId.BNB ? 'bsc' : undefined;
  }, [chainId]);

  // 极简化网络切换函数
  const switchNetwork = useCallback(async (targetChain: 'deepbrainchain' | 'bsc'): Promise<boolean> => {
    try {
      if (currentChain() === targetChain) return true;
      
      const targetChainId = getChainId(targetChain);
      if (!selectChain) throw new Error('Network switching not available');
      
      // 确保返回值为 boolean
      const success = await selectChain(targetChainId);
      return !!success;
    } catch (error) {
      console.error('Network switch failed:', error);
      setError(`Network switch error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  }, [currentChain, getChainId, selectChain]);

  // 自动切换到源链
  useEffect(() => {
    // 当链ID变化或源链变化时，检查是否需要切换
    const current = currentChain();
    if (provider && current !== sourceChain) {
      switchNetwork(sourceChain).catch(console.error);
    }
  }, [chainId, sourceChain, provider, currentChain, switchNetwork]);

  // 处理链切换按钮点击 - 交换源链和目标链
  const handleSwapChains = useCallback(() => {
    // 直接交换源链和目标链
    const newSourceChain = destinationChain;
    const newDestinationChain = sourceChain;
    setSourceChain(newSourceChain);
    setDestinationChain(newDestinationChain);
  }, [sourceChain, destinationChain]);

  const checkAndApproveToken = async (tokenAddress: string, spenderAddress: string, amount: string) => {
    if (!provider || !account) return false;
    
    try {
      const signer = provider.getSigner(account);
      const tokenContract = new ethers.Contract(
        tokenAddress,
        ['function approve(address spender, uint256 amount) returns (bool)', 'function allowance(address owner, address spender) view returns (uint256)', 'function symbol() view returns (string)'],
        signer
      );

      console.log("Checking token approval:", {
        owner: account,
        spender: spenderAddress,
        amount: amount
      });
      const allowance = await tokenContract.allowance(account, spenderAddress);
      console.log(`Current allowance: ${ethers.utils.formatUnits(allowance, 18)}`);
      
      // 获取代币符号以增强用户体验
      let tokenSymbol = '';
      try {
        tokenSymbol = await tokenContract.symbol();
      } catch (e) {
        console.log("Cannot get token symbol", e);
        tokenSymbol = 'Token';
      }
      
      if (allowance.lt(amount)) {
        console.log(`Insufficient allowance, approving: ${amount}`);
        setTxStatus(`Approving ${tokenSymbol}...`);
        setError('Insufficient allowance, initiating approval transaction...');
        
        // 使用最大值进行授权，避免将来需要重复授权
        const maxUint256 = ethers.constants.MaxUint256;
        const approveTx = await tokenContract.approve(spenderAddress, maxUint256);
        
        console.log('Approval transaction sent:', approveTx.hash);
        setError(`Approval transaction sent, waiting for confirmation...\nTransaction hash: ${approveTx.hash}`);
        setTxStatus(`${tokenSymbol} approval in progress...`);
        
        const receipt = await approveTx.wait();
        console.log('Approval transaction confirmed:', receipt.transactionHash);
        setError('');
        setTxStatus(`${tokenSymbol} approved! Processing cross-chain transfer...`);
        
        return true;
      } else {
        console.log('Sufficient allowance, no additional approval needed');
        return true;
      }
    } catch (e: any) {
      console.log('Approval process error:', e);
      setError(`Approval process error: ${e?.message || String(e)}`);
      setTxStatus('Authorization failed');
      setIsProcessing(false);
      
      return false;
    }
  };

  // 执行单个交易
  const executeTx = async (tx: any) => {
    if (!provider || !account) {
      setError('Please enter transfer amount and recipient address');
      return false;
    }
    
    try {
      // 打印交易详情用于调试
      console.log("Transaction details:", {
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
            return false;
          }
        }
      } else {
        txRequest.value = '0x0'; // 如果没有 value，设置为 0
      }

      // 检查余额
      const balance = await provider.getBalance(account);
      const valueInWei = txRequest.value ? ethers.BigNumber.from(txRequest.value) : ethers.BigNumber.from(0);
      
      console.log('Balance check:', {
        balance: ethers.utils.formatEther(balance),
        required: ethers.utils.formatEther(valueInWei),
        valueHex: txRequest.value
      });

      if (balance.lt(valueInWei)) {
        const errorMsg = `余额不足，需要 ${ethers.utils.formatEther(valueInWei)} 代币`;
        setError(errorMsg);
        return false;
      }

      // 自动处理代币授权
      // 检查是否需要代币授权
      if (tx.token?.addressOrDenom) {
        console.log('Detected token transaction, preparing to check approval');
        setTxStatus('Checking token approval...');
        
        // 对于所有涉及代币的交易，确保授权充足
        const approved = await checkAndApproveToken(
          tx.token.addressOrDenom,
          tx.transaction.to,
          tx.type === 'approve' && tx.transaction.value ? 
            ethers.BigNumber.from(tx.transaction.value).toString() : 
            ethers.utils.parseUnits(amount, 18).toString()
        );
        
        if (!approved) {
          // 授权失败信息已在checkAndApproveToken中设置
          return false;
        }
      }

      console.log('Sending transaction:', txRequest);
      setTxStatus('Transaction sent, waiting for confirmation...');
      setError('Transaction in progress, please wait for confirmation...');
      
      const txResponse = await signer.sendTransaction(txRequest);
      console.log('Transaction sent:', txResponse.hash);
      setLastTxHash(txResponse.hash);
      setLastTxChain(sourceChain);
      setError(`Transaction confirmed`);
      setTxStatus('Transaction confirmed');
      
      await txResponse.wait();
      console.log('Transaction confirmed');
      return true;
    } catch (e: any) {
      console.log('Transaction execution error:', e);
      handleTransactionError(e);
      return false;
    }
  };

  // 执行所有交易
  const executeAllTransactions = async (transactions: any[]) => {
    if (!transactions || transactions.length === 0) {
      setError('No executable transactions');
      setIsProcessing(false);
      return;
    }

    setIsProcessing(true);
    setTxStatus('Starting cross-chain transaction...');
    setError(''); // 清除之前的错误信息

    // 按顺序执行所有交易
    try {
      for (let i = 0; i < transactions.length; i++) {
        setTxStatus(`Processing step ${i+1}/${transactions.length}...`);
        const success = await executeTx(transactions[i]);
        if (!success) {
          // 错误信息已经在executeTx中设置
          setIsProcessing(false);
          return;
        }
      }
      
      // 所有交易都成功
      setTxStatus('All transactions completed! Cross-chain transfer successful');
      setError('');
      
      // 交易成功后延迟重置表单状态
      setTimeout(() => {
        resetForm(true); // 重置表单但保留成功消息
        
        // 5秒后清除成功状态消息
        setTimeout(() => {
          setTxStatus('');
        }, 5000);
      }, 0);
    } catch (e: any) {
      console.log('Transaction generation failed:', e);
      handleTransactionError(e);
    } finally {
      setIsProcessing(false);
    }
  };

  // 统一处理交易错误
  const handleTransactionError = (e: any) => {
    console.log('Transaction failed:', e);
    
    let errorMessage = '';
    
    // 根据错误类型设置不同的错误信息
    if (e?.code === 'ACTION_REJECTED') {
      errorMessage = 'User canceled the transaction';
    } else if (e?.data?.message?.includes('insufficient value')) {
      errorMessage = 'Cross-chain transaction fee insufficient, please ensure sufficient tokens for transaction fees';
    } else if (e?.message?.includes('transaction failed')) {
      errorMessage = 'Transaction execution failed, please check your balance';
    } else if (e?.message?.includes('gas required exceeds allowance')) {
      errorMessage = 'Gas fee insufficient, please ensure sufficient tokens for mining fees';
    } else if (e?.message?.includes('nonce too low')) {
      errorMessage = 'Transaction Nonce value too low, please refresh page and try again';
    } else if (e?.message?.includes('replacement fee too low')) {
      errorMessage = 'Replacement transaction fee too low, please wait for current transaction to complete';
    } else {
      errorMessage = `Transaction failed: ${e?.message || 'Unknown error'}`;
    }
    
    // 设置错误信息
    setError(errorMessage);
    // 清除之前的交易状态
    setTxStatus('Transaction failed');
  };

  // 重置表单状态的函数
  const resetForm = (keepSuccessMessage = false) => {
    // 重置输入字段
    setAmount('');
    
    // 重置交易相关状态
    setTxs(null);
    setIsProcessing(false);
    
    // 不再清除交易状态和哈希
    if (!keepSuccessMessage) {
      setError('');
      setTxStatus('');
      setLastTxHash('');  // 清除上一次的交易哈希
    }
  };

  // 获取链的浏览器URL
  const getExplorerUrl = (chain: 'deepbrainchain' | 'bsc', hash: string) => {
    if (chain === 'deepbrainchain') {
      return `https://www.dbcscan.io/tx/${hash}`;
    } else {
      return `https://bscscan.com/tx/${hash}`;
    }
  };

  const handleClick = async () => {
    if (isProcessing) return;
    
    if (!amount) {
      setError('Please enter transfer amount');
      return;
    }

    if (!account) {
      setError('Please connect your wallet');
      return;
    }

    const recipient = account;
    
    // 确保当前在正确的网络上
    if (currentChain() !== sourceChain) {
      setError('Switching to correct network...');
      const success = await switchNetwork(sourceChain);
      if (!success) {
        setError(`Unable to switch to ${sourceChain}. Please switch manually.`);
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // 重置所有交易相关的状态
    setError('');
    setTxs(null);
    setIsProcessing(true);
    setTxStatus('Preparing...');
    setLastTxHash('');  // 清除上一次的交易哈希
    setLastTxChain(sourceChain);  // 重置为当前源链
    
    try {
      const chainMetadata: any = {
        "bsc": {
          "blockExplorers": [
            {
              "name": "BscScan",
              "url": "https://bscscan.com",
              "apiUrl": "https://api.bscscan.com/api",
              "family": "etherscan"
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
      };

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
      
      console.log('Initializing configuration:', {
        amount,
        recipient,
        multiProvider,
        warpCoreConfig,
        chainMetadata,
      });
      
      const warpCore = WarpCore.FromConfig(multiProvider, warpCoreConfig);

      const tokenIndex = warpCore.tokens.findIndex((token: any) => token.chainName === sourceChain);

      if (tokenIndex === -1) {
        setError('Token configuration not found');
        setIsProcessing(false);
        return;
      }

      const originToken = warpCore.tokens[tokenIndex];
      const originTokenAmount = originToken.amount(ethers.utils.parseUnits(amount, 18).toString());

      setTxStatus('Generating cross-chain transaction...');
      const transactions = await warpCore.getTransferRemoteTxs({
        originTokenAmount,
        destination: destinationChain,
        sender: account || '',
        recipient,
      });

      setTxs(transactions);
      
      // 自动执行所有交易
      await executeAllTransactions(transactions);
      
    } catch (e: any) {
      console.log('Transaction generation failed:', e);
      handleTransactionError(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <FormWrapper>
      <AutoColumn gap="16px">
        <ChainSelectorContainer>
          <div className='flex flex-col'>
          <ChainLabel>From:</ChainLabel>
          <ChainSelector>
            <ChainSelect as="div">
              <ChainIcon>
                <ChainLogo chainId={chainConfigs[sourceChain].chainId} size={24} />
              </ChainIcon>
              <ChainName>{chainConfigs[sourceChain].name}</ChainName>
            </ChainSelect>
          </ChainSelector>
          </div>
       
          
          <SwitchButton onClick={handleSwapChains} type="button">
            <svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
              <path d="M7.56 17.01L8.68875 15.8812L6.48375 13.6762H11.55V12.1012H6.48375L8.68875 9.89625L7.56 8.7675L3.43875 12.8887L7.56 17.01ZM13.44 12.4425L17.5612 8.32125L13.4662 4.2L12.3112 5.32875L14.5162 7.53375H9.45V9.10875H14.5162L12.3112 11.3137L13.44 12.4425ZM10.5 21C9.065 21 7.70875 20.7244 6.43125 20.1731C5.15375 19.6219 4.03813 18.8694 3.08437 17.9156C2.13062 16.9619 1.37812 15.8462 0.826875 14.5687C0.275625 13.2912 0 11.935 0 10.5C0 9.0475 0.275625 7.6825 0.826875 6.405C1.37812 5.1275 2.13062 4.01625 3.08437 3.07125C4.03813 2.12625 5.15375 1.37812 6.43125 0.826875C7.70875 0.275625 9.065 0 10.5 0C11.9525 0 13.3175 0.275625 14.595 0.826875C15.8725 1.37812 16.9837 2.12625 17.9287 3.07125C18.8738 4.01625 19.6219 5.1275 20.1731 6.405C20.7244 7.6825 21 9.0475 21 10.5C21 11.935 20.7244 13.2912 20.1731 14.5687C19.6219 15.8462 18.8738 16.9619 17.9287 17.9156C16.9837 18.8694 15.8725 19.6219 14.595 20.1731C13.3175 20.7244 11.9525 21 10.5 21ZM10.5 19.425C12.985 19.425 15.0937 18.5544 16.8262 16.8131C18.5587 15.0719 19.425 12.9675 19.425 10.5C19.425 8.015 18.5587 5.90625 16.8262 4.17375C15.0937 2.44125 12.985 1.575 10.5 1.575C8.0325 1.575 5.92812 2.44125 4.18687 4.17375C2.44563 5.90625 1.575 8.015 1.575 10.5C1.575 12.9675 2.44563 15.0719 4.18687 16.8131C5.92812 18.5544 8.0325 19.425 10.5 19.425Z" fill="currentColor"></path>
            </svg>
          </SwitchButton>
          
          <div className='flex flex-col'>
            <ChainLabel>To:</ChainLabel>
            <ChainSelector>
            <ChainSelect as="div">
              <ChainIcon>
                <ChainLogo chainId={chainConfigs[destinationChain].chainId} size={24} />
              </ChainIcon>
              <ChainName>{chainConfigs[destinationChain].name}</ChainName>
            </ChainSelect>
          </ChainSelector>
          </div>
        
        </ChainSelectorContainer>
        
        <InputContainer>
          <InputLabel>Amount</InputLabel>
          <InputField
            type="text"
            inputMode="decimal"
            placeholder={`Enter USDT amount for cross-chain transfer`}
            value={amount}
            onChange={(e) => {
              // 直接设置输入值，然后通过验证函数清理
              const validatedValue = validateAmount(e.target.value);
              setAmount(validatedValue);
            }}
          />
        </InputContainer>
        
        <RecipientInfo>
          <span>Transfer to your address:</span>
          <AddressText>
            {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Please connect wallet'}
          </AddressText>
        </RecipientInfo>
        
        {/* 交易状态显示 */}
        {txStatus && (
          <TransactionStatus 
            status={
              txStatus.includes('failed') ? 'error' :
              txStatus.includes('success') ? 'success' : 
              'pending'
            }
          >
            <div>{txStatus}</div>
            {lastTxHash && (
              <div>
                Transaction Hash: <TransactionLink 
                  href={getExplorerUrl(lastTxChain, lastTxHash)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {lastTxHash.slice(0, 6)}...{lastTxHash.slice(-4)}
                </TransactionLink>
              </div>
            )}
          </TransactionStatus>
        )}
        
        {/* 错误信息显示 */}
        {error && !error.includes('Transaction Hash') && <ErrorText>{error}</ErrorText>}
        
        <ActionButton onClick={handleClick} disabled={isProcessing}>
          {isProcessing ? 'Processing...' : 'Cross-chain USDT'}
        </ActionButton>
      </AutoColumn>
    </FormWrapper>
  );
}