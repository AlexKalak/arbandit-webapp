import { V3TransactionModel } from "@/src/entities/exchanges/v3Transaction";
import { useSubscription } from "@apollo/client/react";
import { useState } from "react";
import V3TRANSACTION_SUBSCRIPTION from "@/src/shared/api/v3TransactionsApi/v3TransactionsSubscription.gql"

type V3SubscriptionData = {
  transactionAdded: V3TransactionModel,
}

export const useV3TransactionSubscription = (poolAddress: string, chainId: number): {
  transactions: V3TransactionModel[],
  isLoading: boolean,
  error: string | null
} => {

  const [liveTransactions, setLiveTransactions] = useState<V3TransactionModel[]>([])

  const { loading } = useSubscription(V3TRANSACTION_SUBSCRIPTION, {
    variables: {
      poolAddress,
      chainId
    },
    onData({ data }) {
      if (data.error) {
        console.log(data.error)
        return
      }

      const parsedData = data.data as V3SubscriptionData
      setLiveTransactions((prev) => [...prev, parsedData.transactionAdded])
    }
  })

  return {
    transactions: liveTransactions,
    isLoading: loading,
    error: null
  }
}
