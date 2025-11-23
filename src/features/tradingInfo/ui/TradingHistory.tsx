import { useV3SwapSubscription } from "@/src/shared/api/v3SwapsApi/hooks/v3SwapsSubscribeHook"
import V3PoolSwap from "./V3PoolSwap"
import { useGetTokenByAddressAndChainID } from "@/src/shared/api/tokensApi/hooks/tokenHooks"
import { generateMd5Hash } from "@/src/shared/helpers/hash"
import V3PoolSwapsChart from "./V3PoolSwapsChart"
import { useMemo, useState } from "react"
import { getRealAmountOfToken, TokenModel } from "@/src/entities/exchanges/token"
import { useGetCandlesQuery } from "@/src/shared/api/candlesApi/hooks/useCandlesQuery"
import { CandleModel } from "@/src/entities/exchanges/candle"
import { v4 } from "uuid"
import { handleCopyClick } from "@/src/shared/helpers/clipboard"
import Link from "next/link"
import V3PoolSwapGridHeader from "./V3PoolSwapGridHeader"
import { V3PoolModel } from "@/src/entities/exchanges/v3pool"
import { formatPrice } from "@/src/shared/helpers/numbers"
import { TradeModel } from "@/src/entities/trades/trade"

type Props = {
  trades: TradeModel,
  token0: TokenModel,
  token1: TokenModel,
}

// const getPrice = (chartForToken: number, token0) => {
//   const tokenPrice = chartForToken == 0 ?
//     token1UsdPrice * Math.abs(amount1Real / amount0Real) :
//     token0UsdPrice * Math.abs(amount0Real / amount1Real)
//
//   return tokenPrice
//
// }
//

const V3PoolSwapsList = ({ trades, token0, token1 }: Props) => {
  const { swaps, isLoading, error } = useV3SwapSubscription(pool.address, chainId)

  const [isChartForToken0, setIsChartForToken0] = useState<boolean>(true)
  const chartForToken = isChartForToken0 ? 0 : 1
  const timeSpacing = 60

  const { candles: candlesQueired } = useGetCandlesQuery({ poolAddress: pool.address, chainId, chartForToken, timeSpacing })

  const reversedSwaps = useMemo(() => {
    if (!swaps) return [];
    const reversedSwaps = swaps.slice()
    reversedSwaps.reverse()
    return reversedSwaps
  }, [swaps])

  const { candles, updatingCandle } = useMemo<
    { candles: CandleModel[], updatingCandle: CandleModel | null }
  >(() => {
    if (!candlesQueired) {
      return { candles: [], updatingCandle: null }
    }

    const candles = [...candlesQueired]
    if (candles.length == 0) {
      return { candles: [], updatingCandle: null }
    }
    let updatingCandle: CandleModel = candles.pop()!

    if (!updatingCandle) {
      return { candles: [], updatingCandle: null }
    }

    if (!token0 || !token1) {
      return { candles, updatingCandle }
    }

    for (const swap of swaps) {
      const normalizedTxTimestamp =
        swap.txTimestamp - (swap.txTimestamp % timeSpacing);

      if (normalizedTxTimestamp < updatingCandle.timestamp) {
        continue
      }

      const realAmount0 = getRealAmountOfToken(token0, swap.amount0);
      const realAmount1 = getRealAmountOfToken(token1, swap.amount1);

      const price = getPrice(
        chartForToken,
        swap.archiveToken0UsdPrice,
        swap.archiveToken1UsdPrice,
        realAmount0,
        realAmount1,
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
    // console.log("candles:", candles)
    // const leftIndex = Math.max(candles.length - 100, 0)
    return { candles: candles, updatingCandle }
  }, [candlesQueired, swaps, token0, token1, chartForToken])

  if (!swaps || !token0 || !token1) {
    return <></>
  }


  return (
    <div>
      <h1 className="flex gap-5 justify-center items-center my-5">
        <Link
          href={`https://dextools.io/app/en/ether/pair-explorer/${pool.address}`}
          className="underline text-3xl"
          target="_blank"
          rel="noopener noreferrer"
        >
          DexTools.io
        </Link>
        <Link
          href={`https://etherscan.io/address/${pool.address}`}
          className="underline text-3xl"
          target="_blank"
          rel="noopener noreferrer"
        >
          Etherscan.io
        </Link>
      </h1>

      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center justify-center w-fit">
          <div className="flex gap-5 items-left justify-center mb-4">
            <div>
              <span
                className="border border rounded-xl py px-2 cursor-pointer"
                onClick={() => handleCopyClick(token0.address)}
              >
                {token0.address}
              </span>

              <div className="grid grid-cols-2 text-left text-2xl">
                <span>{token0.symbol}</span>
                <span>({formatPrice(pool.zfo_10usdRate * token1.usdPrice)}$)</span>
                <span>Avg.</span>
                <span>({formatPrice(token0.usdPrice)}$)</span>
              </div>
            </div>
            <div>
              <span
                className="border border rounded-xl py px-2 cursor-pointer"
                onClick={() => handleCopyClick(token1.address)}
              >
                {token1.address}
              </span>

              <div className="grid grid-cols-2 text-left text-2xl">
                <span>{token1.symbol}</span>
                <span>({formatPrice(pool.nonZfo_10usdRate * token0.usdPrice)}$)</span>
                <span>Avg.</span>
                <span>({formatPrice(token1.usdPrice)}$)</span>
              </div>
            </div>
          </div>

          <button className="w-full border border-xl rounded-xl text-center text-2xl px-5 py-1 cursor-pointer" onClick={() => setIsChartForToken0((prev) => !prev)}>
            For {" "}
            {chartForToken === 0 ? token0?.symbol : token1.symbol}
          </button>
        </div>


      </div>
      {/* {isLoading && <div className="text-center">Loading...</div>} */}


      <V3PoolSwapsChart
        chartForToken={chartForToken}
        updatingCandle={updatingCandle}
        candles={candles}
      />

      <div className="flex flex-col">
        <V3PoolSwapGridHeader />
        {
          reversedSwaps.map(
            swap =>
              <V3PoolSwap
                key={generateMd5Hash(swap)}
                forToken={chartForToken}
                token0={token0}
                token1={token1}
                swap={swap}
              />)
        }
      </div>
    </div >
  )

}

export default V3PoolSwapsList

