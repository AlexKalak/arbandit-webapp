import { ArbitrageModel } from "@/src/entities/exchanges/arbitrage"
import Arbitrage from "./Arbitrage"

type ArbitrageListProps = {
  arbitrages: ArbitrageModel[]
  chainID: number,
}

const ArbitrageList = ({ arbitrages, chainID }: ArbitrageListProps) => {
  return (
    <div
      className="flex w-fit m-auto flex-col justify-center gap-10"
    >
      <div className="text-center">({arbitrages?.length ?? "undefiend"}) arbs</div>
      {
        arbitrages.map((arb, i) => (
          <Arbitrage key={i} arbitrage={arb} chainID={chainID} />
        ))
      }
    </div>
  )
}

export default ArbitrageList
