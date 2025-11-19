import client from "@/app/api/onClient/graphql/apolloClient"
import { V3PoolModel } from "@/src/entities/exchanges/v3pool"
import GET_V3_POOLS from "./v3poolsquery.gql"

export class V3PoolWhere {
  id?: number;
  chainId?: number;
  address?: string;
  token0Address?: string;
  token1Address?: string;
  isDusty?: boolean;
  liquidity?: string;
  tick?: number;
  tick_gt?: number;
  token0Symbol?: string;
  token1Symbol?: string;
}




export const V3PoolsApi = {
  async getPools(
    amount: number = 100,
    skip: number = 0,
    where?: V3PoolWhere,
  ): Promise<{ pools: V3PoolModel[], error: string | null }> {

    const resp = await client.query<GetPoolRespType>({
      query: GET_V3_POOLS,
      variables: {
        where: where,
        first: amount,
        skip: skip
      }
    })

    if (resp.error || resp.data === undefined) {
      return {
        pools: [],
        error: "unable to fetch data"
      }
    }

    return {
      pools: resp.data.v3pools,
      error: null
    }
  },

  async getPoolByAddress(
    address: string,
    chainId: number
  ): Promise<{ pool: V3PoolModel | null, error: string | null }> {

    const where: V3PoolWhere = {
      address,
      chainId,
    }

    const resp = await client.query<GetPoolRespType>({
      query: GET_V3_POOLS,
      variables: {
        where: where,
        first: 1,
        skip: 0
      }
    })

    if (resp.error || resp.data === undefined) {
      return {
        pool: null,
        error: "unable to fetch data"
      }
    }

    if (resp.data.v3pools.length == 0) {
      return {
        pool: null,
        error: "pool not found"
      }
    }

    return {
      pool: resp.data.v3pools[0],
      error: null
    }
  }

}
