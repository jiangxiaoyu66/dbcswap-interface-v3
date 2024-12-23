import { ChainId, SUPPORTED_CHAINS, SupportedChainsType } from './chains'

type AddressMap = { [chainId: number]: string }

type ChainAddresses = {
  v3CoreFactoryAddress: string
  multicallAddress: string
  quoterAddress: string
  v3MigratorAddress?: string
  nonfungiblePositionManagerAddress?: string
  tickLensAddress?: string
  swapRouter02Address?: string
  mixedRouteQuoterV1Address?: string
}

const DEFAULT_NETWORKS = [ChainId.CELO, ChainId.CELO_ALFAJORES]

function constructSameAddressMap(address: string, additionalNetworks: ChainId[] = []): AddressMap {
  return DEFAULT_NETWORKS.concat(additionalNetworks).reduce<AddressMap>((memo, chainId) => {
    memo[chainId] = address
    return memo
  }, {})
}

export const UBE_ADDRESSES: AddressMap = {
  [ChainId.CELO]: '0x71e26d0E519D14591b9dE9a0fE9513A398101490',
  [ChainId.CELO_ALFAJORES]: '0x00Be915B9dCf56a3CBE739D9B9c202ca692409EC',
}

/**
 * @deprecated use V2_FACTORY_ADDRESSES instead
 */
export const V2_FACTORY_ADDRESS = '0x62d5b84be28a183abb507e125b384122d2c25fae'
export const V2_FACTORY_ADDRESSES: AddressMap = {
  // [ChainId.MAINNET]: '0x62d5b84be28a183abb507e125b384122d2c25fae',
  [ChainId.CELO]: '0x62d5b84be28a183abb507e125b384122d2c25fae',
}
/**
 * @deprecated use V2_ROUTER_ADDRESSES instead
 */
export const V2_ROUTER_ADDRESS = '0xE3D8bd6Aed4F159bc8000a9cD47CffDb95F96121'
export const V2_ROUTER_ADDRESSES: AddressMap = {
  // [ChainId.MAINNET]: '0xE3D8bd6Aed4F159bc8000a9cD47CffDb95F96121',
  [ChainId.CELO]: '0xE3D8bd6Aed4F159bc8000a9cD47CffDb95F96121',
}

// Networks that share most of the same addresses i.e. Mainnet, Goerli, Optimism, Arbitrum, Polygon
/*const DEFAULT_ADDRESSES: ChainAddresses = {
  v3CoreFactoryAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  multicallAddress: '0x1F98415757620B543A52E61c46B32eB19261F984',
  quoterAddress: '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
  v3MigratorAddress: '0xA5644E29708357803b5A882D272c41cC0dF92B34',
  nonfungiblePositionManagerAddress: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
}
const MAINNET_ADDRESSES: ChainAddresses = {
  ...DEFAULT_ADDRESSES,
  mixedRouteQuoterV1Address: '0x84E44095eeBfEC7793Cd7d5b57B7e401D7f1cA2E',
}*/

// celo addresses
const CELO_ADDRESSES: ChainAddresses = {
  v3CoreFactoryAddress: '0x67FEa58D5a5a4162cED847E13c2c81c73bf8aeC4',
  multicallAddress: '0x4d446f092461A0bfDeBC72AbC831541ca949d63F',
  quoterAddress: '0xA8864a18Fab1ED233Ce1921F329A6A92DBccA56f',
  v3MigratorAddress: '0x7167338eA247CC20B7a559Bf171a3dcDb5DE7A8a',
  nonfungiblePositionManagerAddress: '0x897387c7B996485c3AAa85c94272Cd6C506f8c8F',
  tickLensAddress: '0x1D8C564cCE485C2f053EF32652E4dba00D4265C4',
  swapRouter02Address: '0xE389f92B47d913F773254962eD638E12C28aA82d',
  mixedRouteQuoterV1Address: '0x1f34a843832044A085bB9cAe48cc7294D5478FAA',
}


const DBC_ADDRESSES: ChainAddresses = {
  "v3CoreFactoryAddress": "0xAc2366109dA0B0aFd28ecC2d2FE171c78594d113",
  "multicallAddress": "0xE92da0910B224055776E20a61c238C3a3fd2d42c",
  "quoterAddress": "0xA56C023F150F5Bd69ebB1fF8E59d2894DD6138F1",
  // "multicall2Address": "0xE92da0910B224055776E20a61c238C3a3fd2d42c",
  // "proxyAdminAddress": "0xAaffa0Ab0419BE44B838ccCE64e2884283BF5e4F",
  "tickLensAddress": "0xb2402c70eF790435b71b169825A714434d8E4c71",
  // "nftDescriptorLibraryAddressV1_3_0": "0x2C528C1985cfed7918cC15854B08934197Fd64DC",
  // "nonfungibleTokenPositionDescriptorAddressV1_3_0": "0x829D068ac6c8D229abb87FAE0528d6A8CCcE8E88",
  // "descriptorProxyAddress": "0x15cdaFBBE654CAc11622aa83cDCb38542357A7b3",
  "nonfungiblePositionManagerAddress": "0xdc8748C1e8d93aBE88B7B77AED4fEb0bAb4fACCE",
  "v3MigratorAddress": "0x90d2eE2Ec1fF7803d2b072C83f033E523f3a02B6",
  // "v3StakerAddress": "0x349762bdF5C1444FFE6A2228f1A488b69EE897D0",
  // "quoterV2Address": "0xA56C023F150F5Bd69ebB1fF8E59d2894DD6138F1",
  // "swapRouter02": "0x0348B9867862Aa638df274F0F861a677E0462Ea1"
}


export const CHAIN_TO_ADDRESSES_MAP: Record<SupportedChainsType, ChainAddresses> = {
  [ChainId.CELO]: CELO_ADDRESSES,
  [ChainId.CELO_ALFAJORES]: CELO_ADDRESSES,
  [ChainId.DBC]: DBC_ADDRESSES,
}

/* V3 Contract Addresses */
export const V3_CORE_FACTORY_ADDRESSES: AddressMap = {
  ...SUPPORTED_CHAINS.reduce<AddressMap>((memo, chainId) => {
    memo[chainId] = CHAIN_TO_ADDRESSES_MAP[chainId].v3CoreFactoryAddress
    return memo
  }, {}),
}

export const V3_MIGRATOR_ADDRESSES: AddressMap = {
  ...SUPPORTED_CHAINS.reduce<AddressMap>((memo, chainId) => {
    const v3MigratorAddress = CHAIN_TO_ADDRESSES_MAP[chainId].v3MigratorAddress
    if (v3MigratorAddress) {
      memo[chainId] = v3MigratorAddress
    }
    return memo
  }, {}),
}

export const MULTICALL_ADDRESSES: AddressMap = {
  ...SUPPORTED_CHAINS.reduce<AddressMap>((memo, chainId) => {
    memo[chainId] = CHAIN_TO_ADDRESSES_MAP[chainId].multicallAddress
    return memo
  }, {}),
}

/**
 * The oldest V0 governance address
 */
export const GOVERNANCE_ALPHA_V0_ADDRESSES: AddressMap = constructSameAddressMap(
  '0x5e4be8Bc9637f0EAA1A755019e06A68ce081D58F'
)
/**
 * The older V1 governance address
 */
export const GOVERNANCE_ALPHA_V1_ADDRESSES: AddressMap = {
  [ChainId.MAINNET]: '0xC4e172459f1E7939D522503B81AFAaC1014CE6F6',
}
/**
 * The latest governor bravo that is currently admin of timelock
 */
export const GOVERNANCE_BRAVO_ADDRESSES: AddressMap = {
  [ChainId.MAINNET]: '0x408ED6354d4973f66138C91495F2f2FCbd8724C3',
}

export const TIMELOCK_ADDRESSES: AddressMap = constructSameAddressMap('0x1a9C8182C09F50C8318d769245beA52c32BE35BC')

export const MERKLE_DISTRIBUTOR_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: '0x090D4613473dEE047c3f2706764f49E0821D256e',
}

export const ARGENT_WALLET_DETECTOR_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: '0xeca4B0bDBf7c55E9b7925919d03CbF8Dc82537E8',
}

export const QUOTER_ADDRESSES: AddressMap = {
  ...SUPPORTED_CHAINS.reduce<AddressMap>((memo, chainId) => {
    memo[chainId] = CHAIN_TO_ADDRESSES_MAP[chainId].quoterAddress
    return memo
  }, {}),
}

export const NONFUNGIBLE_POSITION_MANAGER_ADDRESSES: AddressMap = {

  ...SUPPORTED_CHAINS.reduce<AddressMap>((memo, chainId) => {
    const nonfungiblePositionManagerAddress = CHAIN_TO_ADDRESSES_MAP[chainId].nonfungiblePositionManagerAddress
    if (nonfungiblePositionManagerAddress) {
      memo[chainId] = nonfungiblePositionManagerAddress
    }
    return memo
  }, {}),
}

export const ENS_REGISTRAR_ADDRESSES: AddressMap = {
  ...constructSameAddressMap('0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'),
}

export const SOCKS_CONTROLLER_ADDRESSES: AddressMap = {
  [ChainId.MAINNET]: '0x65770b5283117639760beA3F867b69b3697a91dd',
}

export const TICK_LENS_ADDRESSES: AddressMap = {
  ...SUPPORTED_CHAINS.reduce<AddressMap>((memo, chainId) => {
    const tickLensAddress = CHAIN_TO_ADDRESSES_MAP[chainId].tickLensAddress
    if (tickLensAddress) {
      memo[chainId] = tickLensAddress
    }
    return memo
  }, {}),
}

export const MIXED_ROUTE_QUOTER_V1_ADDRESSES: AddressMap = SUPPORTED_CHAINS.reduce<AddressMap>((memo, chainId) => {
  const mixedRouteQuoterV1Address = CHAIN_TO_ADDRESSES_MAP[chainId].mixedRouteQuoterV1Address
  if (mixedRouteQuoterV1Address) {
    memo[chainId] = mixedRouteQuoterV1Address
  }
  return memo
}, {})

export const SWAP_ROUTER_02_ADDRESSES = (chainId: number) => {
  if (SUPPORTED_CHAINS.includes(chainId)) {
    const id = chainId as SupportedChainsType
    return CHAIN_TO_ADDRESSES_MAP[id].swapRouter02Address ?? '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45'
  }
  return ''
}

export const UNIVERSAL_ROUTER_ADDRESS = (chainId: number) => {
  if (SUPPORTED_CHAINS.includes(chainId)) {
    return '0x3C255DED9B25f0BFB4EF1D14234BD2514d7A7A0d'
  }
  return ''
}

export const UBE_CONVERT_ADDRESSES: AddressMap = {
  [ChainId.CELO]: '0x9DFc135e0984Fe88aCd45d68e62a73E98Dbb7A36',
}

export const FARM_REGISTRY_ADDRESSES: AddressMap = {
  [ChainId.CELO]: '0xa2bf67e12EeEDA23C7cA1e5a34ae2441a17789Ec',
}

export const UBE_ROMULUS_ADDRESSES: AddressMap = {
  [ChainId.CELO]: '0xD355A00220FbA16b69Cd8C4fbE16E02CA855f928',
}

export const OLD_UBE_ROMULUS_ADDRESSES: AddressMap = {
  [ChainId.CELO]: '0xa7581d8E26007f4D2374507736327f5b46Dd6bA8',
}

export const UBE_VOTABLE_STAKE_ADDRESSES: AddressMap = {
  [ChainId.CELO]: '0x388D611A57Ac15dCC1B937f287E5E908Ba5ff5c9',
}
