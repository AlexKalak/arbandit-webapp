import { CandleModel } from "@/src/entities/exchanges/candle";
import { TokenModel } from "@/src/entities/exchanges/token";
import { V3PoolModel } from "@/src/entities/exchanges/v3pool";
import { TradeModel } from "@/src/entities/trades/trade";
import { CandlesQueryType, useGetCandlesQuery } from "@/src/shared/api/candlesApi/hooks/useCandlesQuery";
import { useV3SwapSubscription } from "@/src/shared/api/v3SwapsApi/hooks/v3SwapsSubscribeHook";
import { combineCachedCandlesAndNewTrades } from "@/src/shared/hooks/candles/getCandlesFromCachedCandlesAndNewTrades";
import { useMemo } from "react";
import TradingChart from "../tradeInterface/TradingChart";

type V3PoolChartProps = {
  pool: V3PoolModel
  chartForToken: number
  timeSpacing: number
  token0: TokenModel,
  token1: TokenModel
}

const V3PoolChart = ({
  pool,
  chartForToken: forToken,
  timeSpacing,
  token0,
  token1,
}: V3PoolChartProps) => {
  const {
    swaps: newSwaps,
    isLoading: newSwapsIsLoading,
    error: newSwapsSubscriptionError
  } = useV3SwapSubscription(pool.address, pool.chainId)

  const { candles: cachedCandles } = useGetCandlesQuery({
    type: CandlesQueryType.V3Pool,
    address: pool.address,
    chainId: pool.chainId,
    chartForToken: forToken,
    timeSpacing
  })

  const { candles, updatingCandle } = useMemo<{ candles: CandleModel[], updatingCandle: CandleModel | null }>(
    () => {
      const newTrades = TradeModel.FromV3SwapArray(newSwaps, token0, token1)

      return combineCachedCandlesAndNewTrades({
        cachedCandles,
        newTrades,
        token0,
        token1,
        timeSpacing,
        forToken: forToken
      })
    },
    [cachedCandles, forToken, newSwaps, timeSpacing, token0, token1]
  )

  return (
    <TradingChart
      forToken={forToken}
      candles={candles}
      updatingCandle={updatingCandle}
    />
  )


}

export default V3PoolChart
