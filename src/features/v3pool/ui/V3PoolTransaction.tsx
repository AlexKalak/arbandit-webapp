import { TokenModel } from "@/src/entities/exchanges/token"
import { V3TransactionModel } from "@/src/entities/exchanges/v3Transaction"
import { getDateTimeFromDate } from "@/src/shared/helpers/time"

const V3PoolTransaction = (
  {
    transaction,
    token0,
    token1
  }: {
    transaction: V3TransactionModel,
    token0: TokenModel,
    token1: TokenModel
  }
) => {
  const zfo = (transaction?.amount0 ?? 0) < 0
  if (!(token0.usdPrice && token1.usdPrice && transaction.amount0 && transaction.amount1 && token0.decimals && token1.decimals)) {
    return <>Invalid token data</>
  }

  const token0RealAmount = transaction.amount0 / Math.pow(10, token0.decimals)
  const token1RealAmount = transaction.amount1 / Math.pow(10, token1.decimals)

  const transactionTime = new Date()
  if (transaction.txTimestamp) {
    transactionTime.setTime(transaction.txTimestamp * 1000)
  }

  const transactionString = transaction.txTimestamp ? getDateTimeFromDate(transactionTime) : "no timestamp"

  return <div className="grid grid-cols-6 text-right px-20">
    <h1>{transaction.blockNumber}</h1>
    <h1>{transactionString}</h1>
    <h1>
      {
        zfo ?
          `${token0.symbol}>>>${token1.symbol}` :
          `${token1.symbol}>>>${token0.symbol}`
      }
    </h1>
    {
      <h1>{
        zfo ?
          token1.usdPrice * Math.abs(token1RealAmount / token0RealAmount) :
          token0.usdPrice * Math.abs(token0RealAmount / token1RealAmount)
      }</h1>
    }
    <h1>{token0RealAmount * token0.usdPrice}</h1>
    <h1>{token1RealAmount * token1.usdPrice}</h1>
  </div>

}

export default V3PoolTransaction
