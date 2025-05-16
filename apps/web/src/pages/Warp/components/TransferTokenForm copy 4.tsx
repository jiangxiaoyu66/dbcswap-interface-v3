import { MultiProtocolProvider, WarpCore } from '@hyperlane-xyz/sdk';
import { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import styled, { keyframes } from 'styled-components';
import { ButtonPrimary } from 'components/Button';
import Column, { AutoColumn } from 'components/Column';
import { RowBetween } from 'components/Row';
import { ArrowLeft, ArrowRight } from 'react-feather';

declare global {
  interface Window {
    ethereum: {
      request: (args: any) => Promise<any>;
      isMetaMask?: boolean;
    }
  }
}

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
`;

const TransactionPreview = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: ${({ theme }) => theme.surface2};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.surface3};
  max-width: 100%;
  overflow: hidden;
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
  word-break: break-all;
`;

const ActionButton = styled(ButtonPrimary)`
  padding: 0.75rem;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
`;

// 处理交易对象显示的函数
const formatTransactionData = (tx: any) => {
  if (!tx) return '';
  
  // 提取关键信息，简化显示
  const simplifiedTx = {
    type: tx.type,
    to: tx.transaction?.to || '',
    value: tx.transaction?.value || '0x0',
    token: tx.token ? {
      symbol: tx.token.symbol,
      chainName: tx.token.chainName
    } : null
  };
  
  return JSON.stringify(simplifiedTx, null, 2);
};

export function TransferTokenForm() {
  const [txs, setTxs] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [amount, setAmount] = useState<string>('0.001');
  const [recipient, setRecipient] = useState<string>('0xde184A6809898D81186DeF5C0823d2107c001Da2');
  const [sourceChain, setSourceChain] = useState<'deepbrainchain' | 'bsc'>('deepbrainchain');
  const [destinationChain, setDestinationChain] = useState<'deepbrainchain' | 'bsc'>('bsc');
  const { provider, account } = useWeb3React();

  // 交换源链和目标链
  const handleSwapChains = () => {
    setSourceChain(destinationChain);
    setDestinationChain(sourceChain);
  };

  const checkAndSwitchNetwork = async (targetChain: 'deepbrainchain' | 'bsc') => {
    if (!provider || !window.ethereum) {
      setError('请先安装并连接 MetaMask');
      return false;
    }

    const config = chainConfigs[targetChain];
    try {
      const network = await provider.getNetwork();
      
      // 如果已经在目标网络上，直接返回
      if (network.chainId === config.chainId) {
        return true;
      }

      console.log('正在切换网络到:', {
        targetChain,
        config,
        currentChainId: network.chainId
      });

      try {
        // 构建网络参数
        const addChainParameter = {
          chainId: config.chainIdHex,
          chainName: config.name,
          nativeCurrency: config.nativeCurrency,
          rpcUrls: config.rpcUrls,
          blockExplorerUrls: config.blockExplorerUrls,
          iconUrls: config.iconUrls
        };

        console.log('添加网络参数:', addChainParameter);

        // 先尝试切换网络
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: config.chainIdHex }]
          });
          return true;
        } catch (switchError: any) {
          // 如果网络不存在（错误码 4902），则添加网络
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [addChainParameter]
            });
            return true;
          } else {
            throw switchError;
          }
        }
      } catch (error: any) {
        console.error('网络操作失败:', error);
        if (error.code === -32602) {
          setError('网络参数无效，请检查网络配置');
        } else if (error.code === 4001) {
          setError('用户拒绝了网络切换请求');
        } else {
          setError(`切换到${config.name}失败: ${error.message}`);
        }
        return false;
      }
    } catch (error: any) {
      console.error('网络操作失败:', error);
      setError(`切换到${config.name}失败: ${error.message}`);
      return false;
    }
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

    if (!await checkAndSwitchNetwork(sourceChain)) {
      return;
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

  return (
    <FormWrapper>
      <AutoColumn gap="16px">
        <RowBetween>
          <ChainLabel>从:</ChainLabel>
          <ChainLabel>到:</ChainLabel>
        </RowBetween>
        
        <ChainSelectorContainer>
          <ChainSelector>
            <ChainSelect 
              value={sourceChain} 
              onChange={(e) => setSourceChain(e.target.value as 'deepbrainchain' | 'bsc')}
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