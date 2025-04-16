import { ChainId } from '@ubeswap/sdk-core'
import { URI_AVAILABLE, WalletConnect, WalletConnectConstructorArgs } from '@web3-react/walletconnect-v2'
import { sendAnalyticsEvent } from 'analytics'
import { L1_CHAIN_IDS, L2_CHAIN_IDS } from 'constants/chains'
import { APP_RPC_URLS } from 'constants/networks'
import { Z_INDEX } from 'theme/zIndex'
import { isWebAndroid, isWebIOS } from 'uniswap/src/utils/platform'

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

type WalletType = keyof typeof WALLET_PROTOCOLS;

// 获取应用URL
const getAppUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    // 这里需要根据实际情况修改IP和端口
    return 'http://192.168.1.12:3000';
  }
  return 'https://dbcswap.io';
};

// Avoid testing for the best URL by only passing a single URL per chain.
// Otherwise, WC will not initialize until all URLs have been tested (see getBestUrl in web3-react).
const WC_RPC_URLS = Object.entries(APP_RPC_URLS).reduce(
  (map, [chainId, urls]) => ({
    ...map,
    [chainId]: urls[0],
  }),
  {}
)

// 处理钱包唤起
export const openWallet = (uri: string) => {
  // 使用 web3-react 提供的 hooks 获取连接器
  let connector;
  try {
    // 尝试从全局状态获取连接器
    const state = (window as any).__WEB3_REACT_STATE__;
    connector = state?.connector;
  } catch (error) {
    console.warn('Failed to get connector from global state:', error);
  }

  if (!connector) {
    console.warn('No connector found, defaulting to metamask');
  }

  // 获取钱包类型
  let walletType: WalletType = 'metamask';
  
  if (connector) {
    const provider = connector.provider;
    const providerInfo = {
      name: connector.name?.toLowerCase() || '',
      constructor: connector.constructor?.name?.toLowerCase() || '',
      providerName: provider?.constructor?.name?.toLowerCase() || '',
    };

    console.log('Current wallet info:', providerInfo);

    // 判断钱包类型
    if (providerInfo.name.includes('tokenpocket') || 
        providerInfo.constructor.includes('tokenpocket') || 
        providerInfo.providerName.includes('tokenpocket')) {
      walletType = 'tokenpocket';
    } else if (providerInfo.name.includes('imtoken') || 
        providerInfo.constructor.includes('imtoken') || 
        providerInfo.providerName.includes('imtoken')) {
      walletType = 'imtoken';
    } else if (providerInfo.name.includes('trust') || 
        providerInfo.constructor.includes('trust') || 
        providerInfo.providerName.includes('trust')) {
      walletType = 'trustwallet';
    }
  }

  console.log('Opening wallet type:', walletType);
  const protocol = WALLET_PROTOCOLS[walletType];
  
  // 如果没有 URI,说明是签名场景,直接打开钱包
  if (!uri) {
    console.log('No URI provided, opening wallet for signing');
    const directLink = protocol;
    
    try {
      // 使用 iframe 方式打开
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = directLink;
      document.body.appendChild(iframe);
      
      setTimeout(() => {
        document.body.removeChild(iframe);
        
        // 如果 iframe 方式失败，使用 location.href
        if (document.hidden) return;
        console.log('Trying location.href');
        window.location.href = directLink;
      }, 1500);
      
    } catch (error) {
      console.error('Failed to open wallet for signing:', error);
      alert('请手动打开钱包应用并确认交易');
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
    // 先尝试使用 iframe 方式打开
    tryOpenWallet(deepLink);
    
    // 如果 iframe 方式失败，使用 location.href
    setTimeout(() => {
      if (document.hidden) return;
      
      console.log('Trying location.href with deep link');
      window.location.href = deepLink;
      
      // 如果第一个格式失败，尝试备用格式
      setTimeout(() => {
        if (document.hidden) return;
        
        console.log('Trying backup deep link format');
        window.location.href = backupDeepLink;
        
        // 最后才跳转到下载页
        setTimeout(() => {
          if (document.hidden) return;
          
          console.log('Wallet open timeout, redirecting to download page');
          window.location.href = WALLET_DOWNLOAD_URLS[walletType];
        }, 1500);
      }, 1500);
    }, 1500);
  } catch (error) {
    console.error('Failed to open wallet:', error);
    alert('请手动打开钱包应用并重试');
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
    
    // 检查 projectId
    const projectId = process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID;
    if (!projectId) {
      console.error('WalletConnect projectId is missing!');
      throw new Error('WalletConnect configuration error: Missing projectId');
    }
    
    console.log('Initializing WalletConnect with config:', {
      projectId,
      defaultChainId,
      appUrl: getAppUrl(),
      isMobile: isWebIOS || isWebAndroid
    });
    
    super({
      actions,
      options: {
        projectId: projectId,
        chains: [defaultChainId],
        metadata: {
          name: 'DBCSwap',
          description: 'The interface for DBCSwap, a decentralized exchange and automated market maker protocol for Celo assets.',
          url: getAppUrl(),
          icons: [`${getAppUrl()}/favicon.png`],
        },
        optionalChains: [...L1_CHAIN_IDS, ...L2_CHAIN_IDS],
        showQrModal: qrcode,
        rpcMap: WC_RPC_URLS,
        optionalMethods: ['eth_signTypedData', 'eth_signTypedData_v4', 'eth_sign'],
        qrModalOptions: {
          desktopWallets: undefined,
          enableExplorer: true,
          explorerExcludedWalletIds: undefined,
          explorerRecommendedWalletIds: undefined,
          mobileWallets: undefined,
          privacyPolicyUrl: undefined,
          termsOfServiceUrl: undefined,
          themeMode: darkmode ? 'dark' : 'light',
          themeVariables: {
            '--wcm-font-family': '"Inter custom", sans-serif',
            '--wcm-z-index': Z_INDEX.modal.toString(),
          },
          walletImages: undefined,
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
      } else if (process.env.NODE_ENV === 'development') {
        // 在开发环境下，显示二维码和调试信息
        console.log('Development mode - QR code URI:', uri);
        this.events.emit('show_qr_code', uri);
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
