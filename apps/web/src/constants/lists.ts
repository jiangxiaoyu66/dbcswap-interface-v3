const ISDEV = false
// export const UBE_LIST = !ISDEV ? 'http://8.214.55.62:8028/config/config/token-list.json' : 'http://localhost:3000/config/config/token-list.json'
// export const UBE_EXTENDED_LIST =
//   !ISDEV ? 'http://8.214.55.62:8028/config/config/token-list.json' : 'http://localhost:3000/config/config/token-list.json'

const getBaseUrl = () => {
  if (typeof window === 'undefined') return ''
  // 获取主机名
  const host = window.location.host
  // 如果是 localhost，强制使用 http 协议
  const protocol = host.includes('localhost') ? 'http:' : window.location.protocol
  console.log('protocol', protocol)
  console.log('host', host)
  return `${protocol}//${host}`
}

// export const UBE_LIST = !ISDEV
//   ? 'https://test.dbcswap.io/config/config/token-list.json'
//   : `${getBaseUrl()}/config/config/token-list.json`
export const UBE_LIST = 'https://ai.xaiagent.io/api/tokens'
// export const UBE_LIST = `${getBaseUrl()}/config/config/token-list.json`
export const UBE_EXTENDED_LIST = ''


// const UNI_UNSUPPORTED_LIST = 'https://cloudflare-ipfs.com/ipns/unsupportedtokens.uniswap.org'
// const AAVE_LIST = 'tokenlist.aave.eth'
const BA_LIST = ''
// TODO(WEB-2282): Re-enable CMC list once we have a better solution for handling large lists.
// const CMC_ALL_LIST = 'https://s3.coinmarketcap.com/generated/dex/tokens/eth-tokens-all.json'
// const COINGECKO_LIST = 'https://tokens.coingecko.com/uniswap/all.json'
// const COINGECKO_BNB_LIST = 'https://tokens.coingecko.com/binance-smart-chain/all.json'
// const COINGECKO_ARBITRUM_LIST = 'https://tokens.coingecko.com/arbitrum-one/all.json'
// const COINGECKO_OPTIMISM_LIST = 'https://tokens.coingecko.com/optimistic-ethereum/all.json'
// const COINGECKO_CELO_LIST = 'https://tokens.coingecko.com/celo/all.json'
// const COINGECKO_POLYGON_LIST = 'https://tokens.coingecko.com/polygon-pos/all.json'
// const COINGECKO_AVAX_LIST = 'https://tokens.coingecko.com/avalanche/all.json'
// const COMPOUND_LIST = 'https://raw.githubusercontent.com/compound-finance/token-list/master/compound.tokenlist.json'
// const GEMINI_LIST = 'https://www.gemini.com/uniswap/manifest.json'
// const KLEROS_LIST = 't2crtokens.eth'
// const SET_LIST = 'https://raw.githubusercontent.com/SetProtocol/uniswap-tokenlist/main/set.tokenlist.json'
// const WRAPPED_LIST = 'wrapped.tokensoft.eth'

export const OPTIMISM_LIST = 'https://static.optimism.io/optimism.tokenlist.json'
export const ARBITRUM_LIST = 'https://bridge.arbitrum.io/token-list-42161.json'
export const CELO_LIST = 'https://celo-org.github.io/celo-token-list/celo.tokenlist.json'
export const PLASMA_BNB_LIST = 'https://raw.githubusercontent.com/plasmadlt/plasma-finance-token-list/master/bnb.json'
export const AVALANCHE_LIST =
  'https://raw.githubusercontent.com/ava-labs/avalanche-bridge-resources/main/token_list.json'
export const BASE_LIST =
  'https://raw.githubusercontent.com/ethereum-optimism/ethereum-optimism.github.io/master/optimism.tokenlist.json'

export const UNSUPPORTED_LIST_URLS: string[] = [BA_LIST /*, UNI_UNSUPPORTED_LIST*/]

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = [UBE_LIST]
export const DEFAULT_INACTIVE_LIST_URLS: string[] = [
  // UBE_EXTENDED_LIST,
  // UBESWAP_EXTRA_LIST,
  // COMPOUND_LIST,
  // AAVE_LIST,
  // //  CMC_ALL_LIST,
  // COINGECKO_LIST,
  // COINGECKO_BNB_LIST,
  // COINGECKO_ARBITRUM_LIST,
  // COINGECKO_OPTIMISM_LIST,
  // COINGECKO_CELO_LIST,
  // COINGECKO_POLYGON_LIST,
  // COINGECKO_AVAX_LIST,
  // KLEROS_LIST,
  // GEMINI_LIST,
  // WRAPPED_LIST,
  // SET_LIST,
  // ARBITRUM_LIST,
  // OPTIMISM_LIST,
  // CELO_LIST,
  // PLASMA_BNB_LIST,
  // AVALANCHE_LIST,
  // BASE_LIST,
  // ...UNSUPPORTED_LIST_URLS,
]

export const DEFAULT_LIST_OF_LISTS: string[] = [...DEFAULT_ACTIVE_LIST_URLS, ...DEFAULT_INACTIVE_LIST_URLS]
