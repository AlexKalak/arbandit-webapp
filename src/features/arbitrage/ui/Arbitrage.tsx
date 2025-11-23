import { ArbitrageModel } from "@/src/entities/exchanges/arbitrage"
import ArbitrageUnit from "./ArbitrageUnit"

const Arbitrage = ({ arbitrage, chainID }: { arbitrage: ArbitrageModel, chainID: number }) => {

  if (!arbitrage?.path?.length || arbitrage.path.length < 2) {
    return <></>
  }
  const pathLen = arbitrage.path.length

  return (<div className="flex gap-2 w-fit items-center">
    {arbitrage.path?.map((arbUnit, i) => (
      <div
        key={i}
        className="flex items-center gap-3 "
      >
        <ArbitrageUnit
          chainID={chainID}
          unit={arbUnit}
        />
        {(arbitrage.path && i !== arbitrage.path?.length - 1) &&
          <div> {"----"} </div>
        }
      </div>
    ))}

    <div>{(100 - arbitrage.path[0].amountIn / arbitrage.path[pathLen - 1].amountOut * 100).toFixed(2)}%</div>

  </div>)

}

export default Arbitrage
