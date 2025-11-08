import { V3TransactionModel, V3TransactionWhere } from "@/src/entities/exchanges/v3Transaction";
import { useQuery, useSubscription } from "@apollo/client/react";
import V3TRANSACTIONS_QUERY from "@/src/shared/api/v3TransactionsApi/v3TransactionsQuery.gql"

type V3TransactionsQueryData = {
  v3transactions: V3TransactionModel[],
}

type UseV3TransactionsQueryProps = {
  fromHead?: boolean,
  first?: number,
  skip?: number,
  poolAddress: string,
  chainId: number,
  pollInterval?: number
}

export const useV3TransactionsQuery = ({ fromHead, first, skip, poolAddress, chainId, pollInterval }: UseV3TransactionsQueryProps): {
  transactions: V3TransactionModel[],
  isLoading: boolean,
  error: string | null
} => {

  const where: V3TransactionWhere = {
    poolAddress,
    chainId
  }
  const { data, loading, error } = useQuery<V3TransactionsQueryData>(V3TRANSACTIONS_QUERY, {
    variables: {
      fromHead,
      first,
      skip,
      where
    },
    pollInterval,
  })

  return {
    transactions: data?.v3transactions ?? [],
    isLoading: loading,
    error: error ? error.message : null
  }
}
