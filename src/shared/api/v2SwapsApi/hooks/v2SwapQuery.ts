import { useQuery } from "@apollo/client/react";
import V2SWAPS_QUERY from "@/src/shared/api/v3SwapsApi/gql/v2SwapsQuery.gql"
import { V2SwapData, V2SwapModel, V2SwapWhere } from "@/src/entities/exchanges/v2Swap";

type V2SwapsQueryData = {
  v2swaps: V2SwapData[],
}

type UseV2SwapsQueryProps = {
  fromHead?: boolean,
  first?: number,
  skip?: number,
  pairAddress: string,
  chainId: number,
  pollInterval?: number
}

export const useV2SwapsQuery = ({ fromHead, first, skip, pairAddress, chainId, pollInterval }: UseV2SwapsQueryProps): {
  swaps: V2SwapModel[],
  isLoading: boolean,
  error: string | null
} => {

  const where: V2SwapWhere = {
    pairAddress,
    chainId
  }

  const { data, loading, error } = useQuery<V2SwapsQueryData>(V2SWAPS_QUERY, {
    variables: {
      fromHead,
      first,
      skip,
      where
    },
    pollInterval,
  })

  if (!data?.v2swaps) {
    return {
      swaps: [],
      isLoading: loading,
      error: error?.message ?? null,
    }
  }

  const swaps: V2SwapModel[] = []
  for (const swapData of data?.v2swaps) {
    try {
      const swapModel = new V2SwapModel(swapData)
      swaps.push(swapModel)
    } catch {
      continue
    }
  }

  return {
    swaps: swaps,
    isLoading: loading,
    error: error?.message ?? null
  }
}
