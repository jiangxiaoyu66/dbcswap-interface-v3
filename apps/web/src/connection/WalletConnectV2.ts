import { ChainId } from '@ubeswap/sdk-core'
import { URI_AVAILABLE, WalletConnect, WalletConnectConstructorArgs } from '@web3-react/walletconnect-v2'
import { sendAnalyticsEvent } from 'analytics'
import { L1_CHAIN_IDS, L2_CHAIN_IDS } from 'constants/chains'
import { APP_RPC_URLS } from 'constants/networks'
import { Z_INDEX } from 'theme/zIndex'
import { isWebAndroid, isWebIOS } from 'uniswap/src/utils/platform'
import { useWeb3React } from '@web3-react/core'
import { getConnection } from './index'
import { ConnectionType } from './types'

// 钱包协议配置
const WALLET_PROTOCOLS = {
  metamask: 'metamask://',
  tokenpocket: 'tpoutside://',
  imtoken: 'imtokenv2://',
  trustwallet: 'trust://',
} as const;

// 钱包下载链接
const WALLET_DOWNLOAD_URLS = {
  metamask: 'https://metamask.io/download/',
  tokenpocket: 'https://www.tokenpocket.pro/en/download/app',
  imtoken: 'https://token.im/download',
  trustwallet: 'https://trustwallet.com/download',
} as const;

// DBC 网络配置
export const DBC_NETWORK_CONFIG = {
  chainId: '0x12F5B72', // 19880818 in hex
  // chainId: '19880818', // 19880818 in hex
  chainName: 'Deep Brain Chain',
  nativeCurrency: {
    name: 'DBC',
    symbol: 'DBC',
    decimals: 18
  },
  rpcUrls: ['https://rpc2.dbcwallet.io'],
  blockExplorerUrls: ['https://www.dbcscan.io']
};

// BSC 网络配置
export const BSC_NETWORK_CONFIG = {
  chainId: '0x38', // 56 in hex
  // chainId: '56', // 56 in hex
  chainName: 'Binance Smart Chain',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18
  },
  rpcUrls: ['https://bsc-dataseed1.bnbchain.org'],
  blockExplorerUrls: ['https://bscscan.com']
};

type WalletType = keyof typeof WALLET_PROTOCOLS | undefined;

// 获取应用URL
const getAppUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    // 这里需要根据实际情况修改IP和端口
    return 'http://192.168.1.12:3000';
  }
  return 'https://dbcswap.io';
};

// WalletConnect Project ID
// 使用一个有效的项目ID，这个ID需要在WalletConnect Cloud注册
const WALLET_CONNECT_PROJECT_ID = 'b4e41353f250958b0c77472ed603222a';

// Avoid testing for the best URL by only passing a single URL per chain.
// Otherwise, WC will not initialize until all URLs have been tested (see getBestUrl in web3-react).
const WC_RPC_URLS = Object.entries(APP_RPC_URLS).reduce(
  (map, [chainId, urls]) => ({
    ...map,
    [chainId]: urls[0],
  }),
  {}
)

// 添加工具函数
interface WalletMeta {
  agent?: string;
  name?: string;
  description?: string;
  url?: string;
  icons?: string[];
}

// 获取钱包元数据
const getWalletMeta = (provider: any): WalletMeta | undefined => {
  try {
    if (!provider) return undefined;
    
    // 尝试获取不同格式的钱包信息
    const info = {
      agent: provider.agent || provider.walletAgent || provider._agent,
      name: provider.walletName || provider.name || provider._walletName,
      description: provider.description || provider._description,
      url: provider.walletUrl || provider.url || provider._url,
      icons: provider.icons || provider._icons
    };
    
    console.log('Wallet meta info:', info);
    return info;
  } catch (error) {
    console.error('Failed to get wallet meta:', error);
    return undefined;
  }
};

// 获取钱包类型
const getWalletType = (connector: any): WalletType => {
  try {
    const connection = getConnection(connector);
    if (!connection) {
      console.warn('No connection found for connector');
      return undefined;
    }

    // 获取提供者信息
    const providerInfo = connection.getProviderInfo();
    const provider = connector?.provider;

    // 添加更详细的日志
    console.log('Wallet Detection Details:', {
      providerName: providerInfo?.name,
      providerNameLower: providerInfo?.name?.toLowerCase(),
      isMetaMask: provider?.isMetaMask,
      provider: provider
    });

    // 如果是 WalletConnect 连接
    if (connection.type === ConnectionType.WALLET_CONNECT_V2) {
      const peerMetadata = provider?.session?.peer?.metadata;
      const walletName = (peerMetadata?.name || '').toLowerCase();
      
      // 增加 MetaMask 的检测条件
      if (walletName.includes('metamask') || 
          provider?.isMetaMask || 
          peerMetadata?.description?.toLowerCase().includes('metamask') ||
          peerMetadata?.url?.toLowerCase().includes('metamask.io')) {
        return 'metamask';
      }
      
      if (walletName.includes('tokenpocket') || 
          peerMetadata?.description?.toLowerCase().includes('tokenpocket') ||
          peerMetadata?.url?.toLowerCase().includes('tokenpocket')) {
        return 'tokenpocket';
      }
      
      if (walletName.includes('imtoken') || 
          peerMetadata?.description?.toLowerCase().includes('imtoken') ||
          peerMetadata?.url?.toLowerCase().includes('imtoken')) {
        return 'imtoken';
      }
      
      if (walletName.includes('trust') || 
          peerMetadata?.description?.toLowerCase().includes('trust') ||
          peerMetadata?.url?.toLowerCase().includes('trust')) {
        return 'trustwallet';
      }

      if (provider?.isTokenPocket) return 'tokenpocket';
      if (provider?.isImToken) return 'imtoken';
      if (provider?.isTrust) return 'trustwallet';

      // 如果无法识别，返回 undefined
      return undefined;
    } 

    // 非 WalletConnect 连接的处理逻辑
    const walletName = (providerInfo.name || '').toLowerCase();
    // 修改 MetaMask 检测条件，移除 providerInfo.isMetaMask
    if (walletName.includes('metamask') || 
        walletName.includes('metamask wallet') || 
        provider?.isMetaMask) {
      return 'metamask';
    }

    if (walletName.includes('tokenpocket')) return 'tokenpocket';
    if (walletName.includes('imtoken')) return 'imtoken';
    if (walletName.includes('trust')) return 'trustwallet';

    // 如果无法识别，返回 undefined
    return undefined;

  } catch (error) {
    console.error('Failed to determine wallet type:', error);
    return undefined;
  }
};

// 处理钱包唤起
export const openWallet = (uri: string, web3Data?: { connector?: any; provider?: any; account?: string }) => {
  try {
    const { connector, provider, account } = web3Data || {};
    
    console.log('Web3 Data:', {
      connector,
      provider,
      account
    });

    if (!connector) {
      console.warn('No connector found');
      return;
    }

    // 使用新的钱包类型检测逻辑
    const walletType = getWalletType(connector);
    
    // 如果没有检测出钱包类型，直接返回
    if (!walletType) {
      console.log('Unable to determine wallet type, skipping wallet open');
      return;
    }

    const protocol = WALLET_PROTOCOLS[walletType];
    
    if (!protocol) {
      console.warn('Unsupported wallet type:', walletType);
      return;
    }

    // 如果没有 URI,说明是签名场景,直接打开钱包
    if (!uri) {
      console.log('No URI provided, opening wallet for signing');
      const directLink = protocol;
      
      try {
        console.log('Trying location.href');
        window.location.href = directLink;
      } catch (error) {
        console.error('Failed to open wallet for signing:', error);
      }
      return;
    }

    // 连接场景的处理
    console.log('URI provided, opening wallet for connecting:', uri);
    // 修改深度链接格式
    const deepLink = `${protocol}wc?uri=${encodeURIComponent(uri)}`;
    // 添加备用深度链接格式
    const backupDeepLink = `${protocol}?wc=${encodeURIComponent(uri)}`;
    
    console.log('Deep link:', deepLink);
    console.log('Backup deep link:', backupDeepLink);
    
    const tryOpenWallet = (link: string) => {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = link;
      document.body.appendChild(iframe);
      
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 2000);
    };
    
    try {
      console.log('Trying location.href with deep link');
      window.location.href = deepLink;
      
      // 如果第一个格式失败，尝试备用格式
      setTimeout(() => {
        console.log('Trying backup deep link format');
        window.location.href = backupDeepLink;
        
        // 如果所有自动打开方式都失败,提示用户手动打开
        setTimeout(() => {
          console.log('Unable to open wallet automatically, please open manually');
        }, 1500);
      }, 1500);
    } catch (error) {
      console.error('Failed to open wallet:', error);
    }
  } catch (error) {
    console.error('Failed to open wallet:', error);
  }
};

export class WalletConnectV2 extends WalletConnect {
  ANALYTICS_EVENT = 'Wallet Connect QR Scan'
  constructor({
    actions,
    defaultChainId,
    qrcode = true,
    onError,
  }: Omit<WalletConnectConstructorArgs, 'options'> & { defaultChainId: number; qrcode?: boolean }) {
    const darkmode = Boolean(window.matchMedia('(prefers-color-scheme: dark)'))
    
    console.log('Initializing WalletConnect with config:', {
      projectId: WALLET_CONNECT_PROJECT_ID,
      defaultChainId,
      appUrl: getAppUrl(),
      isMobile: isWebIOS || isWebAndroid,
      domain: window.location.hostname
    });
    
    super({
      actions,
      options: {
        projectId: WALLET_CONNECT_PROJECT_ID,
        chains: [defaultChainId],
        metadata: {
          name: 'DBCSwap',
          description: 'The interface for DBCSwap, a decentralized exchange and automated market maker protocol for DBC assets.',
          url: getAppUrl(),
          icons: [`${getAppUrl()}/favicon.png`],
        },
        optionalChains: [...L1_CHAIN_IDS, ...L2_CHAIN_IDS],
        showQrModal: qrcode,
        rpcMap: WC_RPC_URLS,
        optionalMethods: ['eth_signTypedData', 'eth_signTypedData_v4', 'eth_sign'],
        qrModalOptions: {
          enableExplorer: true,
          themeMode: darkmode ? 'dark' : 'light',
          themeVariables: {
            '--wcm-font-family': '"Inter custom", sans-serif',
            '--wcm-z-index': Z_INDEX.modal.toString(),
          },
        },
      },
      onError: (error) => {
        console.error('WalletConnect error:', error);
        onError?.(error);
      },
    })

    // 监听所有事件，用于调试
    const events = [
      'display_uri',
      'connect',
      'disconnect',
      'error',
      'session_request',
      'session_update',
      'session_delete',
      URI_AVAILABLE
    ];
    
    events.forEach(eventName => {
      this.events.on(eventName, (...args) => {
        console.log(`WalletConnect event '${eventName}':`, ...args);
      });
    });

    // 监听 URI_AVAILABLE 事件
    this.events.on(URI_AVAILABLE, (uri) => {
      if (!uri) {
        console.warn('WalletConnect: No URI provided');
        return;
      }
      
      console.log('WalletConnect URI details:', {
        fullUri: uri,
        length: uri.length,
        protocol: uri.split(':')[0],
        params: uri.split('?')[1],
      });
      
      // 发送URI到Pending组件
      const event = new CustomEvent('walletconnect_uri', { detail: uri });
      window.dispatchEvent(event);
      
      if (isWebIOS || isWebAndroid) {
        console.log('Opening mobile wallet with URI');
        openWallet(uri);
      }
    });
  }

  activate(chainId?: number) {
    console.log('Activating WalletConnect with chainId:', chainId);
    sendAnalyticsEvent(this.ANALYTICS_EVENT);
    return super.activate(chainId);
  }
}

// Custom class for Uniswap Wallet specific functionality
export class UniwalletConnect extends WalletConnectV2 {
  ANALYTICS_EVENT = 'Uniswap Wallet QR Scan'
  static UNI_URI_AVAILABLE = 'uni_uri_available'

  constructor({ actions, onError }: Omit<WalletConnectConstructorArgs, 'options'>) {
    super({ actions, defaultChainId: ChainId.CELO, qrcode: false, onError })

    this.events.once(URI_AVAILABLE, () => {
      this.provider?.events.on('disconnect', this.deactivate)
    })

    this.events.on(URI_AVAILABLE, (uri) => {
      if (!uri) return;
      
      console.log('UniwalletConnect URI available:', uri);
      
      if (isWebIOS || isWebAndroid) {
        openWallet(uri);
      }
    })
  }

  deactivate() {
    this.events.emit(URI_AVAILABLE)
    return super.deactivate()
  }
}

// Valora wallet functionality
export class ValoraConnect extends WalletConnectV2 {
  ANALYTICS_EVENT = 'Valora WC'
  static VALORA_URI_AVAILABLE = 'valora_uri_available'

  constructor({ actions, onError }: Omit<WalletConnectConstructorArgs, 'options'>) {
    super({ actions, defaultChainId: ChainId.CELO, qrcode: false, onError })

    this.events.once(URI_AVAILABLE, () => {
      this.provider?.events.on('disconnect', this.deactivate)
    })

    this.events.on(URI_AVAILABLE, (uri) => {
      if (!uri) return;
      
      console.log('ValoraConnect URI available:', uri);
      
      if (isWebIOS || isWebAndroid) {
        openWallet(uri);
      }
    })
  }

  deactivate() {
    this.events.emit(URI_AVAILABLE)
    return super.deactivate()
  }
}

