import { t } from 'i18n'
import { useAtom } from 'jotai'
import { lazy, ReactNode, Suspense, useMemo } from 'react'
import { matchPath, Navigate, useLocation } from 'react-router-dom'
import { shouldDisableNFTRoutesAtom } from 'state/application/atoms'
import { SpinnerSVG } from 'theme/components'
import { isBrowserRouterEnabled } from 'utils/env'

import { getDefaultTokensTitle } from './getDefaultTokensTitle'
import { getExploreTitle } from './getExploreTitle'
// High-traffic pages (index and /swap) should not be lazy-loaded.
import Landing from './Landing'
import Swap from './Swap'

const NftExplore = lazy(() => import('nft/pages/explore'))
const Collection = lazy(() => import('nft/pages/collection'))
const Profile = lazy(() => import('nft/pages/profile'))
const Asset = lazy(() => import('nft/pages/asset/Asset'))
const BuyDBC = lazy(() => import('./BuyDBC'))
const AddLiquidityWithTokenRedirects = lazy(() => import('pages/AddLiquidity/redirects'))
const AddSingleSidedWithTokenRedirects = lazy(() => import('pages/AddSingleSided/redirects'))
const AddLiquidityV2WithTokenRedirects = lazy(() => import('pages/AddLiquidityV2/redirects'))
const RedirectExplore = lazy(() => import('pages/Explore/redirects'))
const MigrateV2 = lazy(() => import('pages/MigrateV2'))
const MigrateV2Pair = lazy(() => import('pages/MigrateV2/MigrateV2Pair'))
const NotFound = lazy(() => import('pages/NotFound'))
const Pool = lazy(() => import('pages/Pool'))
const PositionPage = lazy(() => import('pages/Pool/PositionPage'))
const IchiVaultDetails = lazy(() => import('pages/IchiVaultDetails'))
const WithdrawIchi = lazy(() => import('pages/WithdrawIchi'))
const PoolV2 = lazy(() => import('pages/Pool/v2'))
const PoolDetails = lazy(() => import('pages/PoolDetails'))
const PoolFinder = lazy(() => import('pages/PoolFinder'))
const RemoveLiquidity = lazy(() => import('pages/RemoveLiquidity'))
const RemoveLiquidityV3 = lazy(() => import('pages/RemoveLiquidity/V3'))
const TokenDetails = lazy(() => import('pages/TokenDetails'))
const Vote = lazy(() => import('pages/Vote'))
const Stake = lazy(() => import('pages/Stake'))
const StakeCustom = lazy(() => import('pages/StakeCustom'))
const AddProposal = lazy(() => import('pages/Stake/AddProposal'))
const FarmManage = lazy(() => import('pages/Farm/Manage'))
const FarmManageSingle = lazy(() => import('pages/Farm/ManageSingle'))
const ClaimNewUbe = lazy(() => import('pages/ClaimNewUbe'))
const ClaimNewPact = lazy(() => import('pages/ClaimNewPact'))
const RedirectEarn = lazy(() => import('pages/Earn/redirects'))
const FarmV3 = lazy(() => import('pages/FarmV3'))
const Debug = lazy(() => import('pages/Debug'))
// const Warp = lazy(() => import('pages/Warp'))

// this is the same svg defined in assets/images/blue-loader.svg
// it is defined here because the remote asset may not have had time to load when this file is executing
const LazyLoadSpinner = () => (
  <SpinnerSVG width="94" height="94" viewBox="0 0 94 94" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M92 47C92 22.1472 71.8528 2 47 2C22.1472 2 2 22.1472 2 47C2 71.8528 22.1472 92 47 92"
      stroke="#2172E5"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SpinnerSVG>
)

interface RouterConfig {
  browserRouterEnabled?: boolean
  hash?: string
  shouldDisableNFTRoutes?: boolean
}

/**
 * Convenience hook which organizes the router configuration into a single object.
 */
export function useRouterConfig(): RouterConfig {
  const browserRouterEnabled = isBrowserRouterEnabled()
  const { hash } = useLocation()
  const [shouldDisableNFTRoutes] = useAtom(shouldDisableNFTRoutesAtom)
  return useMemo(
    () => ({
      browserRouterEnabled,
      hash,
      shouldDisableNFTRoutes: Boolean(shouldDisableNFTRoutes),
    }),
    [browserRouterEnabled, hash, shouldDisableNFTRoutes]
  )
}

export interface RouteDefinition {
  path: string
  nestedPaths: string[]
  getTitle: (path?: string) => string
  enabled: (args: RouterConfig) => boolean
  getElement: (args: RouterConfig) => ReactNode
}

// Assigns the defaults to the route definition.
function createRouteDefinition(route: Partial<RouteDefinition>): RouteDefinition {
  return {
    getElement: () => null,
    getTitle: () => 'Uniswap Interface',
    enabled: () => true,
    path: '/',
    nestedPaths: [],
    // overwrite the defaults
    ...route,
  }
}

const SwapTitle = t`Buy, sell & trade on DBCSwap`

export const routes: RouteDefinition[] = [
  createRouteDefinition({
    path: '/',
    getTitle: () => t`DBCSwap | The native DeFi platform on DBC`,
    getElement: (args) => {
      const location = useLocation();
      const searchParams = new URLSearchParams(location.search);
      if (!searchParams.has('chain')) {
        return <Navigate to="/?chain=dbc" replace />;
      }
      return args.browserRouterEnabled && args.hash ? <Navigate to={args.hash.replace('#', '')} replace /> : <Landing />;
    },
  }),
  createRouteDefinition({
    path: '/buy-dbc',
    getTitle: () => t`How to Purchase DBC and Transfer It to Your Wallet`,
    getElement: () => (
      <Suspense fallback={<LazyLoadSpinner />}>
        <BuyDBC />
      </Suspense>
    ),
  }),
  createRouteDefinition({
    path: '/explore',
    getTitle: getExploreTitle,
    nestedPaths: [':tab', ':chainName', ':tab/:chainName'],
    getElement: () => <RedirectExplore />,
  }),
  createRouteDefinition({
    path: '/explore/tokens/:chainName/:tokenAddress',
    getTitle: () => t`Buy & sell on DBCSwap`,
    getElement: () => <TokenDetails />,
  }),
  createRouteDefinition({
    path: '/tokens',
    getTitle: getDefaultTokensTitle,
    getElement: () => <Navigate to="/explore/tokens" replace />,
  }),
  createRouteDefinition({
    path: '/tokens/:chainName',
    getTitle: getDefaultTokensTitle,
    getElement: () => <RedirectExplore />,
  }),
  createRouteDefinition({
    path: '/tokens/:chainName/:tokenAddress',
    getTitle: getDefaultTokensTitle,
    getElement: () => <RedirectExplore />,
  }),
  createRouteDefinition({
    path: '/explore/pools/:chainName/:poolAddress',
    getTitle: () => t`Explore pools on DBCSwap`,
    getElement: () => (
      <Suspense fallback={null}>
        <PoolDetails />
      </Suspense>
    ),
  }),
  createRouteDefinition({
    path: '/vote/*',
    getTitle: () => t`Vote on governance proposals on DBCSwap`,
    getElement: () => (
      <Suspense fallback={<LazyLoadSpinner />}>
        <Vote />
      </Suspense>
    ),
  }),
  createRouteDefinition({
    path: '/create-proposal',
    getTitle: () => t`Create a new governance proposal on DBCSwap`,
    getElement: () => <Navigate to="/vote/create-proposal" replace />,
  }),
  createRouteDefinition({
    path: '/send',
    getElement: () => <Swap />,
    getTitle: () => t`Send tokens on DBCSwap`,
  }),
  createRouteDefinition({
    path: '/limits',
    getElement: () => <Navigate to="/limit" replace />,
  }),
  createRouteDefinition({
    path: '/limit',
    getElement: () => <Swap />,
    getTitle: () => SwapTitle,
  }),
  createRouteDefinition({
    path: '/swap',
    getElement: () => {
      const location = useLocation();
      const searchParams = new URLSearchParams(location.search);
      if (!searchParams.has('chain')) {
        return <Navigate to="/swap?chain=dbc" replace />;
      }
      return <Swap />;
    },
    getTitle: () => SwapTitle,
  }),
  createRouteDefinition({
    path: '/pool/v2/find',
    getElement: () => <PoolFinder />,
    getTitle: () => t`Explore top liquidity pools (v2) on DBCSwap`,
  }),
  createRouteDefinition({
    path: '/pool/v2',
    getElement: () => <PoolV2 />,
    getTitle: () => t`Provide liquidity to pools (v2) on DBCSwap`,
  }),
  createRouteDefinition({
    path: '/pool',
    getElement: () => <Pool />,
    getTitle: () => t`Manage & provide pool liquidity on DBCSwap`,
  }),
  createRouteDefinition({
    path: '/pool/:tokenId',
    getElement: () => <PositionPage />,
    getTitle: () => t`Manage pool liquidity on DBCSwap`,
  }),
  createRouteDefinition({
    path: '/pools/v2/find',
    getElement: () => <PoolFinder />,
    getTitle: () => t`Explore top liquidity pools (v2) on DBCSwap`,
  }),
  createRouteDefinition({
    path: '/pools/v2',
    getElement: () => <PoolV2 />,
    getTitle: () => t`Manage & provide v2 pool liquidity on DBCSwap`,
  }),
  createRouteDefinition({
    path: '/pools',
    getElement: () => <Pool />,
    getTitle: () => t`Manage & provide pool liquidity on DBCSwap`,
  }),
  createRouteDefinition({
    path: '/pools/:tokenId',
    getElement: () => <PositionPage />,
    getTitle: () => t`Manage pool liquidity on DBCSwap`,
  }),
  createRouteDefinition({
    path: '/add/v2',
    nestedPaths: [':currencyIdA', ':currencyIdA/:currencyIdB'],
    getElement: () => <AddLiquidityV2WithTokenRedirects />,
    getTitle: () => t`Provide liquidity to pools (v2) on DBCSwap`,
  }),
  createRouteDefinition({
    path: '/add/single',
    nestedPaths: [':currencyIdA', ':currencyIdA/:currencyIdB'],
    getElement: () => <AddSingleSidedWithTokenRedirects />,
    getTitle: () => t`Provide liquidity to Single Sided Vaults on DBCSwap`,
  }),
  createRouteDefinition({
    path: '/ichivault/:vaultAddress',
    getElement: () => <IchiVaultDetails />,
    getTitle: () => t`Manage single sided vault on DBCSwap`,
  }),
  createRouteDefinition({
    path: '/remove/single/:vaultAddress',
    getElement: () => <WithdrawIchi />,
    getTitle: () => t`Manage single sided vault on DBCSwap`,
  }),
  createRouteDefinition({
    path: '/add',
    nestedPaths: [
      ':currencyIdA',
      ':currencyIdA/:currencyIdB',
      ':currencyIdA/:currencyIdB/:feeAmount',
      ':currencyIdA/:currencyIdB/:feeAmount/:tokenId',
    ],
    getElement: () => <AddLiquidityWithTokenRedirects />,
    getTitle: () => t`Provide liquidity to pools on DBCSwap`,
  }),
  createRouteDefinition({
    path: '/remove/v2/:currencyIdA/:currencyIdB',
    getElement: () => <RemoveLiquidity />,
    getTitle: () => t`Manage v2 pool liquidity on DBCSwap`,
  }),
  createRouteDefinition({
    path: '/remove/:tokenId',
    getElement: () => <RemoveLiquidityV3 />,
    getTitle: () => t`Manage pool liquidity on DBCSwap`,
  }),
  createRouteDefinition({
    path: '/migrate/v2',
    getElement: () => <MigrateV2 />,
    getTitle: () => t`Migrate v2 pool liquidity to DBCSwap v3`,
  }),
  createRouteDefinition({
    path: '/migrate/v2/:address',
    getElement: () => <MigrateV2Pair />,
    getTitle: () => t`Migrate v2 pool liquidity to DBCSwap v3`,
  }),
  createRouteDefinition({
    path: '/nfts',
    getElement: () => (
      <Suspense fallback={null}>
        <NftExplore />
      </Suspense>
    ),
    enabled: (args) => !args.shouldDisableNFTRoutes,
    getTitle: () => t`Trade NFTs across OpenSea & other top marketplaces on DBCSwap`,
  }),
  createRouteDefinition({
    path: '/nfts/asset/:contractAddress/:tokenId',
    getElement: () => (
      <Suspense fallback={null}>
        <Asset />
      </Suspense>
    ),
    enabled: (args) => !args.shouldDisableNFTRoutes,
    getTitle: () => t`Explore NFTs on DBCSwap`,
  }),
  createRouteDefinition({
    path: '/nfts/profile',
    getElement: () => (
      <Suspense fallback={null}>
        <Profile />
      </Suspense>
    ),
    enabled: (args) => !args.shouldDisableNFTRoutes,
    getTitle: () => t`Explore NFTs on DBCSwap`,
  }),
  createRouteDefinition({
    path: '/nfts/collection/:contractAddress',
    getElement: () => (
      <Suspense fallback={null}>
        <Collection />
      </Suspense>
    ),
    enabled: (args) => !args.shouldDisableNFTRoutes,
    getTitle: () => t`Explore NFTs on DBCSwap`,
  }),
  createRouteDefinition({
    path: '/nfts/collection/:contractAddress/activity',
    getElement: () => (
      <Suspense fallback={null}>
        <Collection />
      </Suspense>
    ),
    enabled: (args) => !args.shouldDisableNFTRoutes,
    getTitle: () => t`Explore NFTs on DBCSwap`,
  }),
  createRouteDefinition({
    path: '/stake',
    getElement: () => <Stake />,
    getTitle: () => t`Stake UBE`,
  }),
  createRouteDefinition({
    path: '/stakes/:contractAddress',
    getElement: () => <StakeCustom />,
    getTitle: () => t`Stake Token`,
  }),
  createRouteDefinition({
    path: '/add-proposal',
    getElement: () => <AddProposal />,
    getTitle: () => t`Add new Proposal`,
  }),
  createRouteDefinition({
    path: '/farm/:currencyIdA/:currencyIdB/:stakingAddress',
    getElement: () => <FarmManage />,
    getTitle: () => t`Manage Farm`,
  }),
  createRouteDefinition({
    path: '/farm/:currencyId/:stakingAddress',
    getElement: () => <FarmManageSingle />,
    getTitle: () => t`Manage Farm`,
  }),
  createRouteDefinition({
    path: '/farmv3/:poolAddress',
    getElement: () => <FarmV3 />,
    getTitle: () => t`Manage V3 Farm`,
  }),
  createRouteDefinition({
    path: '/claim-new-ube',
    getElement: () => <ClaimNewUbe />,
    getTitle: () => t`Claim New UBE`,
  }),
  createRouteDefinition({
    path: '/claim-new-pact',
    getElement: () => <ClaimNewPact />,
    getTitle: () => t`Claim New PACT`,
  }),
  createRouteDefinition({
    path: '/earn',
    getTitle: getExploreTitle,
    nestedPaths: [':tab', ':chainName', ':tab/:chainName'],
    getElement: () => <RedirectEarn />,
  }),
  createRouteDefinition({
    path: '/debug',
    getElement: () => <Debug />,
  }),
  // createRouteDefinition({
  //   path: '/warp',
  //   getTitle: () => t`Warp on DBCSwap`,
  //   getElement: () => (
  //     <Suspense fallback={<LazyLoadSpinner />}>
  //       <Warp />
  //     </Suspense>
  //   ),
  // }),
  createRouteDefinition({ path: '*', getElement: () => <Navigate to="/not-found" replace /> }),
  createRouteDefinition({ path: '/not-found', getElement: () => <NotFound /> }),
]

export const findRouteByPath = (pathname: string) => {
  for (const route of routes) {
    const match = matchPath(route.path, pathname)
    if (match) {
      return route
    }
    const subPaths = route.nestedPaths.map((nestedPath) => `${route.path}/${nestedPath}`)
    for (const subPath of subPaths) {
      const match = matchPath(subPath, pathname)
      if (match) {
        return route
      }
    }
  }
  return undefined
}
