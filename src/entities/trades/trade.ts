import { ID2Name } from "@/src/shared/helpers/chains";
import { V3SwapModel } from "../exchanges/v3Swap";
import { TokenModel } from "../exchanges/token";

export class TradeModel {
  name: string;
  identifier: string
  amount0: number;
  amount1: number;
  archiveToken0UsdPrice: number;
  archiveToken1UsdPrice: number;
  timestamp: number;

  constructor(v3Swap: V3SwapModel, token0: TokenModel, token1: TokenModel) {
    this.name = `${ID2Name(v3Swap.chainId)} ${token0.symbol} ${token1.symbol} `
    this.identifier = `${v3Swap.chainId}_${v3Swap.poolAddress} `
    this.amount0 = token0.getRealAmountOfToken(v3Swap.amount0)
    this.amount1 = token1.getRealAmountOfToken(v3Swap.amount1)
    this.archiveToken0UsdPrice = v3Swap.archiveToken0UsdPrice
    this.archiveToken1UsdPrice = v3Swap.archiveToken1UsdPrice
    this.timestamp = v3Swap.txTimestamp
  }

  public static FromV3SwapArray(v3swaps: V3SwapModel[], token0: TokenModel, token1: TokenModel): TradeModel[] {
    const trades: TradeModel[] = []
    for (const swap of v3swaps) {
      const trade = new TradeModel(swap, token0, token1)
      trades.push(trade)
    }

    return trades
  }
}
