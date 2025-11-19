import { V3SwapData, V3SwapModel, V3SwapWhere } from "@/src/entities/exchanges/v3Swap";
import { useQuery } from "@apollo/client/react";
import V3SWAPS_QUERY from "@/src/shared/api/v3SwapsApi/gql/v3SwapsQuery.gql"

type V3SwapsQueryData = {
  v3swaps: V3SwapData[],
}

type UseV3SwapsQueryProps = {
  fromHead?: boolean,
  first?: number,
  skip?: number,
  poolAddress: string,
  chainId: number,
  pollInterval?: number
}

export const useV3SwapsQuery = ({ fromHead, first, skip, poolAddress, chainId, pollInterval }: UseV3SwapsQueryProps): {
  swaps: V3SwapModel[],
  isLoading: boolean,
  error: string | null
} => {

  const where: V3SwapWhere = {
    poolAddress,
    chainId
  }

  const { data, loading, error } = useQuery<V3SwapsQueryData>(V3SWAPS_QUERY, {
    variables: {
      fromHead,
      first,
      skip,
      where
    },
    pollInterval,
  })

  if (!data?.v3swaps) {
    return {
      swaps: [],
      isLoading: loading,
      error: error?.message ?? null,
    }
  }

  const swaps: V3SwapModel[] = []
  for (const swapData of data?.v3swaps) {
    try {
      const swapModel = new V3SwapModel(swapData)
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
