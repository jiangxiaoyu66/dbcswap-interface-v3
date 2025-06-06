import { Interface } from '@ethersproject/abi'
import { Currency, TradeType } from '@ubeswap/sdk-core'
import { Trade as RouterTrade } from '@uniswap/router-sdk'
import UniversalRouterJSON from '@uniswap/universal-router/artifacts/contracts/UniversalRouter.sol/UniversalRouter.json'
import { MethodParameters } from '@uniswap/v3-sdk'
import { BigNumber, BigNumberish } from 'ethers'
import invariant from 'tiny-invariant'
import { SeaportTrade } from './entities'
import { Command, RouterTradeType } from './entities/Command'
import { Market, NFTTrade, SupportedProtocolsData } from './entities/NFTTrade'
import { SwapOptions, UniswapTrade } from './entities/protocols/uniswap'
import { UnwrapWETH } from './entities/protocols/unwrapWETH'
import { ETH_ADDRESS, ROUTER_AS_RECIPIENT, SENDER_AS_RECIPIENT } from './utils/constants'
import { encodePermit } from './utils/inputTokens'
import { CommandType, RoutePlanner } from './utils/routerCommands'

export type SwapRouterConfig = {
  sender?: string // address
  deadline?: BigNumberish
}

type SupportedNFTTrade = NFTTrade<SupportedProtocolsData>

export abstract class SwapRouter {
  public static INTERFACE: Interface = new Interface(UniversalRouterJSON.abi)

  public static swapCallParameters(trades: Command[] | Command, config: SwapRouterConfig = {}): MethodParameters {
    if (!Array.isArray(trades)) trades = [trades]

    // eslint-disable-next-line no-empty-pattern, @typescript-eslint/no-unused-vars, no-prototype-builtins
    const nftTrades = trades.filter((trade, _, []) => trade.hasOwnProperty('market')) as SupportedNFTTrade[]
    const allowRevert = nftTrades.length == 1 && nftTrades[0]!.orders.length == 1 ? false : true
    const planner = new RoutePlanner()

    // track value flow to require the right amount of native value
    let currentNativeValueInRouter = BigNumber.from(0)
    let transactionValue = BigNumber.from(0)

    // tracks the input tokens (and ETH) used to buy NFTs to allow us to sweep
    const nftInputTokens = new Set<string>()

    for (const trade of trades) {
      /**
       * is NFTTrade
       */
      if (trade.tradeType == RouterTradeType.NFTTrade) {
        const nftTrade = trade as SupportedNFTTrade
        nftTrade.encode(planner, { allowRevert })
        const tradePrice = nftTrade.getTotalPrice()

        if (nftTrade.market == Market.Seaport) {
          const seaportTrade = nftTrade as SeaportTrade
          const seaportInputTokens = seaportTrade.getInputTokens()
          seaportInputTokens.forEach((inputToken) => {
            nftInputTokens.add(inputToken)
          })
        } else {
          nftInputTokens.add(ETH_ADDRESS)
        }

        // send enough native value to contract for NFT purchase
        if (currentNativeValueInRouter.lt(tradePrice)) {
          transactionValue = transactionValue.add(tradePrice.sub(currentNativeValueInRouter))
          currentNativeValueInRouter = BigNumber.from(0)
        } else {
          currentNativeValueInRouter = currentNativeValueInRouter.sub(tradePrice)
        }
        /**
         * is UniswapTrade
         */
      } else if (trade.tradeType == RouterTradeType.UniswapTrade) {
        const uniswapTrade = trade as UniswapTrade
        const inputIsNative = uniswapTrade.trade.inputAmount.currency.isNative
        const outputIsNative = uniswapTrade.trade.outputAmount.currency.isNative
        const swapOptions = uniswapTrade.options

        invariant(!(inputIsNative && !!swapOptions.inputTokenPermit), 'NATIVE_INPUT_PERMIT')

        if (swapOptions.inputTokenPermit) {
          encodePermit(planner, swapOptions.inputTokenPermit)
        }

        if (inputIsNative) {
          transactionValue = transactionValue.add(
            BigNumber.from(uniswapTrade.trade.maximumAmountIn(swapOptions.slippageTolerance).quotient.toString())
          )
        }
        // track amount of native currency in the router
        if (outputIsNative && swapOptions.recipient == ROUTER_AS_RECIPIENT) {
          currentNativeValueInRouter = currentNativeValueInRouter.add(
            BigNumber.from(uniswapTrade.trade.minimumAmountOut(swapOptions.slippageTolerance).quotient.toString())
          )
        }
        uniswapTrade.encode(planner, { allowRevert: false })
        /**
         * is UnwrapWETH
         */
      } else if (trade.tradeType == RouterTradeType.UnwrapWETH) {
        const UnwrapWETH = trade as UnwrapWETH
        trade.encode(planner, { allowRevert: false })
        currentNativeValueInRouter = currentNativeValueInRouter.add(UnwrapWETH.amount)
        /**
         * else
         */
      } else {
        throw 'trade must be of instance: UniswapTrade or NFTTrade'
      }
    }

    // TODO: matches current logic for now, but should eventually only sweep for multiple NFT trades
    // or NFT trades with potential slippage (i.e. sudo).
    // Note: NFTXV2 sends excess ETH to the caller (router), not the specified recipient
    nftInputTokens.forEach((inputToken) => {
      planner.addCommand(CommandType.SWEEP, [inputToken, SENDER_AS_RECIPIENT, 0])
    })
    return SwapRouter.encodePlan(planner, transactionValue, config)
  }

  /**
   * @deprecated 推荐使用 swapCallParameters 替代。在 2.0.0 主版本更新前请更新
   * 这个版本对 Seaport ERC20->NFT 购买不能正确工作
   * 为给定的交换生成链上方法名称和十六进制编码的参数。
   * @param trades 需要生成调用参数的交易
   */
  public static swapNFTCallParameters(trades: SupportedNFTTrade[], config: SwapRouterConfig = {}): MethodParameters {
    const planner = new RoutePlanner()
    let totalPrice = BigNumber.from(0)

    const allowRevert = trades.length == 1 && trades[0]!.orders.length == 1 ? false : true

    for (const trade of trades) {
      trade.encode(planner, { allowRevert })
      totalPrice = totalPrice.add(trade.getTotalPrice())
    }

    planner.addCommand(CommandType.SWEEP, [ETH_ADDRESS, SENDER_AS_RECIPIENT, 0])
    return SwapRouter.encodePlan(planner, totalPrice, config)
  }

  /**
   * @deprecated 推荐使用 swapCallParameters 替代。在 2.0.0 主版本更新前请更新
   * 为给定的交易生成链上方法名称和十六进制编码的参数。
   * @param trades 需要生成调用参数的交易
   * @param options 调用参数的选项
   */
  public static swapERC20CallParameters(
    trades: RouterTrade<Currency, Currency, TradeType>,
    options: SwapOptions
  ): MethodParameters {
    // TODO: use permit if signature included in swapOptions
    const planner = new RoutePlanner()

    const trade: UniswapTrade = new UniswapTrade(trades, options)

    const inputCurrency = trade.trade.inputAmount.currency
    invariant(!(inputCurrency.isNative && !!options.inputTokenPermit), 'NATIVE_INPUT_PERMIT')

    if (options.inputTokenPermit) {
      encodePermit(planner, options.inputTokenPermit)
    }

    const nativeCurrencyValue = inputCurrency.isNative
      ? BigNumber.from(trade.trade.maximumAmountIn(options.slippageTolerance).quotient.toString())
      : BigNumber.from(0)

    trade.encode(planner, { allowRevert: false })
    return SwapRouter.encodePlan(planner, nativeCurrencyValue, {
      deadline: options.deadlineOrPreviousBlockhash ? BigNumber.from(options.deadlineOrPreviousBlockhash) : undefined,
    })
  }

  /**
   * 将计划好的路由编码为路由合约的方法名称和参数。
   * @param planner 计划好的路由
   * @param nativeCurrencyValue 计划路由的原生货币价值
   * @param config 路由配置
   */
  private static encodePlan(
    planner: RoutePlanner,
    nativeCurrencyValue: BigNumber,
    config: SwapRouterConfig = {}
  ): MethodParameters {
    const { commands, inputs } = planner
    const functionSignature = config.deadline ? 'execute(bytes,bytes[],uint256)' : 'execute(bytes,bytes[])'
    const parameters = config.deadline ? [commands, inputs, config.deadline] : [commands, inputs]
    const calldata = SwapRouter.INTERFACE.encodeFunctionData(functionSignature, parameters)
    return { calldata, value: nativeCurrencyValue.toHexString() }
  }
}
