import { ChainId } from '@ubeswap/sdk-core'
import useHttpLocations from 'hooks/useHttpLocations'
import { useMemo } from 'react'
import { isAddress } from 'utilities/src/addresses'

import EthereumLogo from '../../assets/images/ethereum-logo.png'
import AvaxLogo from '../../assets/svg/avax_logo.svg'
import DBCLogo from '../../assets/svg/dbc_logo.svg'
import BnbLogo from '../../assets/svg/bnb-logo.svg'
import CeloLogo from '../../assets/svg/celo_logo.svg'
import MaticLogo from '../../assets/svg/matic-token-icon.svg'
import { NATIVE_CHAIN_ID, isCelo, nativeOnChain } from '../../constants/tokens'

type Network =
  | 'ethereum'
  | 'arbitrum'
  | 'optimism'
  | 'polygon'
  | 'smartchain'
  | 'celo'
  | 'avalanchec'
  | 'base'
  | 'blast'

export function chainIdToNetworkName(networkId: ChainId): Network {
  switch (networkId) {
    case ChainId.MAINNET:
      return 'ethereum'
    case ChainId.ARBITRUM_ONE:
      return 'arbitrum'
    case ChainId.OPTIMISM:
      return 'optimism'
    case ChainId.POLYGON:
      return 'polygon'
    case ChainId.BNB:
      return 'smartchain'
    case ChainId.CELO:
      return 'celo'
    case ChainId.AVALANCHE:
      return 'avalanchec'
    case ChainId.BASE:
      return 'base'
    case ChainId.BLAST:
      return 'blast'
    default:
      return 'ethereum'
  }
}

export function getNativeLogoURI(chainId: ChainId = ChainId.MAINNET): string {
  switch (chainId) {
    case ChainId.POLYGON:
    case ChainId.POLYGON_MUMBAI:
      return MaticLogo
    case ChainId.BNB:
      return BnbLogo
    case ChainId.CELO:
    case ChainId.CELO_ALFAJORES:
      return CeloLogo
    case ChainId.AVALANCHE:
      return AvaxLogo

    case ChainId.DBC:
      return DBCLogo
    default:
      return EthereumLogo
  }
}

function getTokenLogoURI(address: string, chainId: ChainId = ChainId.CELO): string | void {
  const networkName = chainIdToNetworkName(chainId)
  const networksWithUrls = [
    ChainId.ARBITRUM_ONE,
    ChainId.MAINNET,
    ChainId.OPTIMISM,
    ChainId.BNB,
    ChainId.AVALANCHE,
    ChainId.BASE,
  ]
  if (isCelo(chainId) && address === nativeOnChain(chainId).wrapped.address) {
    return CeloLogo
  }

  if (networksWithUrls.includes(chainId)) {
    return `https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/${networkName}/assets/${address}/logo.png`
  }
}

export default function useCurrencyLogoURIs(
  currency:
    | {
        isNative?: boolean
        isToken?: boolean
        address?: string
        chainId: number
        logoURI?: string | null
      }
    | null
    | undefined
): string[] {
  const locations = useHttpLocations(currency?.logoURI)
  return useMemo(() => {
    const logoURIs = [...locations]
    if (currency) {
      if (currency.isNative || currency.address === NATIVE_CHAIN_ID) {
        logoURIs.push(getNativeLogoURI(currency.chainId))
      } else if (currency.isToken || currency.address) {
        const checksummedAddress = isAddress(currency.address)
        const logoURI = checksummedAddress && getTokenLogoURI(checksummedAddress, currency.chainId)
        if (logoURI) {
          logoURIs.push(logoURI)
        }
        if (currency.address?.toLocaleLowerCase() == '0x71e26d0e519d14591b9de9a0fe9513a398101490') {
          logoURIs.unshift('https://raw.githubusercontent.com/ubeswap/default-token-list/master/assets/asset_UBE.png')
        }
      }
    }
    return logoURIs
  }, [currency, locations])
}
