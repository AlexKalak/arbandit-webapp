import { useSubscription } from "@apollo/client/react";
import { useMemo, useState } from "react";
import V2SWAP_SUBSCRIPTION from "@/src/shared/api/v3SwapsApi/gql/v2SwapSubscription.gql"
import { useV2SwapsQuery } from "./v2SwapQuery";
import { V2SwapData, V2SwapModel } from "@/src/entities/exchanges/v2Swap";

type V2SubscriptionData = {
  swapAdded: V2SwapData,
}

export const useV2SwapSubscription = (pairAddress: string, chainId: number): {
  swaps: V2SwapModel[],
  isLoading: boolean,
  error: string | null
} => {

  //Order old -> new
  const [liveSwaps, setLiveSwaps] = useState<V2SwapModel[]>([])

  const { loading } = useSubscription(V2SWAP_SUBSCRIPTION, {
    variables: {
      pairAddress,
      chainId
    },
    onData({ data }) {
      if (data.error) {
        console.log(data.error)
        return
      }

      const subscriptionData = data?.data as V2SubscriptionData
      if (!subscriptionData) {
        return
      }

      let newSwap: V2SwapModel
      try {
        newSwap = new V2SwapModel(subscriptionData.swapAdded)
      } catch (e) {
        console.error("Unable to construct new swap in liveSwaps", e)
        return
      }

      setLiveSwaps((prev) => {
        let newLiveSwaps = [...prev, newSwap]

        const leftIndex = Math.max(newLiveSwaps.length - 100, 0)
        newLiveSwaps = newLiveSwaps.slice(leftIndex)

        return newLiveSwaps
      })
    }
  })

  //Order new -> old
  const { swaps: historySwaps, isLoading: historyIsLoading, error: histoyError } = useV2SwapsQuery({
    fromHead: true,
    first: 100,
    skip: 0,
    pairAddress,
    chainId,
    pollInterval: 100000
  })

  const newestSwaps = useMemo(() => {
    if (!historySwaps || historySwaps.length === 0) {
      return liveSwaps.slice()
    }
    if (liveSwaps?.length >= 100) {
      return liveSwaps.slice()
    }

    //Order old -> new
    const reversedHistory = historySwaps.slice()
    reversedHistory.reverse()

    if (!liveSwaps || liveSwaps.length === 0) {
      return reversedHistory
    }

    const lastHistorySwap = reversedHistory[historySwaps.length - 1]
    const firstLiveSwap = liveSwaps[0]

    if (firstLiveSwap.txTimestamp > lastHistorySwap.txTimestamp) {
      const results = [...reversedHistory, ...liveSwaps.slice()]
      const leftIndex = Math.max(results.length - 100, 0)

      return results.slice(leftIndex)
    }

    let firstNewLiveSwapIndex = -1
    for (let i = 0; i < liveSwaps.length; i++) {
      if (liveSwaps[i].txTimestamp > lastHistorySwap.txTimestamp) {
        firstNewLiveSwapIndex = i
        break
      }
    }

    if (firstNewLiveSwapIndex === -1) {
      return reversedHistory
    }

    const newLiveSwaps = liveSwaps.slice(firstNewLiveSwapIndex)

    const results = [...reversedHistory, ...newLiveSwaps.slice()]
    const leftIndex = Math.max(results.length - 100, 0)

    return results.slice(leftIndex)
  }, [historySwaps, liveSwaps])

  return {
    swaps: newestSwaps,
    isLoading: loading || historyIsLoading,
    error: histoyError || null
  }
}
