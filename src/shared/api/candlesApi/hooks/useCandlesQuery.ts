import { CandleData, CandleModel } from "@/src/entities/exchanges/candle"
import { useQuery } from "@apollo/client/react"
import GET_CANDLES_FOR_POOL_QUERY from "../gql/candlesForPoolQuery.gql"
import GET_CANDLES_FOR_PAIR_QUERY from "../gql/candlesForPairQuery.gql"

type CandlesQueryData = {
  candlesForPool: CandleData[],
  candlesForPair: CandleData[],
}

export enum CandlesQueryType {
  V3Pool,
  V2Pool
}

const convertCandlesQueryTypeToQuery = (type: CandlesQueryType) => {
  switch (type) {
    case CandlesQueryType.V3Pool:
      return GET_CANDLES_FOR_POOL_QUERY
    case CandlesQueryType.V2Pool:
      return GET_CANDLES_FOR_PAIR_QUERY
    default:
      throw new Error("Invalid candles query type")
  }
}

type UseCandleQueryProps = {
  type: CandlesQueryType,
  address: string,
  chainId: number,
  pollInterval?: number,
  chartForToken: number,
  timeSpacing: number
}

export const useGetCandlesQuery = ({ type, address, chainId, chartForToken, timeSpacing, pollInterval }: UseCandleQueryProps): {
  candles: CandleModel[],
  isLoading: boolean,
  error: string | null
} => {

  const query = convertCandlesQueryTypeToQuery(type)
  const addressVariableName = type === CandlesQueryType.V3Pool ? "poolAddress" : "pairAddress"
  const responseDataField = type === CandlesQueryType.V3Pool ? "candlesForPool" : "candlesForPair"

  const { data, loading, error } = useQuery<CandlesQueryData>(query, {
    variables: {
      [addressVariableName]: address,
      chainId,
      chartForToken,
      timeSpacing,
    },
    pollInterval,
  })

  const candles: CandleModel[] = []
  const responseCandles = data?.[responseDataField]
  if (responseCandles) {
    for (const candleData of responseCandles) {
      const candle = new CandleModel(candleData)
      candles.push(candle)
    }
  }

  return {
    candles: candles,
    isLoading: loading,
    error: error ? error.message : null
  }
}

