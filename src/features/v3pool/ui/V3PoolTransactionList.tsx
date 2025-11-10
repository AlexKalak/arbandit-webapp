import { useV3TransactionSubscription } from "@/src/shared/api/v3TransactionsApi/hooks/v3TransactionsSubscribeHook"
import V3PoolTransaction from "./V3PoolTransaction"
import { useGetTokenByAddressAndChainID } from "@/src/shared/api/tokensApi/hooks/tokenHooks"
import { generateMd5Hash } from "@/src/shared/helpers/hash"
import V3PoolTransactionsChart from "./V3PoolTransactionsChart"
import { AreaData, CandlestickData, Time, UTCTimestamp } from "lightweight-charts"
import { V3TransactionModel } from "@/src/entities/exchanges/v3Transaction"
import { useMemo } from "react"
import { TokenModel } from "@/src/entities/exchanges/token"
import { useV3TransactionsQuery } from "@/src/shared/api/v3TransactionsApi/hooks/v3TransactionsQuery"
import { useGetCandlesQuery } from "@/src/shared/api/candlesApi/hooks/useCandlesQuery"

type Props = {
  poolAddress: string,
  chainId: number,
  token0Address: string,
  token1Address: string,
}

const getPrice = (chartForToken: number, token0UsdPrice: number, token1UsdPrice: number, amount0Real: number, amount1Real: number) => {
  const tokenPrice = chartForToken == 0 ?
    token1UsdPrice * Math.abs(amount1Real / amount0Real) :
    token0UsdPrice * Math.abs(amount0Real / amount1Real)

  return tokenPrice

}

const V3PoolTransactionList = ({ poolAddress, chainId, token0Address, token1Address }: Props) => {
  const { transactions, isLoading, error } = useV3TransactionSubscription(poolAddress, chainId)

  const { token: token0 } = useGetTokenByAddressAndChainID(token0Address, chainId, 10000)
  const { token: token1 } = useGetTokenByAddressAndChainID(token1Address, chainId, 10000)

  const chartForToken = 1

  const { candles } = useGetCandlesQuery({ poolAddress, chainId, chartForToken, timeSpacing: 60, pollInterval: 5000 })

  const chartData = useMemo(() => {
    const chartData: CandlestickData[] = []
    for (const candle of candles) {
      console.log(typeof candle.open)
      chartData.push({
        time: candle.timestamp as UTCTimestamp,
        open: candle.open,
        close: candle.close,
        low: candle.low,
        high: candle.high
      })
    }

    return chartData

  }, [candles])

  if (!transactions || !token0 || !token1) {
    return <></>
  }


  return (
    <div>
      <h1 className="text-center text-3xl">V3Transactions</h1>
      <h1 className="text-center text-2xl">{
        `${token0.symbol} (${Number(token0.usdPrice)?.toFixed(2)}$) / ${token1.symbol} (${Number(token1.usdPrice)?.toFixed(6)}$)`
      }</h1>
      {/* {isLoading && <div className="text-center">Loading...</div>} */}

      <V3PoolTransactionsChart
        data={chartData}
      />

      {transactions.map(
        transaction =>
          <V3PoolTransaction
            key={generateMd5Hash(transaction)}
            token0={token0}
            token1={token1}
            transaction={transaction}
          />)
      }
    </div>
  )

}

export default V3PoolTransactionList
