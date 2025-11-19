import { useOnChainArbitragesQuery } from "@/src/shared/api/arbitrageApi/hooks/useGetOnChainArbitrages"
import ArbitrageList from "./ArbitrageList"

type OnChainArbitrageListProps = {
  chainID: number
}

const OnChainArbitrageList = ({ chainID }: OnChainArbitrageListProps) => {
  const { arbitrages, isLoading, error } = useOnChainArbitragesQuery({ chainID })
  console.log(arbitrages)
  return (
    <>
      {error && <div>{error}</div>}
      {isLoading ?
        <div className="text-center text-xl">Loading...</div> :
        <>
          {arbitrages &&
            <ArbitrageList chainID={chainID} arbitrages={arbitrages} />
          }
        </>
      }
    </>
  )

}

export default OnChainArbitrageList
