import { isWebAndroid, isWebIOS } from 'uniswap/src/utils/platform'
import { openWallet } from './WalletConnectV2'

/**
 * 唤起钱包应用进行签名
 * @param connector 钱包连接器
 * @param provider Web3提供者
 * @param account 用户账户地址
 * @returns 
 */
export const invokeWalletForSignature = async (connector: any, provider: any, account?: string) => {
  if (!connector) {
    console.warn('Wallet connector not found');
    return;
  }

  if (!account) {
    console.warn('Wallet not connected');
    return;
  }

  // 检查是否在内嵌钱包环境中
  const ethereum = window.ethereum as any;
  const isInWalletBrowser = Boolean(
    ethereum?.isTokenPocket || 
    ethereum?.isImToken || 
    ethereum?.isTrust ||
    ethereum?.isOKExWallet ||
    ethereum?.isBitKeep ||
    ethereum?.isCoin98 ||
    ethereum?.isHuobiWallet ||
    ethereum?.isMathWallet ||
    ethereum?.isOneKey ||
    /TokenPocket|imToken|Trust|OKEx|BitKeep|Coin98|HuobiWallet|MathWallet|OneKey/i.test(navigator.userAgent)
  );

  // 只有在移动端非内嵌钱包环境下才需要唤起钱包
  if ((isWebIOS || isWebAndroid) && !isInWalletBrowser) {
    try {
      // 打开钱包应用进行签名
      openWallet('', { 
        connector,
        provider,
        account 
      });
      console.log('Attempting to open wallet for signature');
      return true;
    } catch (error) {
      console.error('Error opening wallet:', error);
      return false;
    }
  }
  
  return false;
} 