import { CandleModel } from "@/src/entities/exchanges/candle";
import { TokenModel } from "@/src/entities/exchanges/token";
import { V3PoolModel } from "@/src/entities/exchanges/v3pool";
import { TradeModel } from "@/src/entities/trades/trade";
import { CandlesQueryType, useGetCandlesQuery } from "@/src/shared/api/candlesApi/hooks/useCandlesQuery";
import { useV3SwapSubscription } from "@/src/shared/api/v3SwapsApi/hooks/v3SwapsSubscribeHook";
import { combineCachedCandlesAndNewTrades } from "@/src/shared/hooks/candles/getCandlesFromCachedCandlesAndNewTrades";
import { useMemo } from "react";
import TradingChart from "../tradeInterface/TradingChart";
import TradesHistory from "../tradeInterface/TradingHistory";

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


  const newTrades = useMemo(() => TradeModel.FromV3SwapArray(newSwaps, token0, token1), [newSwaps, token0, token1])

  const descendingTrades = useMemo(() => {
    console.log("NEW TRADES LEN: ", newTrades[newTrades.length - 1]?.timestamp)
    const descendingTrades = [...newTrades]
    descendingTrades.reverse()
    return descendingTrades
  }, [newTrades])

  const { candles, updatingCandle } = useMemo<{ candles: CandleModel[], updatingCandle: CandleModel | null }>(
    () => {
      return combineCachedCandlesAndNewTrades({
        cachedCandles,
        newTrades,
        token0,
        token1,
        timeSpacing,
        forToken: forToken
      })
    },
    [cachedCandles, forToken, newTrades, timeSpacing, token0, token1]
  )
  console.log(candles)

  return (
    <div className="flex flex-col gap-10">
      <TradingChart
        forToken={forToken}
        candles={candles}
        updatingCandle={updatingCandle}
      />
      <TradesHistory
        chartForToken={forToken}
        trades={descendingTrades}
        token0={token0}
        token1={token1}
      />
    </div>
  )


}

export default V3PoolChart
