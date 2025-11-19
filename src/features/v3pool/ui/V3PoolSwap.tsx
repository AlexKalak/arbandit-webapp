import { TokenModel } from "@/src/entities/exchanges/token"
import { V3SwapModel } from "@/src/entities/exchanges/v3Swap"
import { getDateTimeFromDate } from "@/src/shared/helpers/time"

const V3PoolSwap = (
  {
    forToken,
    swap,
    token0,
    token1
  }: {
    forToken: number,
    swap: V3SwapModel,
    token0: TokenModel,
    token1: TokenModel
  }
) => {
  const zfo = (swap?.amount0 ?? 0) > 0
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

  if (!(token0.usdPrice && token1.usdPrice && swap.amount0 && swap.amount1 && token0.decimals && token1.decimals)) {
    return <>Invalid token data</>
  }

  const token0RealAmount = swap.amount0 / Math.pow(10, token0.decimals)
  const token1RealAmount = swap.amount1 / Math.pow(10, token1.decimals)

  const swapTime = new Date()
  if (swap.txTimestamp) {
    swapTime.setTime(swap.txTimestamp * 1000)
  }

  const swapTimeString = swap.txTimestamp ? getDateTimeFromDate(swapTime) : "no timestamp"

  return <div className="grid grid-cols-6 text-center px-20">
    <h1>{swap.blockNumber}</h1>
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

export default V3PoolSwap
