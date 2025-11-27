import { generateMd5Hash } from "@/src/shared/helpers/hash"
import { TokenModel } from "@/src/entities/exchanges/token"
import { TradeModel } from "@/src/entities/trades/trade"
import TradeRecord from "./TradeRecord"
import TradeHistoryGridHeader from "./TradeHistoryGridHeader"

type Props = {
  chartForToken: number,
  trades: TradeModel[],
  token0: TokenModel,
  token1: TokenModel,
}

const TradesHistory = ({ chartForToken, trades, token0, token1 }: Props) => {
  if (!trades || !token0 || !token1) {
    return <></>
  }


  return (
    <div>
      {/* {isLoading && <div className="text-center">Loading...</div>} */}
      <div className="flex flex-col">
        <TradeHistoryGridHeader />
        {
          trades.map(
            trade =>
              <TradeRecord
                key={generateMd5Hash(trade)}
                forToken={chartForToken}
                token0={token0}
                token1={token1}
                trade={trade}
              />)
        }
      </div>
    </div >
  )

}

export default TradesHistory

