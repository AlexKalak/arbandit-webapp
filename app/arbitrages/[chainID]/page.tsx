'use client'
import OnChainArbitrageList from "@/src/features/arbitrage/ui/OnChainArbitrageList"
import { useParams } from "next/navigation"

const OnChainArbitragesPage = () => {
  const { chainID: chainIDStr } = useParams<{ chainID: string }>()
  const chainID = Number(chainIDStr)

  return (
    <h1 className="text-center text-3xl">
      Arbitrages for chain {chainID}
      {
        chainID ?
          <OnChainArbitrageList chainID={chainID} /> :
          <div>
            Invalid chain
          </div>
      }
    </h1>
  )
}

export default OnChainArbitragesPage
