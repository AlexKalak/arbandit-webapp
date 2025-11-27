import { CandleModel } from "@/src/entities/exchanges/candle"
import { getPrice } from "../../helpers/trade"
import { v4 } from "uuid"
import { TradeModel } from "@/src/entities/trades/trade"
import { TokenModel } from "@/src/entities/exchanges/token"

type CombineCachedCandlesAndNewTradesProps = {
  cachedCandles: CandleModel[],
  newTrades: TradeModel[],
  token0: TokenModel,
  token1: TokenModel,
  timeSpacing: number,
  forToken: number
}
type CombineCachedCandlesAndNewTradesReturnType = {
  candles: CandleModel[],
  updatingCandle: CandleModel | null,
}

export const combineCachedCandlesAndNewTrades = ({
  cachedCandles,
  newTrades,
  token0,
  token1,
  timeSpacing,
  forToken
}: CombineCachedCandlesAndNewTradesProps):
  CombineCachedCandlesAndNewTradesReturnType => {
  if (!cachedCandles) {
    return { candles: [], updatingCandle: null }
  }

  let updatingCandle = new CandleModel()

  const candles = [...cachedCandles]
  if (candles.length != 0) {
    updatingCandle = candles[candles.length - 1]
  }

  if (!token0 || !token1) {
    return { candles, updatingCandle }
  }

  updatingCandle = tradesToCandles(candles, updatingCandle, newTrades, token0, token1, timeSpacing, forToken)

  return { candles: candles, updatingCandle: null }
}

const tradesToCandles = (candles: CandleModel[], updatingCandle: CandleModel, newTrades: TradeModel[], token0: TokenModel, token1: TokenModel, timeSpacing: number, forToken: number): CandleModel => {
  for (const trade of newTrades) {
    const normalizedTxTimestamp =
      trade.timestamp - (trade.timestamp % timeSpacing);

    if (normalizedTxTimestamp < updatingCandle.timestamp) {
      continue
    }

    const price = getPrice(
      forToken,
      trade.archiveToken0UsdPrice,
      trade.archiveToken1UsdPrice,
      trade.amount0,
      trade.amount1
    );

    if (normalizedTxTimestamp - updatingCandle.timestamp < timeSpacing) {
      if (price < updatingCandle.low) {
        updatingCandle.low = price;
      }
      if (price > updatingCandle.high) {
        updatingCandle.high = price;
      }

      updatingCandle.close = price;
    } else {
      candles.push({ ...updatingCandle })
      const diff = normalizedTxTimestamp - updatingCandle.timestamp;
      const amountOfEmptyCandles = Math.floor(diff / timeSpacing) - 1;

      if (amountOfEmptyCandles < 1000) {
        for (let i = 0; i < amountOfEmptyCandles; i++) {
          candles.push(new CandleModel({
            amountSwaps: 0,
            uuid: v4().toString(),
            open: updatingCandle.close,
            close: updatingCandle.close,
            high: updatingCandle.close,
            low: updatingCandle.close,
            timestamp: updatingCandle.timestamp + (i + 1) * timeSpacing,
          }));
        }
      }
      else {
        candles.length = 0
      }

      updatingCandle = {
        uuid: v4().toString(),
        open: updatingCandle.close,
        close: price,
        high: price,
        low: price,
        timestamp: normalizedTxTimestamp,
        amountSwaps: 1,
      };
    }
  }

  return updatingCandle
}
