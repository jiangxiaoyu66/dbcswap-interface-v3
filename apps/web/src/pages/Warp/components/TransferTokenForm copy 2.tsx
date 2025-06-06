import { useWeb3React } from '@web3-react/core';

export function TransferTokenForm() {
  const { provider, account } = useWeb3React();

  const handleSendTx = async () => {
    if (!provider || !account) {
      alert('请先连接钱包');
      return;
    }
    const signer = provider.getSigner(account);
    try {
      const txRequest = {
        to: '0x5155101187F8Faa1aD8AfeC7820c801870F81D52',
        data: '0x81b4e8b40000000000000000000000000000000000000000000000000000000000000038000000000000000000000000de184a6809898d81186def5c0823d2107c001da2000000000000000000000000000000000000000000000000002386f26fc10000',
        value: '0x224872a1136c6bf090'
      };
      
      const txResponse = await signer.sendTransaction(txRequest);
      await txResponse.wait();
      alert('交易已发送');
    } catch (e: any) {
      alert('交易失败: ' + (e?.message || String(e)));
    }
  };

  return (
    <div>
      <button onClick={handleSendTx}>发起跨链交易</button>
    </div>
  );
}