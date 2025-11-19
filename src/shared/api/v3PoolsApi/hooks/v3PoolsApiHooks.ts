import { V3PoolData, V3PoolModel } from "@/src/entities/exchanges/v3pool"
import { V3PoolWhere } from "../v3PoolApi"
import { useQuery } from "@apollo/client/react"
import GET_POOLS from "../gql/v3PoolsQuery.gql"
import { TokenModel } from "@/src/entities/exchanges/token"

type UseV3PoolsQueryProps = {
  where?: V3PoolWhere,
  pollInterval?: number
}

type V3PoolsQueryData = {
  v3pools: V3PoolData[]
}

export const useGetV3PoolsQuery = ({ where, pollInterval }: UseV3PoolsQueryProps): {
  pools: V3PoolModel[]
  isLoading: boolean
  error: string
} => {
  const { data, error, loading } = useQuery<V3PoolsQueryData>(GET_POOLS, {
    variables: { first: 1000, skip: 0, where: where },
    pollInterval: pollInterval
  });


  if (!data?.v3pools) {
    return {
      pools: [],
      isLoading: loading,
      error: error?.message ?? "",
    }
  }

  const resultPools: V3PoolModel[] = []

  try {
    for (const rawPool of data?.v3pools) {
      let token0: TokenModel | undefined
      if (rawPool.token0) {
        token0 = new TokenModel(rawPool.token0, { useDefaultValues: true })
      }
      let token1: TokenModel | undefined
      if (rawPool.token1) {
        token1 = new TokenModel(rawPool.token1, { useDefaultValues: true })
      }

      const v3PoolModel = new V3PoolModel(rawPool, token0, token1)
      resultPools.push(v3PoolModel)
    }

  } catch (e) {
    console.log("e", e)
    return {
      pools: [],
      isLoading: loading,
      error: "unable to contruct v3poolModel from v3poolData",
    }
  }

  return {
    pools: resultPools,
    isLoading: loading,
    error: error?.message ?? ""
  }

}

type UseV3PoolQueryProps = {
  chainID: number,
  address: string,
  pollInterval?: number
}

export const useGetV3PoolQuery = ({ address, chainID, pollInterval }: UseV3PoolQueryProps): {
  pool: V3PoolModel | null
  isLoading: boolean
  error: string
} => {
  const where: V3PoolWhere = {
    address,
    chainId: chainID,
  }

  const { data, error, loading } = useQuery<V3PoolsQueryData>(GET_POOLS, {
    variables: { first: 1, skip: 0, where: where },
    pollInterval: pollInterval
  });


  if (!data?.v3pools || data.v3pools.length === 0) {
    return {
      pool: null,
      isLoading: loading,
      error: error?.message ?? "",
    }
  }


  try {
    const firstPool = data.v3pools[0]
    let token0: TokenModel | undefined
    if (firstPool.token0) {
      token0 = new TokenModel(firstPool.token0, { useDefaultValues: true })
    }
    let token1: TokenModel | undefined
    if (firstPool.token1) {
      token1 = new TokenModel(firstPool.token1, { useDefaultValues: true })
    }

    const v3PoolModel = new V3PoolModel(firstPool, token0, token1)

    return {
      pool: v3PoolModel,
      isLoading: loading,
      error: error?.message ?? ""
    }
  } catch {
    return {
      pool: null,
      isLoading: loading,
      error: "unable to contruct v3poolModel from v3poolData",
    }

  }

}

