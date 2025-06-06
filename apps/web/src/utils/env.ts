export function isDevelopmentEnv(): boolean {
  return process.env.NODE_ENV === 'development'
}

export function isTestEnv(): boolean {
  return process.env.NODE_ENV === 'test'
}

export function isStagingEnv(): boolean {
  // This is set in vercel builds and deploys from web/staging.
  return Boolean(process.env.REACT_APP_STAGING)
}

export function isProductionEnv(): boolean {
  return process.env.NODE_ENV === 'production' && !isStagingEnv()
}

function isAppUniswapOrg({ hostname }: { hostname: string }): boolean {
  return hostname === 'app.uniswap.org'
}

function isAppUniswapStagingOrg({ hostname }: { hostname: string }): boolean {
  return hostname === 'app.corn-staging.com'
}

export function isBrowserRouterEnabled(): boolean {
  return true // 始终使用 BrowserRouter
}

function isLocalhost({ hostname }: { hostname: string }): boolean {
  return hostname === 'localhost'
}

export function isSentryEnabled(): boolean {
  // Disable in e2e test environments
  if (isStagingEnv() && !isAppUniswapStagingOrg(window.location)) return false
  if (isProductionEnv() && !isAppUniswapOrg(window.location)) return false
  return process.env.REACT_APP_SENTRY_ENABLED === 'true'
}

export function getEnvName(): 'production' | 'staging' | 'development' {
  if (isStagingEnv()) {
    return 'staging'
  }
  if (isProductionEnv()) {
    return 'production'
  }
  return 'development'
}
