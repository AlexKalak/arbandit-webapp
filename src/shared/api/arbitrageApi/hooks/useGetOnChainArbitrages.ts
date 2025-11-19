import { ArbitrageModel } from "@/src/entities/exchanges/arbitrage";
import { useQuery } from "@apollo/client/react";
import GET_ON_CHAIN_ARBS from "../gql/onChainArbitragesQuery.gql"

type OnChainArbitragesQueryData = {
  on_chain_arbitrages: ArbitrageModel[],

}

type UseGetOnChainArbitragesProps = {
  chainID: number,
  pollInterval?: number
}

export const useOnChainArbitragesQuery = ({ chainID, pollInterval }: UseGetOnChainArbitragesProps): {
  arbitrages: ArbitrageModel[] | null,
  isLoading: boolean,
  error: string | null
} => {
  const { data: rawData, error, loading } = useQuery<OnChainArbitragesQueryData>(GET_ON_CHAIN_ARBS, {
    variables: { chainId: chainID },
    pollInterval: pollInterval
  });


  if (!rawData?.on_chain_arbitrages) {
    return {
      arbitrages: [],
      isLoading: loading,
      error: error?.message ?? ""
    }
  }

  const result: ArbitrageModel[] = []
  try {
    for (const rawArb of rawData.on_chain_arbitrages) {
      const arb = new ArbitrageModel(rawArb)
      result.push(arb)
    }
  } catch {
    return {
      arbitrages: null,
      isLoading: loading,
      error: "unable to contruct arbitrageModel from tokenData",
    }
  }

  return {
    arbitrages: result,
    isLoading: loading,
    error: error?.message ?? ""
  }
}

