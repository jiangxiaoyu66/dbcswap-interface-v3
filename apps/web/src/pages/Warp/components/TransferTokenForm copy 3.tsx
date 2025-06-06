import { MultiProtocolProvider, WarpCore } from '@hyperlane-xyz/sdk';
import { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum: {
      request: (args: any) => Promise<any>;
      isMetaMask?: boolean;
    }
  }
}

export function TransferTokenForm() {
  const [txs, setTxs] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [amount, setAmount] = useState<string>('0.001');
  const [recipient, setRecipient] = useState<string>('0xde184A6809898D81186DeF5C0823d2107c001Da2');
  const [sourceChain, setSourceChain] = useState<'deepbrainchain' | 'bsc'>('deepbrainchain');
  const [destinationChain, setDestinationChain] = useState<'deepbrainchain' | 'bsc'>('bsc');
  const { provider, account } = useWeb3React();

  const networkConfigs = {
    bsc: {
      chainId: 56,
      chainIdHex: '56',
      name: 'Binance Smart Chain',
      nativeCurrency: {
        name: 'BNB',
        symbol: 'BNB',
        decimals: 18
      },
      rpcUrls: ['https://bsc-dataseed1.bnbchain.org'],
      blockExplorerUrls: ['https://bscscan.com']
    },
    deepbrainchain: {
      chainId: 19880818,
      chainIdHex: '0x12f5b72',
      name: 'Deep Brain Chain',
      nativeCurrency: {
        name: 'DBC',
        symbol: 'DBC',
        decimals: 18
      },
      rpcUrls: ['https://rpc2.dbcwallet.io'],
      blockExplorerUrls: ['https://www.dbcscan.io']
    }
  };

  const checkAndSwitchNetwork = async (targetChain: 'deepbrainchain' | 'bsc') => {
    if (!provider || !window.ethereum) {
      setError('请先安装并连接 MetaMask');
      return false;
    }

    const config = networkConfigs[targetChain];
    try {
      const network = await provider.getNetwork();
      if (network.chainId !== config.chainId) {
        try {
          // 尝试切换到目标网络
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: config.chainIdHex }],
          });
        } catch (switchError: any) {
          // 如果网络不存在，则添加网络
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: config.chainIdHex,
                chainName: config.name,
                nativeCurrency: config.nativeCurrency,
                rpcUrls: config.rpcUrls,
                blockExplorerUrls: config.blockExplorerUrls
              }]
            });
          } else {
            throw switchError;
          }
        }
      }
      return true;
    } catch (error: any) {
      console.error('切换网络失败:', error);
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
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ marginRight: 8 }}>从:</label>
          <select 
            value={sourceChain} 
            onChange={(e) => setSourceChain(e.target.value as 'deepbrainchain' | 'bsc')}
            style={{ marginRight: 16 }}
          >
            <option value="deepbrainchain">DBC</option>
            <option value="bsc">BSC</option>
          </select>

          <label style={{ marginRight: 8 }}>到:</label>
          <select 
            value={destinationChain}
            onChange={(e) => setDestinationChain(e.target.value as 'deepbrainchain' | 'bsc')}
          >
            <option value="bsc">BSC</option>
            <option value="deepbrainchain">DBC</option>
          </select>
        </div>
        <input
          type="text"
          placeholder="转账金额"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <input
          type="text"
          placeholder="接收地址"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
      </div>
      <button onClick={handleClick}>生成跨链交易对象</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {txs && Array.isArray(txs) && txs.map((tx: any, idx: number) => (
        <div key={idx} style={{ marginBottom: 16 }}>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{JSON.stringify(tx, null, 2)}</pre>
          <button onClick={() => handleSendTx(tx)}>发起链上交易</button>
        </div>
      ))}
    </div>
  );
}