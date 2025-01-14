import { Currency, CurrencyAmount, Fraction, Percent, TradeType } from '@ubeswap/sdk-core'
import { Trade } from '@uniswap/router-sdk'
import { Pair } from '@uniswap/v2-sdk'
import { FeeAmount } from '@uniswap/v3-sdk'
import { DefaultTheme } from 'styled-components'

import {
  ALLOWED_PRICE_IMPACT_HIGH,
  ALLOWED_PRICE_IMPACT_LOW,
  ALLOWED_PRICE_IMPACT_MEDIUM,
  BIPS_BASE,
  BLOCKED_PRICE_IMPACT_NON_EXPERT,
  ONE_HUNDRED_PERCENT,
  ZERO_PERCENT,
} from '../constants/misc'

const THIRTY_BIPS_FEE = new Percent(30, BIPS_BASE)
const INPUT_FRACTION_AFTER_FEE = ONE_HUNDRED_PERCENT.subtract(THIRTY_BIPS_FEE)

export function computeRealizedPriceImpact(trade: Trade<Currency, Currency, TradeType>): Percent {
  const realizedLpFeePercent = computeRealizedLPFeePercent(trade)
  return trade.priceImpact.subtract(realizedLpFeePercent)
}

// 计算实际的LP(流动性提供者)费用百分比
function computeRealizedLPFeePercent(trade: Trade<Currency, Currency, TradeType>): Percent {
  let percent: Percent

  // 由于目前路由要么全是v2要么全是v3，所以分开计算
  if (trade.swaps[0].route.pools instanceof Pair) {
    // V2池子的情况
    // 对于交易中的每一跳，都要计算0.3%费用的价格影响
    // 例如: 对于3个代币/2跳的情况: 1 - ((1 - 0.03) * (1-0.03))
    // 也就是说每经过一个池子都会收取0.3%的费用
    percent = ONE_HUNDRED_PERCENT.subtract(
      trade.swaps.reduce<Percent>(
        (currentFee: Percent): Percent => currentFee.multiply(INPUT_FRACTION_AFTER_FEE), // INPUT_FRACTION_AFTER_FEE = 1 - 0.3%
        ONE_HUNDRED_PERCENT
      )
    )
  } else {
    // V3池子的情况
    percent = ZERO_PERCENT
    console.log('computeRealizedLPFeePercent中trade.swaps:', trade.swaps)
    for (const swap of trade.swaps) {
      // console.log('computeRealizedLPFeePercent中swap:', swap)
      // 计算这个swap在整个交易输入量中占的比例
      // 例如：如果一个交易分成两部分，可能是60%走路径A，40%走路径B
      const { numerator, denominator } = swap.inputAmount.divide(trade.inputAmount)
      const overallPercent = new Percent(numerator, denominator)

      // 计算这个路由实际的LP费用百分比
      const routeRealizedLPFeePercent = overallPercent.multiply(
        ONE_HUNDRED_PERCENT.subtract(
          swap.route.pools.reduce<Percent>((currentFee: Percent, pool): Percent => {
            // 获取池子的费用率
            const fee =
              pool instanceof Pair
                ? // 虽然前面已经检查过不是Pair了，这里是以防万一的检查
                  FeeAmount.MEDIUM  // V2池子统一用0.3%的费率
                : pool.fee          // V3池子用其自定义的费率(可能是0.01%, 0.05%, 0.3%, 1%等)
            // 计算扣除费用后剩余的比例
            // fee是以百万分之一为单位的，所以要除以1_000_000
            return currentFee.multiply(ONE_HUNDRED_PERCENT.subtract(new Fraction(fee, 1_000_000)))
          }, ONE_HUNDRED_PERCENT)
        )
      )

      // 累加每个路由的费用
      percent = percent.add(routeRealizedLPFeePercent)
    }
  }

  // 返回最终计算出的LP费用百分比
  return new Percent(percent.numerator, percent.denominator)
}

// computes price breakdown for the trade
export function computeRealizedLPFeeAmount(
  trade?: Trade<Currency, Currency, TradeType> | null
): CurrencyAmount<Currency> | undefined {
  if (trade) {
    const realizedLPFee = computeRealizedLPFeePercent(trade)

    // the amount of the input that accrues to LPs
    return CurrencyAmount.fromRawAmount(trade.inputAmount.currency, trade.inputAmount.multiply(realizedLPFee).quotient)
  }

  return undefined
}

const IMPACT_TIERS = [
  BLOCKED_PRICE_IMPACT_NON_EXPERT,
  ALLOWED_PRICE_IMPACT_HIGH,
  ALLOWED_PRICE_IMPACT_MEDIUM,
  ALLOWED_PRICE_IMPACT_LOW,
]

type WarningSeverity = 0 | 1 | 2 | 3 | 4
export function warningSeverity(priceImpact: Percent | undefined): WarningSeverity {
  if (!priceImpact) return 0
  // This function is used to calculate the Severity level for % changes in USD value and Price Impact.
  // Price Impact is always an absolute value (conceptually always negative, but represented in code with a positive value)
  // The USD value change can be positive or negative, and it follows the same standard as Price Impact (positive value is the typical case of a loss due to slippage).
  // We don't want to return a warning level for a favorable/profitable change, so when the USD value change is negative we return 0.
  // TODO (WEB-1833): Disambiguate Price Impact and USD value change, and flip the sign of USD Value change.
  if (priceImpact.lessThan(0)) return 0
  let impact: WarningSeverity = IMPACT_TIERS.length as WarningSeverity
  for (const impactLevel of IMPACT_TIERS) {
    if (impactLevel.lessThan(priceImpact)) return impact
    impact--
  }
  return 0
}

export function getPriceImpactWarning(priceImpact: Percent): 'warning' | 'error' | undefined {
  if (priceImpact.greaterThan(ALLOWED_PRICE_IMPACT_HIGH)) return 'error'
  if (priceImpact.greaterThan(ALLOWED_PRICE_IMPACT_MEDIUM)) return 'warning'
  return
}

export function getPriceImpactColor(priceImpact: Percent): keyof DefaultTheme | undefined {
  switch (getPriceImpactWarning(priceImpact)) {
    case 'error':
      return 'critical'
    case 'warning':
      return 'deprecated_accentWarning'
    default:
      return undefined
  }
}
