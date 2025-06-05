import { MultiProtocolProvider, WarpCore } from '@hyperlane-xyz/sdk';
import { useState, useEffect, useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import styled, { keyframes } from 'styled-components';
import { ButtonPrimary } from 'components/Button';
import Column, { AutoColumn } from 'components/Column';
import { RowBetween } from 'components/Row';
import { ArrowLeft, ArrowRight, ExternalLink } from 'react-feather';
import useSelectChain from 'hooks/useSelectChain';
import { ChainId } from '@ubeswap/sdk-core';
import { ChainLogo } from 'components/Logo/ChainLogo';
import { useSearchParams } from 'react-router-dom';
import { useAccountDrawer } from 'components/AccountDrawer/MiniPortfolio/hooks'
import { sendAnalyticsEvent } from 'analytics'
import { InterfaceEventName, InterfaceElementName } from '@ubeswap/analytics-events'
import { BigNumber } from 'ethers';
import { ThemedText } from 'theme/components';

// 添加FeeQuotes接口定义，使用any避免类型错误
interface FeeQuotes {
  interchainQuote: any;
  localQuote: any;
}

// TokenAmount接口定义
interface TokenAmount {
  amount: string;
  token?: {
    decimals: number;
  };
}

// 更新交易类型定义
interface WarpTransaction {
  type: string;
  transaction: {
    to?: string;
    data: string;
    value?: string;
    gasLimit?: string;
  };
}

// 在文件开头添加类型定义
interface GasEstimate {
  gasLimit: string;
  gasPrice: string;
  totalGasFee: string;
  interchainGas: string;
  localGas: string;
}

// 添加验证函数
const validateAmount = (value: string, maxAmount?: string): string => {
  // Allow numbers and a single decimal point directly
  if (value === '.') return '0.';

  // If empty, return an empty string
  if (!value) return '';

  // Process input numbers and decimal points
  let result = '';
  let hasDecimal = false;

  for (let i = 0; i < value.length; i++) {
    const char = value[i];

    // Allow numbers
    if (char >= '0' && char <= '9') {
      result += char;
    }
    // Allow only one decimal point
    else if (char === '.' && !hasDecimal) {
      result += char;
      hasDecimal = true;
    }
  }

  // Ensure decimal places do not exceed 18
  if (hasDecimal) {
    const parts = result.split('.');
    if (parts.length === 2 && parts[1].length > 18) {
      result = parts[0] + '.' + parts[1].slice(0, 18);
    }
  }

  // Check max value limit
  if (maxAmount && result) {
    const inputValue = parseFloat(result);
    const maxValue = parseFloat(maxAmount);

    if (!isNaN(inputValue) && !isNaN(maxValue) && inputValue > maxValue) {
      result = maxAmount;
    }
  }

  return result;
};

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

// USDT合约地址
const USDT_CONTRACT_ADDRESSES = {
  deepbrainchain: '0x5155101187F8Faa1aD8AfeC7820c801870F81D52',
  bsc: '0x55d398326f99059fF775485246999027B3197955'
};

// 更新链配置
const chainMetadata = {
  deepbrainchain: {
    name: 'Deep Brain Chain',
    chainId: '0x12F5B72',
    domainId: 19880818,
    protocol: 'ethereum' as const,
    rpcUrls: [{
      http: 'https://rpc2.dbcwallet.io',
      pagination: { limit: 10, offset: true }
    }],
    nativeToken: {
      name: 'DBC',
      symbol: 'DBC',
      decimals: 18
    },
    blockExplorers: [{ url: 'https://www.dbcscan.io' }],
    blocks: { confirmations: 1 },
    mailbox: '0x5155101187F8Faa1aD8AfeC7820c801870F81D52'
  },
  bsc: {
    name: 'BNB Smart Chain',
    chainId: '0x38',
    domainId: 56,
    protocol: 'ethereum' as const,
    rpcUrls: [{
      http: 'https://bsc-dataseed1.bnbchain.org',
      pagination: { limit: 10, offset: true }
    }],
    nativeToken: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18
    },
    blockExplorers: [{ url: 'https://bscscan.com' }],
    blocks: { confirmations: 1 },
    mailbox: '0x55d398326f99059fF775485246999027B3197955'
  }
};

// 更新代币配置
const tokens = [
  {
    name: 'USDT',
    symbol: 'USDT',
    decimals: 18,
    chainName: 'deepbrainchain',
    addressOrDenom: '0x5155101187F8Faa1aD8AfeC7820c801870F81D52',
    amount: (amount: string) => ({ type: 'uint256', value: amount })
  },
  {
    name: 'USDT',
    symbol: 'USDT',
    decimals: 18,
    chainName: 'bsc',
    addressOrDenom: '0x55d398326f99059fF775485246999027B3197955',
    amount: (amount: string) => ({ type: 'uint256', value: amount })
  }
];

// 添加 URL 生成函数
const getContractExplorerUrl = (chain: 'deepbrainchain' | 'bsc', address: string): string => {
  const baseUrl = chain === 'deepbrainchain'
    ? 'https://www.dbcscan.io/address/'
    : 'https://bscscan.com/address/';
  return `${baseUrl}${address}`;
};

const getExplorerUrl = (chain: 'deepbrainchain' | 'bsc', txHash: string): string => {
  const baseUrl = chain === 'deepbrainchain'
    ? 'https://www.dbcscan.io/tx/'
    : 'https://bscscan.com/tx/';
  return `${baseUrl}${txHash}`;
};

// 样式组件
const FormWrapper = styled(Column)`
  width: 100%;
  max-width: 600px;
  margin: 0.5rem auto;
  background-color: ${({ theme }) => theme.surface1};
  border-radius: 24px;
  padding: 1.5rem;
  border: 1px solid ${({ theme }) => theme.surface3};
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.04);
  border-radius: 16px;
  
  @media (max-width: 768px) {
    max-width: 100%;
    margin: 0;
    padding: 1rem;
    border-radius: 0;
    border-left: none;
    border-right: none;
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
  gap: 0.75rem;
  position: relative;
  min-height: 120px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
    margin-bottom: 1rem;
    min-height: auto;
  }
`;

const ChainSelector = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  height: 100%; /* 确保高度一致 */
`;

const ChainSelect = styled.div`
  display: flex;
  align-items: center;
  padding: 0.875rem 1rem;
  background-color: ${({ theme }) => theme.surface2};
  border: 1px solid ${({ theme }) => theme.surface3};
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 64px;
  margin-top: 4px; /* 增加顶部边距，使标签和选择器对齐更美观 */
  
  &:hover {
    border-color: ${({ theme }) => theme.accent1};
    background-color: ${({ theme }) => `${theme.surface2}dd`};
  }

  @media (max-width: 480px) {
    padding: 0.75rem;
    height: 56px;
  }
`;

const ChainIcon = styled.div`
  width: 36px;
  height: 36px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
    margin-right: 10px;
  }
`;

const ChainLabel = styled.div`
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.neutral2};

  @media (max-width: 480px) {
    font-size: 14px;
    margin-bottom: 0.25rem;
  }
`;

const ChainName = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.neutral1};

  @media (max-width: 480px) {
    font-size: 15px;
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
  position: absolute;
  left: 50%;
  top: 60%;
  transform: translate(-50%, -50%);
  transition: all 0.2s ease;
  z-index: 2;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);

  &:hover {
    background: ${({ theme }) => theme.surface3};
    transform: translate(-50%, -50%) scale(1.05);
    box-shadow: 0px 6px 14px rgba(0, 0, 0, 0.12);
  }
  
  &:active {
    transform: translate(-50%, -50%) scale(0.95);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: default;
  }

  @media (max-width: 480px) {
    position: relative;
    left: auto;
    top: auto;
    transform: rotate(90deg);
    margin: -0.5rem auto;
    width: 40px;
    height: 40px;

    &:hover {
      transform: rotate(90deg) scale(1.05);
    }
    
    &:active {
      transform: rotate(90deg) scale(0.95);
    }
  }
`;

const InputContainer = styled.div`
  margin-bottom: 1rem;
  position: relative;
`;

const InputLabel = styled.div`
  font-size: 15px;
  color: ${({ theme }) => theme.neutral2};
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const InputField = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  background-color: ${({ theme }) => theme.surface2};
  border: 1px solid ${({ theme }) => theme.surface3};
  border-radius: 16px;
  font-size: 16px;
  color: ${({ theme }) => theme.neutral1};
  outline: none;
  transition: all 0.2s ease;
  height: 56px;

  &::placeholder {
    color: ${({ theme }) => theme.neutral3};
  }

  &:focus {
    border-color: ${({ theme }) => theme.accent1};
    box-shadow: 0px 0px 0px 1px ${({ theme }) => theme.accent1}40;
  }

  @media (max-width: 480px) {
    padding: 0.75rem;
    font-size: 15px;
    height: 52px;
  }
`;

// 添加最大值按钮样式
const MaxButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: ${({ theme }) => theme.accent1}30;
  color: ${({ theme }) => theme.accent1};
  border: none;
  border-radius: 12px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.accent1}50;
  }
  
  &:active {
    transform: translateY(-50%) scale(0.97);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.div`
  color: ${({ theme }) => theme.critical};
  padding: 1rem 1.25rem;
  background-color: rgba(240, 50, 50, 0.1);
  border-radius: 16px;
  margin: 1rem 0;
  font-size: 15px;
  border: 1px solid rgba(240, 50, 50, 0.2);
  width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  box-sizing: border-box;

  @media (max-width: 480px) {
    padding: 0.875rem 1rem;
    font-size: 14px;
    margin: 0.75rem 0;
  }
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
  padding: 0;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  width: 100%;
  height: 56px;
  color: white;
  background: linear-gradient(90deg, ${({ theme }) => theme.accent1} 0%, ${({ theme }) => `${theme.accent1}dd`} 100%);
  transition: all 0.2s ease;
  text-transform: none;
  letter-spacing: 0;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0px 4px 12px ${({ theme }) => `${theme.accent1}40`};
  }

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    color: white;
  }

  @media (max-width: 480px) {
    height: 52px;
    font-size: 15px;
  }
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

const FormTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.neutral1};
  text-align: center;
  margin-bottom: 24px; // Adjust as needed within FormWrapper's padding

  @media screen and (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 20px;
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
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    text-decoration: underline;
  }

  svg {
    width: 16px;
    height: 16px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const TransactionStatus = styled.div<{ status: 'success' | 'pending' | 'error' }>`
  padding: 1rem 1.25rem;
  border-radius: 16px;
  background-color: ${({ status, theme }) =>
    status === 'success' ? 'rgba(0, 168, 107, 0.1)' :
      status === 'error' ? 'rgba(240, 50, 50, 0.1)' :
        'rgba(255, 171, 0, 0.08)'};
  color: ${({ status, theme }) =>
    status === 'success' ? '#00a86b' :
      status === 'error' ? '#e53935' :
        '#ff9800'};
  margin-bottom: 1rem;
  font-size: 15px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border: 1px solid ${({ status, theme }) =>
    status === 'success' ? 'rgba(0, 168, 107, 0.2)' :
      status === 'error' ? 'rgba(240, 50, 50, 0.2)' :
        'rgba(255, 171, 0, 0.2)'};

  @media (max-width: 480px) {
    padding: 0.875rem 1rem;
    font-size: 14px;
    gap: 0.5rem;
  }
`;

// Add new styled components
const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

const RecipientInfo = styled.div`
  padding: 0.875rem 1rem;
  background: ${({ theme }) => theme.surface2};
  border-radius: 16px;
  font-size: 15px;
  color: ${({ theme }) => theme.neutral2};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border: 1px solid ${({ theme }) => theme.surface3};
  height: 56px;

  @media (max-width: 480px) {
    padding: 0.75rem;
    font-size: 14px;
    margin-bottom: 1rem;
    height: auto;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

const AddressText = styled.span`
  color: ${({ theme }) => theme.neutral1};
  font-family: 'SF Mono', SFMono-Regular, ui-monospace, monospace;
  font-size: 14px;
  background: ${({ theme }) => theme.surface3}40;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;

  @media (max-width: 480px) {
    font-size: 13px;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

// 添加余额显示组件样式
const BalanceText = styled.div`
  color: ${({ theme }) => theme.neutral2};
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 8px;
  gap: 4px;
`;

const BalanceAmount = styled.span`
  color: ${({ theme }) => theme.neutral1};
  font-weight: 500;
  margin-left: 4px;
`;

const ContractLink = styled.div`
  display: flex;
  align-items: center;
  font-size: 13px;
  margin-top: 8px;
  color: ${({ theme }) => theme.neutral2};
  
  a {
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.accent1};
    text-decoration: none;
    margin-left: 4px;
    gap: 4px;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ContractAddress = styled.span`
  font-family: 'SF Mono', SFMono-Regular, ui-monospace, monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;

  @media (min-width: 768px) {
    max-width: 200px;
  }
`;

// 添加安全相关的样式组件
const SecurityWarning = styled.div`
  background: rgba(255, 176, 25, 0.1);
  border: 1px solid rgba(255, 176, 25, 0.2);
  padding: 12px;
  border-radius: 12px;
  margin: 12px 0;
  font-size: 14px;
  color: #ffa726;
`;

const AllowanceDisplay = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.neutral2};
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const RevokeButton = styled.button`
  background: ${({ theme }) => theme.critical};
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  
  &:hover {
    opacity: 0.8;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// 添加 gas 预览组件样式
const GasPreviewContainer = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  background: ${({ theme }) => theme.surface2};
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.surface3};
`;

const GasPreviewRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const GasPreviewLabel = styled.span`
  color: ${({ theme }) => theme.neutral2};
  font-size: 14px;
`;

const GasPreviewValue = styled.span`
  color: ${({ theme }) => theme.neutral1};
  font-size: 14px;
  font-weight: 500;
`;

const GasPreviewTotal = styled(GasPreviewRow)`
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid ${({ theme }) => theme.surface3};
  
  ${GasPreviewLabel}, ${GasPreviewValue} {
    font-weight: 600;
    color: ${({ theme }) => theme.neutral1};
  }
`;

const CancelButton = styled(ActionButton)`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.neutral2};
  color: ${({ theme }) => theme.neutral1};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.surface2};
    border-color: ${({ theme }) => theme.neutral1};
  }

  &:active:not(:disabled) {
    background: ${({ theme }) => theme.surface3};
  }
`;

interface TokenContract extends ethers.Contract {
  balanceOf(owner: string): Promise<ethers.BigNumber>;
  decimals(): Promise<number>;
  symbol(): Promise<string>;
  name(): Promise<string>;
}

export function TransferTokenForm({ title }: { title?: string }) {
  const [searchParams] = useSearchParams();
  const initialUrlSourceChain = searchParams.get('chain');

  const [txs, setTxs] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [sourceChain, setSourceChain] = useState<'deepbrainchain' | 'bsc'>(() => {
    const chainFromUrl = searchParams.get('chain');
    if (chainFromUrl === 'bnb' || chainFromUrl === 'bsc') {
      return 'bsc';
    }
    return 'deepbrainchain';
  });
  const [destinationChain, setDestinationChain] = useState<'deepbrainchain' | 'bsc'>(() => {
    const initialSource = (searchParams.get('chain') === 'bnb' || searchParams.get('chain') === 'bsc') ? 'bsc' : 'deepbrainchain';
    return initialSource === 'deepbrainchain' ? 'bsc' : 'deepbrainchain';
  });
  const [txStatus, setTxStatus] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [lastTxHash, setLastTxHash] = useState<string>('');
  const [lastTxChain, setLastTxChain] = useState<'deepbrainchain' | 'bsc'>('deepbrainchain');
  const [usdtBalance, setUsdtBalance] = useState<string>('0');
  const [isLoadingBalance, setIsLoadingBalance] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [currentAllowance, setCurrentAllowance] = useState<string>('0');
  const [isRevoking, setIsRevoking] = useState<boolean>(false);

  // 添加费用相关状态
  const [feeQuotes, setFeeQuotes] = useState<FeeQuotes | null>(null);
  const [isLoadingFees, setIsLoadingFees] = useState<boolean>(false);
  const [warpCoreInstance, setWarpCoreInstance] = useState<WarpCore | null>(null);

  const { provider, account, chainId } = useWeb3React<Web3Provider>();
  const selectChain = useSelectChain();
  const [, toggleAccountDrawer] = useAccountDrawer()

  // 修改 gasEstimate 状态
  const [gasEstimate, setGasEstimate] = useState({
    gasLimit: '0',
    gasPrice: '0',
    totalGasFee: '0',
    interchainGas: '0',
    localGas: '0'
  });

  // 添加轮询间隔状态
  const [isPollingBalance, setIsPollingBalance] = useState<boolean>(false);
  const POLLING_INTERVAL = 10000; // 10秒

  // Map chain names to ChainId enum - simplified mapping
  const getChainId = useCallback((chainName: 'deepbrainchain' | 'bsc'): ChainId => {
    return chainName === 'deepbrainchain' ? ChainId.DBC : ChainId.BNB;
  }, []);

  // Current connected chain - minimal implementation
  const currentChain = useCallback((): 'deepbrainchain' | 'bsc' | undefined => {
    return chainId === ChainId.DBC ? 'deepbrainchain' :
      chainId === ChainId.BNB ? 'bsc' : undefined;
  }, [chainId]);

  // Function to check USDT balance
  const checkTokenBalance = useCallback(async (tokenAddress: string): Promise<string> => {
    if (!provider || !account) {
      throw new Error('Please connect your wallet first');
    }

    try {
      const signer = provider.getSigner();

      // Use a more complete ERC20 ABI for compatibility
      const erc20Abi = [
        'function balanceOf(address owner) view returns (uint256)',
        'function decimals() view returns (uint8)',
        'function symbol() view returns (string)',
        'function name() view returns (string)'
      ];

      const tokenContract = new ethers.Contract(
        tokenAddress,
        erc20Abi,
        signer
      );

      // Call separately for better error handling
      let tokenDecimals = 18; // Default to 18 decimals
      try {
        tokenDecimals = await tokenContract.decimals();
        console.log(`Token ${tokenAddress} decimals: ${tokenDecimals}`);
      } catch (error) {
        console.warn('Could not get token decimals, using default 18:', error);
      }

      const balance = await tokenContract.balanceOf(account);
      console.log(`Token ${tokenAddress} raw balance: ${balance.toString()}`);

      return ethers.utils.formatUnits(balance, tokenDecimals);
    } catch (error) {
      console.error('Failed to fetch token balance:', error);
      throw new Error('Failed to fetch token balance');
    }
  }, [provider, account]);

  // Get USDT balance of the current chain
  const fetchUsdtBalance = useCallback(async () => {
    if (!provider || !account) return;

    const currentChainName = currentChain();
    if (!currentChainName) return;

    setIsLoadingBalance(true);
    try {
      const tokenAddress = USDT_CONTRACT_ADDRESSES[currentChainName];
      console.log(`Fetching USDT balance on ${currentChainName}, contract: ${tokenAddress}`);

      const balance = await checkTokenBalance(tokenAddress);
      console.log(`Fetched raw balance: ${balance}`);

      // Ensure balance is a valid number
      if (balance && !isNaN(Number(balance))) {
        setUsdtBalance(balance);
      } else {
        console.error('Invalid balance format fetched:', balance);
        setUsdtBalance('0');
      }
    } catch (e) {
      console.error(`Failed to fetch ${currentChainName} USDT balance:`, e);
      setUsdtBalance('0');
    } finally {
      setIsLoadingBalance(false);
    }
  }, [provider, account, currentChain, checkTokenBalance]);

  // 添加轮询余额的函数
  const startPollingBalance = useCallback(() => {
    if (isPollingBalance) return;
    
    setIsPollingBalance(true);
    const intervalId = setInterval(() => {
      if (account && provider) {
        fetchUsdtBalance();
      }
    }, POLLING_INTERVAL);

    // 5分钟后停止轮询
    setTimeout(() => {
      clearInterval(intervalId);
      setIsPollingBalance(false);
    }, 300000);

    return () => {
      clearInterval(intervalId);
      setIsPollingBalance(false);
    };
  }, [account, provider, fetchUsdtBalance, isPollingBalance]);

  // 修改 initializeWarpCore 函数
  const initializeWarpCore = useCallback(async () => {
    try {
      const chainMetadata: any = {
        "bsc": {
          "blockExplorers": [{
            "name": "BscScan",
            "url": "https://bscscan.com",
            "apiUrl": "https://api.bscscan.com/api",
            "family": "etherscan"
          }],
          "blocks": {"confirmations": 1},
          "chainId": 56,
          "domainId": 56,
          "name": "bsc",
          "protocol": "ethereum",
          "rpcUrls": [{"http": "https://bsc-dataseed1.bnbchain.org"}],
          // 添加 nativeToken 配置
          "nativeToken": {
            "name": "BNB",
            "symbol": "BNB", 
            "decimals": 18
          }
        },
        "deepbrainchain": {
          "blockExplorers": [{
            "name": "dbcscan",
            "url": "https://www.dbcscan.io",
            "apiUrl": "https://www.dbcscan.io/api",
            "family": "blockscout"
          }],
          "blocks": {"confirmations": 1},
          "chainId": 19880818,
          "domainId": 19880818,
          "name": "deepbrainchain",
          "protocol": "ethereum",
          "rpcUrls": [{"http": "https://rpc2.dbcwallet.io"}],
          // 添加 nativeToken 配置
          "nativeToken": {
            "name": "DBC",
            "symbol": "DBC",
            "decimals": 18
          }
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
          collateralAddressOrDenom: USDT_CONTRACT_ADDRESSES.bsc,
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
          addressOrDenom: USDT_CONTRACT_ADDRESSES.deepbrainchain,
          connections: [
            { token: 'ethereum|bsc|0xF528Aa0c86cBBbBb4288ecb8133D317DD528FD88' },
          ],
        },
      ];

      const multiProvider = new MultiProtocolProvider(chainMetadata);
      const warpCore = WarpCore.FromConfig(multiProvider, { tokens, options: {} });
      
      setWarpCoreInstance(warpCore);
      return warpCore;
    } catch (error) {
      console.error('Failed to initialize WarpCore:', error);
      return null;
    }
  }, []);

  // 修改 fetchFeeQuotes 函数，添加错误处理
  const fetchFeeQuotes = useCallback(async (
    warpCore: WarpCore,
    destination: string,
    sender: string,
    amount?: string
  ): Promise<FeeQuotes | null> => {
    if (!warpCore || !destination || !sender) return null;
    
    try {
      console.log('Fetching fee quotes...');
      
      const originToken = warpCore.tokens.find((token: any) => token.chainName === sourceChain);
      if (!originToken) {
        console.error('Origin token not found');
        return null;
      }

      // 添加更详细的参数检查
      const transferParams = {
        originToken,
        destination,
        sender,
        ...(amount && { 
          amount: originToken.amount ? originToken.amount(ethers.utils.parseUnits(amount, 18).toString()) : undefined 
        })
      };

      console.log('Transfer params:', transferParams);

      const fees = await warpCore.estimateTransferRemoteFees(transferParams);
      console.log('Fee quotes received:', fees);
      return fees;
    } catch (error) {
      // console.error('Failed to fetch fee quotes:', error);
      setError(error.message);
      // 返回默认费用而不是 null
      return {
        interchainQuote: {
          amount: '0',
          decimals: 18
        },
        localQuote: {
          amount: '0', 
          decimals: 18
        }
      };
    }
  }, [sourceChain]);

  // 修改 estimateGas 函数，改进错误处理
  const estimateGas = useCallback(async (transactions: any[], warpCore?: WarpCore) => {
    if (!provider || !transactions?.length || !account) return;
    
    
    try {
      let localGasLimit = BigNumber.from(0);
      let currentGasPrice = await provider.getGasPrice();
      
      const localGasFee = localGasLimit.mul(currentGasPrice);
      let interchainGasFee = '0';

      // 尝试使用 WarpCore 获取跨链费用
      if (warpCore || warpCoreInstance) {
        const coreToUse = warpCore || warpCoreInstance;
        if (coreToUse) {
          try {
            const feeQuotes = await fetchFeeQuotes(coreToUse, destinationChain, account, amount);
            if (feeQuotes && feeQuotes.interchainQuote.amount !== '0') {
              setFeeQuotes(feeQuotes);
              interchainGasFee = ethers.utils.formatUnits(
                feeQuotes.interchainQuote.amount, 
                feeQuotes.interchainQuote.decimals
              );
              console.log('Interchain gas fee from WarpCore:', interchainGasFee);
            }
          } catch (warpError) {
            console.warn('WarpCore fee estimation failed, using fallback:', warpError);
          }
        }
      }

      // 如果 WarpCore 费用估算失败，使用交易 value 作为备用
      if (interchainGasFee === '0' && transactions[0]?.transaction?.value) {
        try {
          if (typeof transactions[0].transaction.value === 'object' && transactions[0].transaction.value.hex) {
            interchainGasFee = ethers.utils.formatEther(transactions[0].transaction.value.hex);
          } else {
            interchainGasFee = ethers.utils.formatEther(transactions[0].transaction.value);
          }
          console.log('Interchain gas fee from transaction value:', interchainGasFee);
        } catch (valueError) {
          console.warn('Failed to parse transaction value:', valueError);
          // 使用默认估算值
          interchainGasFee = '0.001';
        }
      }

      const localGasFormatted = ethers.utils.formatEther(localGasFee);
      
      setGasEstimate({
        gasLimit: localGasLimit.toString(),
        gasPrice: currentGasPrice.toString(),
        totalGasFee: (parseFloat(localGasFormatted) + parseFloat(interchainGasFee)).toString(),
        interchainGas: interchainGasFee,
        localGas: localGasFormatted
      });
      
    } catch (error) {
      console.error('Gas estimation failed:', error);
      // 设置默认值而不是显示错误
      setGasEstimate({
        gasLimit: '200000',
        gasPrice: '0',
        totalGasFee: '0.002',
        interchainGas: '0.001',
        localGas: '0.001'
      });
    } finally {
      setIsLoadingFees(false);
    }
  }, [provider, account, fetchFeeQuotes, warpCoreInstance, destinationChain, amount]);

    // 初始化 WarpCore
    useEffect(() => {
      initializeWarpCore();
    }, [initializeWarpCore]);

    // 在交易预览中添加 useEffect
    useEffect(() => {
      if (txs?.length && warpCoreInstance) {
        estimateGas(txs, warpCoreInstance);
      }
    }, [txs, estimateGas, warpCoreInstance]);

    // 添加 handleMaxAmount 函数
    const handleMaxAmount = useCallback(() => {
      if (!usdtBalance || isLoadingBalance) return;

      // 设置最大可用余额，保留6位小数
      const maxAmount = parseFloat(usdtBalance).toFixed(6);
      setAmount(maxAmount);
    }, [usdtBalance, isLoadingBalance]);

    // 添加轮询余额的函数
    useEffect(() => {
      if (account && provider) {
        fetchUsdtBalance();
        // 每当账户或链变化时，也开始轮询
        startPollingBalance();
      }
    }, [account, chainId, provider, fetchUsdtBalance, startPollingBalance]);

    // 组件卸载时清理轮询
    useEffect(() => {
      return () => {
        setIsPollingBalance(false);
      };
    }, []);

    // 添加重置状态的函数
    const resetState = useCallback(() => {
      setTxs(null);
      setError('');
      setAmount('');
      setTxStatus('');
      setLastTxHash('');
      setLastTxChain('deepbrainchain');
      setCurrentAllowance('0');
      setFeeQuotes(null);
      setGasEstimate({
        gasLimit: '0',
        gasPrice: '0',
        totalGasFee: '0',
        interchainGas: '0',
        localGas: '0'
      });
      setShowPreview(false);
      setIsProcessing(false);
      setIsLoadingFees(false);
      setIsLoadingBalance(false);
    }, []);

    // 定义 cancelPreview 函数
    const cancelPreview = useCallback(() => {
      resetState();
    }, [resetState]);

    // 修改 handleSwapChains 函数
    const handleSwapChains = useCallback(() => {
      resetState();
      const newSourceChain = destinationChain;
      const newDestinationChain = sourceChain;
      setSourceChain(newSourceChain);
      setDestinationChain(newDestinationChain);
    }, [sourceChain, destinationChain, resetState]);

    // 验证合约地址
    const isKnownContract = useCallback((address: string): boolean => {
      const KNOWN_CONTRACTS = {
        [USDT_CONTRACT_ADDRESSES.deepbrainchain]: 'DBC USDT',
        [USDT_CONTRACT_ADDRESSES.bsc]: 'BSC USDT',
      };
      return !!KNOWN_CONTRACTS[address];
    }, []);

    // 撤销授权函数
    const revokeApproval = async (tokenAddress: string, spenderAddress: string) => {
      if (!provider || !account) return;

      try {
        setIsRevoking(true);
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(
          tokenAddress,
          ['function approve(address spender, uint256 amount) returns (bool)'],
          signer
        );

        const revokeTx = await tokenContract.approve(spenderAddress, 0);
        setTxStatus('Revoking...');
        await revokeTx.wait();

        setTxStatus('Approval revoked');
        setCurrentAllowance('0');
      } catch (e: any) {
        setError('Revoke approval failed: ' + e.message);
      } finally {
        setIsRevoking(false);
      }
    };

    // 修改 prepareTransaction 函数
    const prepareTransaction = async () => {
      setIsLoadingFees(true);

      if (!amount || !account || !provider) {
        setError('Please connect wallet and enter amount');
        return;
      }

      if (!warpCoreInstance) {
        setError('WarpCore not initialized. Please try again.');
        return;
      }

      // Reset states
      setError('');
      setTxs(null);
      setShowPreview(false);
      setFeeQuotes(null);
      setGasEstimate({
        gasLimit: '0',
        gasPrice: '0',
        totalGasFee: '0',
        interchainGas: '0',
        localGas: '0'
      });
      
      try {
        const amountWei = ethers.utils.parseUnits(amount, 18);
        
        // 获取当前链的 USDT 合约地址
        const tokenAddress = USDT_CONTRACT_ADDRESSES[sourceChain];
        
        // 创建代币合约实例用于检查余额和授权状态
        const tokenContract = new ethers.Contract(
          tokenAddress,
          [
            'function balanceOf(address owner) view returns (uint256)',
            'function allowance(address owner, address spender) view returns (uint256)'
          ],
          provider
        );

        // 检查余额
        const balance = await tokenContract.balanceOf(account);
        if (balance.lt(amountWei)) {
          setError(`Insufficient balance. You have ${ethers.utils.formatUnits(balance, 18)} USDT`);
          return;
        }

        // Find token config
        const originToken = warpCoreInstance.tokens.find((token: any) => token.chainName === sourceChain);
        if (!originToken) throw new Error('Token not found');

        // 获取跨链交易数据（仅用于估算，不执行）
        const transactions = await warpCoreInstance.getTransferRemoteTxs({
          originTokenAmount: originToken.amount(amountWei.toString()),
          destination: destinationChain,
          sender: account,
          recipient: account,
        });

        console.log('=== Debug Transfer Transactions ===');
        console.log('Full transactions object:', JSON.stringify(transactions, null, 2));

        // 检查授权状态（仅用于显示，不自动授权）
        if (transactions && transactions.length > 0) {
          const tx = transactions[0];
          const txData = tx.transaction as any;
          if (txData && txData.to) {
            try {
              const allowance = await tokenContract.allowance(account, txData.to);
              console.log(`Current allowance for spender ${txData.to}: ${ethers.utils.formatUnits(allowance, 18)}`);
              setCurrentAllowance(allowance.toString());
              
              // 如果授权不足，显示警告但不阻止预览
              if (allowance.lt(amountWei)) {
                console.warn(`Insufficient allowance. Required: ${ethers.utils.formatUnits(amountWei, 18)}, Current: ${ethers.utils.formatUnits(allowance, 18)}`);
              }
            } catch (allowanceError) {
              console.warn('Could not check allowance:', allowanceError);
            }
          }
        }

        setTxs(transactions);
        await estimateGas(transactions, warpCoreInstance);
        setShowPreview(true);
        
      } catch (e: any) {
        console.error('Transaction preparation failed:', e);
        
        // 更详细的错误处理
        if (e.message.includes('insufficient')) {
          setError('Insufficient balance for this transfer.');
        } else if (e.message.includes('network')) {
          setError('Network error. Please check your connection and try again.');
        } else {
          setError(e?.message || 'Failed to prepare transaction');
        }
      }
    };

    const handleConnectWallet = useCallback(() => {
      sendAnalyticsEvent(InterfaceEventName.CONNECT_WALLET_BUTTON_CLICKED, {
        element: InterfaceElementName.CONNECT_WALLET_BUTTON,
      })
      toggleAccountDrawer()
    }, [toggleAccountDrawer])

    // 修改执行交易的函数
    const executeTransaction = async () => {
      if (!txs || !provider || isProcessing) return;
      
      setIsProcessing(true);
      setTxStatus('Executing transaction...');
      
      try {
        const signer = provider.getSigner();
        for (const tx of txs) {
          setTxStatus('Executing transaction...');
          // 使用 any 类型来避免类型检查错误
          const txData = tx.transaction as any;
          const result = await signer.sendTransaction(txData);
          setLastTxChain(currentChain() || 'deepbrainchain');
          setLastTxHash(result.hash);
          await result.wait();
          
          // 交易完成后立即更新余额
          await fetchUsdtBalance();
          // 开始轮询余额
          startPollingBalance();
        }

        setTxStatus('Transfer completed!');
        setTimeout(() => {
          setAmount('');
          setIsProcessing(false);
          setTxStatus('');
          setShowPreview(false);
        }, 3000);

      } catch (e: any) {
        console.error('Transaction failed:', e);
        setError(e?.data?.message||e?.message || 'Transaction failed');
        setIsProcessing(false);
      }
    };

    // 在 GasPreviewContainer 中显示费用时，使用新的 gasEstimate 结构：

    // 在 TransactionPreview 中的 gas 显示部分：
    const renderGasPreview = () => {
      if (isLoadingFees) {
        return (
          <GasPreviewRow>
            <GasPreviewLabel>Loading fees...</GasPreviewLabel>
            <GasPreviewValue>-</GasPreviewValue>
          </GasPreviewRow>
        );
      }

      return (
        <>
          {gasEstimate.localGas && parseFloat(gasEstimate.localGas) > 0 && (
            <GasPreviewRow>
              <GasPreviewLabel>Local Gas</GasPreviewLabel>
              <GasPreviewValue>
                {parseFloat(gasEstimate.localGas).toFixed(6)} {currentChain() === 'deepbrainchain' ? 'DBC' : 'BNB'}
              </GasPreviewValue>
            </GasPreviewRow>
          )}
          
          {gasEstimate.interchainGas && parseFloat(gasEstimate.interchainGas) > 0 && (
            <GasPreviewRow>
              <GasPreviewLabel>Interchain Gas</GasPreviewLabel>
              <GasPreviewValue>
                {parseFloat(gasEstimate.interchainGas).toFixed(6)} {currentChain() === 'deepbrainchain' ? 'DBC' : 'BNB'}
              </GasPreviewValue>
            </GasPreviewRow>
          )}

          {gasEstimate.totalGasFee && parseFloat(gasEstimate.totalGasFee) > 0 && (
            <GasPreviewTotal>
              <GasPreviewLabel>Total Gas Fee</GasPreviewLabel>
              <GasPreviewValue>
                {parseFloat(gasEstimate.totalGasFee).toFixed(6)} {currentChain() === 'deepbrainchain' ? 'DBC' : 'BNB'}
              </GasPreviewValue>
            </GasPreviewTotal>
          )}
        </>
      );
    };

    return (
      <FormWrapper>
        {title && <FormTitle>{title}</FormTitle>}

        <AutoColumn gap="16px">
          <ChainSelectorContainer>
            <ChainSelector>
              <ChainLabel>From:</ChainLabel>
              <ChainSelect as="div">
                <ChainIcon>
                  <ChainLogo chainId={chainConfigs[sourceChain].chainId} size={24} />
                </ChainIcon>
                <ChainName>{chainConfigs[sourceChain].name}</ChainName>
              </ChainSelect>
            </ChainSelector>

            <SwitchButton onClick={handleSwapChains} type="button">
              <svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
                <path d="M7.56 17.01L8.68875 15.8812L6.48375 13.6762H11.55V12.1012H6.48375L8.68875 9.89625L7.56 8.7675L3.43875 12.8887L7.56 17.01ZM13.44 12.4425L17.5612 8.32125L13.4662 4.2L12.3112 5.32875L14.5162 7.53375H9.45V9.10875H14.5162L12.3112 11.3137L13.44 12.4425ZM10.5 21C9.065 21 7.70875 20.7244 6.43125 20.1731C5.15375 19.6219 4.03813 18.8694 3.08437 17.9156C2.13062 16.9619 1.37812 15.8462 0.826875 14.5687C0.275625 13.2912 0 11.935 0 10.5C0 9.0475 0.275625 7.6825 0.826875 6.405C1.37812 5.1275 2.13062 4.01625 3.08437 3.07125C4.03813 2.12625 5.15375 1.37812 6.43125 0.826875C7.70875 0.275625 9.065 0 10.5 0C11.9525 0 13.3175 0.275625 14.595 0.826875C15.8725 1.37812 16.9837 2.12625 17.9287 3.07125C18.8738 4.01625 19.6219 5.1275 20.1731 6.405C20.7244 7.6825 21 9.0475 21 10.5C21 11.935 20.7244 13.2912 20.1731 14.5687C19.6219 15.8462 18.8738 16.9619 17.9287 17.9156C16.9837 18.8694 15.8725 19.6219 14.595 20.1731C13.3175 20.7244 11.9525 21 10.5 21ZM10.5 19.425C12.985 19.425 15.0937 18.5544 16.8262 16.8131C18.5587 15.0719 19.425 12.9675 19.425 10.5C19.425 8.015 18.5587 5.90625 16.8262 4.17375C15.0937 2.44125 12.985 1.575 10.5 1.575C8.0325 1.575 5.92812 2.44125 4.18687 4.17375C2.44563 5.90625 1.575 8.015 1.575 10.5C1.575 12.9675 2.44563 15.0719 4.18687 16.8131C5.92812 18.5544 8.0325 19.425 10.5 19.425Z" fill="currentColor"></path>
              </svg>
            </SwitchButton>

            <ChainSelector>
              <ChainLabel>To:</ChainLabel>
              <ChainSelect as="div">
                <ChainIcon>
                  <ChainLogo chainId={chainConfigs[destinationChain].chainId} size={24} />
                </ChainIcon>
                <ChainName>{chainConfigs[destinationChain].name}</ChainName>
              </ChainSelect>
            </ChainSelector>
          </ChainSelectorContainer>

          <InputContainer>
            <InputLabel>Amount</InputLabel>
            <div style={{ position: 'relative' }}>
              <InputField
                type="text"
                inputMode="decimal"
                placeholder="Enter USDT amount"
                value={amount}
                onChange={(e) => {
                  const validatedValue = validateAmount(e.target.value, usdtBalance);
                  setAmount(validatedValue);
                }}
              />
              <MaxButton
                onClick={handleMaxAmount}
                disabled={isLoadingBalance || !usdtBalance || parseFloat(usdtBalance) <= 0}
              >
                MAX
              </MaxButton>
            </div>
            <BalanceText>
              Balance:
              <BalanceAmount>
                {isLoadingBalance ? 'Loading...' :
                  !usdtBalance || isNaN(parseFloat(usdtBalance))
                    ? '0.00 USDT'
                    : `${parseFloat(usdtBalance).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6
                    })} USDT`
                }
              </BalanceAmount>
            </BalanceText>
            <ContractLink>
              DBC EVM USDT Contract:
              <a
                href={getContractExplorerUrl('deepbrainchain', USDT_CONTRACT_ADDRESSES['deepbrainchain'])}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ContractAddress>
                  {USDT_CONTRACT_ADDRESSES.deepbrainchain}
                </ContractAddress>
                <ExternalLink size={14} />
              </a>
            </ContractLink>
          </InputContainer>

          {account && <RecipientInfo>
            <span>Transfer to your address:</span>
            <AddressText>
              {`${account.slice(0, 6)}...${account.slice(-4)}`}
            </AddressText>
          </RecipientInfo>}

          {/* Transaction status display */}
          {txStatus && (
            <TransactionStatus
              status={
                txStatus.includes('failed') || txStatus.includes('Failed') ? 'error' :
                  txStatus.includes('success') || txStatus.includes('completed') ? 'success' :
                    'pending'
              }
            >
              <div>{txStatus}</div>
              {lastTxHash && (
                <div>
                  Transaction Hash: <TransactionLink
                    href={getExplorerUrl(currentChain() || 'deepbrainchain', lastTxHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {lastTxHash.slice(0, 6)}...{lastTxHash.slice(-4)}
                    <ExternalLink size={12} style={{ marginLeft: '4px' }} />
                  </TransactionLink>
                </div>
              )}
            </TransactionStatus>
          )}

          {/* Error message display */}
          {error && !error.includes('Transaction Hash') && <ErrorText>{error}</ErrorText>}

          {/* {currentAllowance !== '0' && (
            <AllowanceDisplay>
              <span>Current Allowance: {ethers.utils.formatUnits(currentAllowance, 18)} USDT</span>
              <RevokeButton
                onClick={() => revokeApproval(
                  sourceChain === 'deepbrainchain'
                    ? USDT_CONTRACT_ADDRESSES.deepbrainchain
                    : USDT_CONTRACT_ADDRESSES.bsc,
                  txs?.[0]?.transaction?.to || ''
                )}
                disabled={isRevoking}
              >
                {isRevoking ? 'Revoking...' : 'Revoke Approval'}
              </RevokeButton>
            </AllowanceDisplay>
          )} */}

          {showPreview && txs ? (
            <>
              <TransactionPreview>
                <ThemedText.SubHeaderSmall style={{ marginBottom: '1rem' }}>
                  Transaction Preview
                </ThemedText.SubHeaderSmall>
                
                <GasPreviewRow>
                  <GasPreviewLabel>Amount</GasPreviewLabel>
                  <GasPreviewValue>{amount} USDT</GasPreviewValue>
                </GasPreviewRow>
                
                <GasPreviewRow>
                  <GasPreviewLabel>From</GasPreviewLabel>
                  <GasPreviewValue>{chainConfigs[sourceChain].name}</GasPreviewValue>
                </GasPreviewRow>
                
                <GasPreviewRow>
                  <GasPreviewLabel>To</GasPreviewLabel>
                  <GasPreviewValue>{chainConfigs[destinationChain].name}</GasPreviewValue>
                </GasPreviewRow>

                {gasEstimate.totalGasFee && parseFloat(gasEstimate.totalGasFee) > 0 && (
                  <>
                    <GasPreviewRow>
                      <GasPreviewLabel>Local Gas</GasPreviewLabel>
                      <GasPreviewValue>
                        {parseFloat(gasEstimate.localGas).toFixed(6)} {currentChain() === 'deepbrainchain' ? 'DBC' : 'BNB'}
                      </GasPreviewValue>
                    </GasPreviewRow>
                    
                    {gasEstimate.interchainGas && parseFloat(gasEstimate.interchainGas) > 0 && (
                      <GasPreviewRow>
                        <GasPreviewLabel>Interchain Gas</GasPreviewLabel>
                        <GasPreviewValue>
                          {parseFloat(gasEstimate.interchainGas).toFixed(6)} {currentChain() === 'deepbrainchain' ? 'DBC' : 'BNB'}
                        </GasPreviewValue>
                      </GasPreviewRow>
                    )}

                    <GasPreviewTotal>
                      <GasPreviewLabel>Total Gas Fee</GasPreviewLabel>
                      <GasPreviewValue>
                        {parseFloat(gasEstimate.totalGasFee).toFixed(6)} {currentChain() === 'deepbrainchain' ? 'DBC' : 'BNB'}
                      </GasPreviewValue>
                    </GasPreviewTotal>
                  </>
                )}
              </TransactionPreview>

              <RowBetween style={{ gap: '1rem', marginTop: '1rem' }}>
                <CancelButton onClick={cancelPreview} disabled={isProcessing}>
                  Cancel
                </CancelButton>
                <ActionButton onClick={executeTransaction} disabled={isProcessing}>
                  {isProcessing ? 'Processing...' : 'Confirm Transaction'}
                </ActionButton>
              </RowBetween>
            </>
          ) : (
            account ? (
              <ActionButton onClick={prepareTransaction} disabled={isLoadingFees || !amount || parseFloat(amount) <= 0}>
                {isLoadingFees ? 'Preparing...' : 'Cross-Chain USDT'}
              </ActionButton>
            ) : (
              <ActionButton onClick={handleConnectWallet}>
                Connect Wallet
              </ActionButton>
            )
          )}
        </AutoColumn>
      </FormWrapper>
    );
  }