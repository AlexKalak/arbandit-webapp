import { useGetV3PoolQuery } from "@/src/shared/api/v3PoolsApi/hooks/v3PoolsApiHooks"
import V3PoolInfo from "./V3PoolInfo"
import V3PoolChart from "./V3PoolChart"
import { useGetTokenByAddressAndChainID } from "@/src/shared/api/tokensApi/hooks/tokenHooks"
import { useState } from "react"
import TradesHistory from "../tradeInterface/TradingHistory"

const V3PoolPage = ({ address, chainID }: { address: string, chainID: number }) => {
  const { pool, isLoading, error } = useGetV3PoolQuery(
    {
      address,
      chainID: chainID,
    }
  )

  const [forToken, setForToken] = useState<number>(0)

  const { token: token0 } = useGetTokenByAddressAndChainID(pool?.token0Address ?? "", pool?.chainId ?? 0, 10000)
  const { token: token1 } = useGetTokenByAddressAndChainID(pool?.token1Address ?? "", pool?.chainId ?? 0, 10000)

  if (!pool?.chainId || !pool.token0Address || !pool.token1Address || !token0 || !token1) {
    return <></>
  }

  return (
    <div>
      {pool &&
        <div>
          <V3PoolInfo
            pool={pool}
            token0={token0}
            token1={token1}
            forToken={forToken}
            setForToken={(value: number) => setForToken(value)}

          />
          <V3PoolChart
            pool={pool}
            token0={token0}
            token1={token1}
            chartForToken={forToken}
            timeSpacing={60}
          />
        </div>
      }
    </div>
  )
}

export default V3PoolPage
