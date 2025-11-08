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

  const chartForToken = 0

  const chartData = useMemo(() => {
    if (!token1 || !token0) {
      return []
    }

    const transactionsMap: Map<number, V3TransactionModel[]> = new Map()

    for (const transaction of transactions) {
      if (!transaction.blockNumber) {
        continue
      }

      let array = transactionsMap.get(transaction.blockNumber)
      if (array) {
        array.push(transaction)
      } else {
        array = [transaction]
      }

      transactionsMap.set(transaction.blockNumber, array)
    }

    const transactionSortedKeys = transactionsMap.keys().toArray()
    transactionSortedKeys.sort()

    const resultData: CandlestickData<Time>[] = []

    let i = 0
    let low = +Infinity
    let high = -Infinity
    let open = 0
    let close = 0
    let alreadySetOpen = false
    for (const key of transactionSortedKeys) {
      i++

      const transactions = transactionsMap.get(key)
      if (!transactions) {
        continue
      }
      if (transactions.length == 0) {
        continue
      }

      for (const transaction of transactions) {
        if (!transaction.amount0 || !transaction.amount1 || !token1.usdPrice || !token0.usdPrice || !token0.decimals || !token1.decimals) {
          continue
        }
        const amount0Real = transaction.amount0 / Math.pow(10, token0.decimals)
        const amount1Real = transaction.amount1 / Math.pow(10, token1.decimals)
        const tokenPrice = getPrice(chartForToken, token0.usdPrice, token1.usdPrice, amount0Real, amount1Real)
        if (!alreadySetOpen) {
          open = tokenPrice
          alreadySetOpen = true
        }

        close = tokenPrice

        if (tokenPrice < low) {
          low = tokenPrice
        }
        if (tokenPrice > high) {
          high = tokenPrice
        }
      }

      if (i % 10 === 0 && open && close && low && high) {
        resultData.push({
          time: (new Date().getTime() + i) as UTCTimestamp,
          open,
          close,
          low,
          high
        })
        alreadySetOpen = false
        low = +Infinity
        high = -Infinity
        open = 0
        close = 0
      }

    }

    return resultData

  }, [transactions, token0, token1])

  if (!transactions || !token0 || !token1) {
    return <></>
  }


  return (
    <div>
      <h1 className="text-center text-3xl">V3Transactions</h1>
      <h1 className="text-center text-2xl">{
        `${token0.symbol} (${Number(token0.usdPrice)?.toFixed(2)}$) / ${token1.symbol} (${Number(token1.usdPrice)?.toFixed(6)}$)`
      }</h1>
      {isLoading && <div className="text-center">Loading...</div>}
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
