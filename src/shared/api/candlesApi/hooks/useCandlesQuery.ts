import { CandleData, CandleModel } from "@/src/entities/exchanges/candle"
import { useQuery } from "@apollo/client/react"
import GET_CANDLES_QUERY from "../gql/candlesQuery.gql"

type CandlesQueryData = {
  candles: CandleData[],
}

type UseCandleQueryProps = {
  poolAddress: string,
  chainId: number,
  pollInterval?: number,
  chartForToken: number,
  timeSpacing: number
}

export const useGetCandlesQuery = ({ poolAddress, chainId, chartForToken, timeSpacing, pollInterval }: UseCandleQueryProps): {
  candles: CandleModel[],
  isLoading: boolean,
  error: string | null
} => {

  const { data, loading, error } = useQuery<CandlesQueryData>(GET_CANDLES_QUERY, {
    variables: {
      poolAddress,
      chainId,
      chartForToken,
      timeSpacing,
    },
    pollInterval,
  })



  const candles: CandleModel[] = []
  if (data?.candles) {
    for (const candleData of data.candles) {
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

