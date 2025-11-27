import { useQuery } from "@apollo/client/react"
import GET_PAIRS from "../gql/v2PairsQuery.gql"
import { TokenModel } from "@/src/entities/exchanges/token"
import { V2PairData, V2PairModel, V2PairWhere } from "@/src/entities/exchanges/v2pair"

type UseV2PairsQueryProps = {
  where?: V2PairWhere,
  pollInterval?: number
}

type V2PairsQueryData = {
  v2pairs: V2PairData[]
}

export const useGetV2PairsQuery = ({ where, pollInterval }: UseV2PairsQueryProps): {
  pairs: V2PairModel[]
  isLoading: boolean
  error: string
} => {

  const { data, error, loading } = useQuery<V2PairsQueryData>(GET_PAIRS, {
    variables: { first: 1000, skip: 0, where: where },
    pollInterval: pollInterval
  });


  if (!data?.v2pairs) {
    return {
      pairs: [],
      isLoading: loading,
      error: error?.message ?? "",
    }
  }

  const resultPairs: V2PairModel[] = []

  try {
    for (const rawPairs of data?.v2pairs) {
      let token0: TokenModel | undefined
      if (rawPairs.token0) {
        token0 = new TokenModel(rawPairs.token0, { useDefaultValues: true })
      }
      let token1: TokenModel | undefined
      if (rawPairs.token1) {
        token1 = new TokenModel(rawPairs.token1, { useDefaultValues: true })
      }

      const v2PairModel = new V2PairModel(rawPairs, token0, token1)
      resultPairs.push(v2PairModel)
    }

  } catch (e) {
    console.log("e", e)
    return {
      pairs: [],
      isLoading: loading,
      error: "unable to construct V2PairModel from v2PairData",
    }
  }

  return {
    pairs: resultPairs,
    isLoading: loading,
    error: error?.message ?? ""
  }

}

type UseV2PairQueryProps = {
  chainID: number,
  address: string,
  pollInterval?: number
}

export const useGetV2PairQuery = ({ address, chainID, pollInterval }: UseV2PairQueryProps): {
  pair: V2PairModel | null
  isLoading: boolean
  error: string
} => {
  const where: V2PairWhere = {
    address,
    chainId: chainID,
  }

  const { data, error, loading } = useQuery<V2PairsQueryData>(GET_PAIRS, {
    variables: { first: 1, skip: 0, where: where },
    pollInterval: pollInterval
  });


  if (!data?.v2pairs || data.v2pairs.length === 0) {
    return {
      pair: null,
      isLoading: loading,
      error: error?.message ?? "",
    }
  }


  try {
    const firstPair = data.v2pairs[0]
    let token0: TokenModel | undefined
    if (firstPair.token0) {
      token0 = new TokenModel(firstPair.token0, { useDefaultValues: true })
    }
    let token1: TokenModel | undefined
    if (firstPair.token1) {
      token1 = new TokenModel(firstPair.token1, { useDefaultValues: true })
    }

    const v2PairModel = new V2PairModel(firstPair, token0, token1)

    return {
      pair: v2PairModel,
      isLoading: loading,
      error: error?.message ?? ""
    }
  } catch {
    return {
      pair: null,
      isLoading: loading,
      error: "unable to contruct v2PairModel from v2PairData",
    }

  }
}

