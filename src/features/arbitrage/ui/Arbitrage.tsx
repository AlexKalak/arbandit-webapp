import { ArbitrageModel } from "@/src/entities/exchanges/arbitrage"
import ArbitrageUnit from "./ArbitrageUnit"

const Arbitrage = ({ arbitrage, chainID }: { arbitrage: ArbitrageModel, chainID: number }) => {

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

  </div>)

}

export default Arbitrage
