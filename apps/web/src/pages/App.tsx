import { CustomUserProperties, getBrowser, SharedEventName } from '@ubeswap/analytics-events'
import { sendAnalyticsEvent, sendInitializationEvent, Trace, user } from 'analytics'
import ErrorBoundary from 'components/ErrorBoundary'
import Loader from 'components/Icons/LoadingSpinner'
import NavBar, { PageTabs } from 'components/NavBar'
import { UK_BANNER_HEIGHT, UK_BANNER_HEIGHT_MD, UK_BANNER_HEIGHT_SM, UkBanner } from 'components/NavBar/UkBanner'
import { useFeatureFlagURLOverrides } from 'featureFlags'
import { useAtom } from 'jotai'
import { useBag } from 'nft/hooks/useBag'
import { lazy, memo, Suspense, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async/lib/index'
import { Navigate, Route, Routes, useLocation, useSearchParams } from 'react-router-dom'
import { shouldDisableNFTRoutesAtom } from 'state/application/atoms'
import { useAppSelector } from 'state/hooks'
import { AppState } from 'state/reducer'
import { useRouterPreference } from 'state/user/hooks'
import styled from 'styled-components'
import DarkModeQueryParamReader from 'theme/components/DarkModeQueryParamReader'
import { useIsDarkMode } from 'theme/components/ThemeToggle'
import { flexRowNoWrap } from 'theme/styles'
import { Z_INDEX } from 'theme/zIndex'
import { isMobile } from 'uniswap/src/utils/platform'
import { isPathBlocked } from 'utils/blockedPaths'
import { MICROSITE_LINK } from 'utils/openDownloadApp'
import { getCurrentPageFromLocation } from 'utils/urlRoutes'
import { getCLS, getFCP, getFID, getLCP, Metric } from 'web-vitals'

import { MoveDirection, OutMode, type Container, type ISourceOptions } from '@tsparticles/engine'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'

import { findRouteByPath, RouteDefinition, routes, useRouterConfig } from './RouteDefinitions'

// The Chrome is always loaded, but is lazy-loaded because it is not needed without user interaction.
// Annotating it with webpackPreload allows it to be ready when requested.
const AppChrome = lazy(() => import(/* webpackPreload: true */ './AppChrome'))

const BodyWrapper = styled.div<{ bannerIsVisible?: boolean }>`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  min-height: calc(100vh - ${({ bannerIsVisible }) => (bannerIsVisible ? UK_BANNER_HEIGHT : 0)}px);
  padding: ${({ theme }) => theme.navHeight}px 0px 5rem 0px;
  align-items: center;
  flex: 1;

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    min-height: calc(100vh - ${({ bannerIsVisible }) => (bannerIsVisible ? UK_BANNER_HEIGHT_MD : 0)}px);
  }

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
    min-height: calc(100vh - ${({ bannerIsVisible }) => (bannerIsVisible ? UK_BANNER_HEIGHT_SM : 0)}px);
  }
`

const MobileBottomBar = styled.div`
  z-index: ${Z_INDEX.sticky};
  position: fixed;
  display: flex;
  bottom: 0;
  right: 0;
  left: 0;
  width: calc(100vw - 16px);
  justify-content: space-between;
  padding: 0px 4px;
  height: ${({ theme }) => theme.mobileBottomBarHeight}px;
  background: ${({ theme }) => theme.surface1};
  border: 1px solid ${({ theme }) => theme.surface3};
  margin: 8px;
  border-radius: 20px;

  @media screen and (min-width: ${({ theme }) => theme.breakpoint.md}px) {
    display: none;
  }
`

const HeaderWrapper = styled.div<{ transparent?: boolean; bannerIsVisible?: boolean; scrollY: number }>`
  ${flexRowNoWrap};
  background-color: ${({ theme, transparent }) => !transparent && theme.surface1};
  border-bottom: ${({ theme, transparent }) => !transparent && `1px solid ${theme.surface3}`};
  width: 100%;
  justify-content: space-between;
  position: fixed;
  top: ${({ bannerIsVisible }) => (bannerIsVisible ? Math.max(UK_BANNER_HEIGHT - scrollY, 0) : 0)}px;
  z-index: ${Z_INDEX.sticky};

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    top: ${({ bannerIsVisible }) => (bannerIsVisible ? Math.max(UK_BANNER_HEIGHT_MD - scrollY, 0) : 0)}px;
  }

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
    top: ${({ bannerIsVisible }) => (bannerIsVisible ? Math.max(UK_BANNER_HEIGHT_SM - scrollY, 0) : 0)}px;
  }
`

const useRenderUkBanner = () => {
  const originCountry = useAppSelector((state: AppState) => state.user.originCountry)
  return Boolean(originCountry) && originCountry === 'GB'
}

export default function App() {
  const [, setShouldDisableNFTRoutes] = useAtom(shouldDisableNFTRoutesAtom)

  const location = useLocation()
  const { pathname } = location
  const currentPage = getCurrentPageFromLocation(pathname)
  const renderUkBanner = useRenderUkBanner()
  const [init, setInit] = useState(false)

  // this should be run only once per application lifetime
  useEffect(() => {
    if (isMobile == false) {
      initParticlesEngine(async (engine) => {
        await loadSlim(engine)
      }).then(() => {
        setInit(true)
      })
    }
  }, [])
  const particlesLoaded = async (container?: Container): Promise<void> => {
    console.log(container)
  }
  const options: ISourceOptions = useMemo(
    () => ({
      background: {
        color: {
          value: '#ffffff',
        },
        opacity: 0,
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: 'push',
          },
          onHover: {
            enable: false,
            mode: 'repulse',
          },
        },
        modes: {
          push: {
            quantity: 3,
          },
          repulse: {
            distance: 50,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: {
          value: '#8878c3',
        },
        links: {
          color: '#8878c3',
          distance: 150,
          enable: true,
          opacity: 0.5,
          width: 1,
        },
        move: {
          direction: MoveDirection.none,
          enable: true,
          outModes: {
            default: OutMode.out,
          },
          random: false,
          speed: 0.5,
          straight: false,
        },
        number: {
          density: {
            enable: true,
          },
          value: 40,
        },
        opacity: {
          value: 0.5,
        },
        shape: {
          type: 'circle',
        },
        size: {
          value: { min: 1, max: 5 },
        },
      },
      detectRetina: true,
    }),
    []
  )

  const [searchParams] = useSearchParams()
  useEffect(() => {
    // if (searchParams.get('disableNFTs') === 'true') {
    // setShouldDisableNFTRoutes(true)
    // } else if (searchParams.get('disableNFTs') === 'false') {
    // setShouldDisableNFTRoutes(false)
    // }
    setShouldDisableNFTRoutes(true)
  }, [searchParams, setShouldDisableNFTRoutes])

  useFeatureFlagURLOverrides()

  // redirect address to landing pages until implemented
  const shouldRedirectToAppInstall = pathname?.startsWith('/address/')
  useLayoutEffect(() => {
    if (shouldRedirectToAppInstall) {
      window.location.href = MICROSITE_LINK
    }
  }, [shouldRedirectToAppInstall])

  if (shouldRedirectToAppInstall) {
    return null
  }

  const shouldBlockPath = isPathBlocked(pathname)
  if (shouldBlockPath && pathname !== '/swap') {
    return <Navigate to="/swap" replace />
  }
  return (
    <ErrorBoundary>
      <DarkModeQueryParamReader />
      <Trace page={currentPage}>
        {/*
          This is where *static* page titles are injected into the <head> tag. If you
          want to set a page title based on data that's dynamic or not available on first render,
          you can set it later in the page component itself, since react-helmet-async prefers the most recently rendered title.
        */}
        <Helmet>
          <title>{findRouteByPath(pathname)?.getTitle(pathname) ?? 'DBCSwap Interface'}</title>
        </Helmet>
        <UserPropertyUpdater />
        {renderUkBanner && <UkBanner />}
        <Header />
        <ResetPageScrollEffect />
        <Suspense>
          {init && <Particles id="tsparticles" particlesLoaded={particlesLoaded} options={options} />}
        </Suspense>
        <Body />
        <MobileBottomBar>
          <PageTabs />
        </MobileBottomBar>
      </Trace>
    </ErrorBoundary>
  )
}

const Body = memo(function Body() {
  const routerConfig = useRouterConfig()
  const renderUkBanner = useRenderUkBanner()

  return (
    <BodyWrapper bannerIsVisible={renderUkBanner}>
      <Suspense>
        <AppChrome />
      </Suspense>
      <Suspense fallback={<Loader />}>
        <Routes>
          {routes.map((route: RouteDefinition) =>
            route.enabled(routerConfig) ? (
              <Route key={route.path} path={route.path} element={route.getElement(routerConfig)}>
                {route.nestedPaths.map((nestedPath) => (
                  <Route
                    path={nestedPath}
                    element={route.getElement(routerConfig)}
                    key={`${route.path}/${nestedPath}`}
                  />
                ))}
              </Route>
            ) : null
          )}
        </Routes>
      </Suspense>
    </BodyWrapper>
  )
})

const ResetPageScrollEffect = memo(function ResetPageScrollEffect() {
  const location = useLocation()
  const { pathname } = location
  const currentPage = getCurrentPageFromLocation(pathname)
  const [hasChangedOnce, setHasChangedOnce] = useState(false)

  useEffect(() => {
    if (!hasChangedOnce) {
      // avoid setting scroll to top on initial load
      setHasChangedOnce(true)
    } else {
      // URL may change without page changing (e.g. when switching chains), and we only want to reset scroll to top if the page changes
      window.scrollTo(0, 0)
    }
    // we don't want this to re-run on change of hasChangedOnce! or else it defeats the point of the fix
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage])

  return null
})

const Header = memo(function Header() {
  const [isScrolledDown, setIsScrolledDown] = useState(false)
  const isBagExpanded = useBag((state) => state.bagExpanded)
  const isHeaderTransparent = !isScrolledDown && !isBagExpanded
  const renderUkBanner = useRenderUkBanner()

  useEffect(() => {
    const scrollListener = () => {
      setIsScrolledDown(window.scrollY > 0)
    }
    window.addEventListener('scroll', scrollListener)
    return () => window.removeEventListener('scroll', scrollListener)
  }, [])

  return (
    <HeaderWrapper transparent={isHeaderTransparent} bannerIsVisible={renderUkBanner} scrollY={scrollY}>
      <NavBar blur={isHeaderTransparent} />
    </HeaderWrapper>
  )
})

function UserPropertyUpdater() {
  const isDarkMode = useIsDarkMode()

  const [routerPreference] = useRouterPreference()
  const rehydrated = useAppSelector((state) => state._persist.rehydrated)

  useEffect(() => {
    // User properties *must* be set before sending corresponding event properties,
    // so that the event contains the correct and up-to-date user properties.
    user.set(CustomUserProperties.USER_AGENT, navigator.userAgent)
    user.set(CustomUserProperties.BROWSER, getBrowser())
    user.set(CustomUserProperties.SCREEN_RESOLUTION_HEIGHT, window.screen.height)
    user.set(CustomUserProperties.SCREEN_RESOLUTION_WIDTH, window.screen.width)
    user.set(CustomUserProperties.GIT_COMMIT_HASH, process.env.REACT_APP_GIT_COMMIT_HASH ?? 'unknown')

    // Service Worker analytics
    const isServiceWorkerInstalled = Boolean(window.navigator.serviceWorker?.controller)
    const serviceWorkerProperty = isServiceWorkerInstalled ? 'installed' : 'uninstalled'

    let cache = 'unknown'
    try {
      const timing = performance
        .getEntriesByType('resource')
        .find((timing) => timing.name.match(/\/static\/js\/main\.\w{8}\.js$/)) as PerformanceResourceTiming
      if (timing.transferSize === 0) {
        cache = 'hit'
      } else {
        cache = 'miss'
      }
    } catch {
      // ignore
    }

    const pageLoadProperties = { service_worker: serviceWorkerProperty, cache }
    sendInitializationEvent(SharedEventName.APP_LOADED, pageLoadProperties)
    const sendWebVital =
      (metric: string) =>
      ({ delta }: Metric) =>
        sendAnalyticsEvent(SharedEventName.WEB_VITALS, { ...pageLoadProperties, [metric]: delta })
    getCLS(sendWebVital('cumulative_layout_shift'))
    getFCP(sendWebVital('first_contentful_paint_ms'))
    getFID(sendWebVital('first_input_delay_ms'))
    getLCP(sendWebVital('largest_contentful_paint_ms'))
  }, [])

  useEffect(() => {
    user.set(CustomUserProperties.DARK_MODE, isDarkMode)
  }, [isDarkMode])

  useEffect(() => {
    if (!rehydrated) return
    user.set(CustomUserProperties.ROUTER_PREFERENCE, routerPreference)
  }, [routerPreference, rehydrated])
  return null
}
