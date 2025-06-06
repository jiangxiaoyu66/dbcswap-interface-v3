import { MultiProtocolProvider, WarpCore } from '@hyperlane-xyz/sdk';
import { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';

export function TransferTokenForm() {
  const [txs, setTxs] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [amount, setAmount] = useState<string>('0.001');
  const [recipient, setRecipient] = useState<string>('0xde184A6809898D81186DeF5C0823d2107c001Da2');
  const { provider, account } = useWeb3React();

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
    
    console.log("原始交易详情:", {
      to: tx.transaction.to,
      data: tx.transaction.data,
      value: tx.transaction.value ? ethers.utils.formatEther(tx.transaction.value) + " DBC" : "0 DBC",
      amount,
      tx
    });

    const signer = provider.getSigner(account);
    try {
      // 直接使用原始交易数据，不做任何修改
      const txRequest: any = {
        to: tx.transaction.to,
        data: tx.transaction.data,
        value: tx.transaction.value?._hex
        // value: '0x224872a1136c6bf090'
      };

      // 检查余额
      const balance = await provider.getBalance(account);
      console.log('当前账户余额:', ethers.utils.formatEther(balance), 'DBC');
      console.log('交易value值:', ethers.utils.formatEther(txRequest.value), 'DBC');

      if (balance.lt(txRequest.value)) {
        setError(`DBC 余额不足，需要 ${ethers.utils.formatEther(txRequest.value)} DBC`);
        return;
      }

      // 如果是代币转账，先检查授权
      if (tx.type === 'approve') {
        const approved = await checkAndApproveToken(
          tx.token.addressOrDenom,
          tx.transaction.to,
          tx.transaction.value?.hex 
        );
        if (!approved) {
          setError('代币授权失败');
          return;
        }
      }

      console.log('发送交易请求:', {
        to: txRequest.to,
        data: txRequest.data,
        value: ethers.utils.formatEther(txRequest.value) + " DBC"
      });
      
      const txResponse = await signer.sendTransaction(txRequest);
      console.log('交易已发送:', txResponse.hash);
      await txResponse.wait();
      setError('');
      alert('交易已发送成功！');
    } catch (e: any) {
      console.error('交易失败:', e);
      if (e?.data?.message?.includes('insufficient value')) {
        setError('跨链手续费不足，请确保有足够的 DBC 作为手续费');
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

      console.log('模拟的初始化', {
        multiProvider,
        warpCoreConfig,
        chainMetadata,
      });
      
      const warpCore = WarpCore.FromConfig(multiProvider, warpCoreConfig);

      const origin = 'deepbrainchain';
      const destination = 'bsc';
      const tokenIndex = warpCore.tokens.findIndex((token: any) => token.chainName === origin);

      if (tokenIndex === -1) {
        setError('未找到对应的代币配置');
        return;
      }

      const originToken = warpCore.tokens[tokenIndex];
      const originTokenAmount = originToken.amount(ethers.utils.parseUnits(amount, 18).toString());

      const txs = await warpCore.getTransferRemoteTxs({
        originTokenAmount,
        destination,
        sender: account,
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