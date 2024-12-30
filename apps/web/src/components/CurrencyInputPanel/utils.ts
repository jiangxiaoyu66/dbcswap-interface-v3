import { Currency } from '@ubeswap/sdk-core'

export function formatCurrencySymbol(currency?: Currency): string | undefined {
  return currency && currency.symbol && currency.symbol.length > 20
    ? currency.symbol.slice(0, 4) + '...' + currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
    : currency?.symbol
}


export function formatCurrencyName(currency?: Currency): string | undefined {
  return currency && currency.name && currency.name.length > 20
    ? currency.name.slice(0, 4) + '...' + currency.name.slice(currency.name.length - 5, currency.name.length)
    : currency?.name
}
