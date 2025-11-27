import { TokenModel } from "@/src/entities/exchanges/token"
import { TradeModel } from "@/src/entities/trades/trade"

import { getDateTimeFromDate } from "@/src/shared/helpers/time"

const TradeRecord = (
  {
    forToken,
    trade,
    token0,
    token1
  }: {
    forToken: number,
    trade: TradeModel,
    token0: TokenModel,
    token1: TokenModel
  }
) => {
  const zfo = (trade?.amount0 ?? 0) > 0
  let action
  if (forToken === 0) {
    if (zfo) {
      action = "sell"
    } else {
      action = "buy"
    }
  } else {
    if (zfo) {
      action = "buy"
    } else {
      action = "sell"
    }
  }

  if (!(token0.usdPrice && token1.usdPrice && trade.amount0 && trade.amount1 && token0.decimals && token1.decimals)) {
    return <>Invalid token data</>
  }

  const token0RealAmount = trade.amount0 / Math.pow(10, token0.decimals)
  const token1RealAmount = trade.amount1 / Math.pow(10, token1.decimals)

  const tradeTime = new Date()
  if (trade.timestamp) {
    tradeTime.setTime(trade.timestamp * 1000)
  }

  const swapTimeString = trade.timestamp ? getDateTimeFromDate(tradeTime) : "no timestamp"

  return <div className="grid grid-cols-6 text-center px-20">
    <h1>{swapTimeString}</h1>
    <h1>
      {
        action
      }
    </h1>
    <h1 className="text-right">
      {(Math.abs(token0RealAmount) * token0.usdPrice).toFixed(2)}$
    </h1>
    <h1 className="text-right">
      {
        forToken === 0 ?
          token1.usdPrice * Math.abs(token1RealAmount / token0RealAmount) :
          token0.usdPrice * Math.abs(token0RealAmount / token1RealAmount)
      }
    </h1>
  </div>

}

export default TradeRecord
