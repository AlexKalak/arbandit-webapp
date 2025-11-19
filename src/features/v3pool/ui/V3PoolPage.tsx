import V3PoolInfo from "./V3PoolInfo"
import V3PoolSwapsList from "./V3PoolSwapList"
import { useGetV3PoolQuery } from "@/src/shared/api/v3PoolsApi/hooks/v3PoolsApiHooks"

const V3PoolPage = ({ address, chainID }: { address: string, chainID: number }) => {
  const { pool, isLoading, error } = useGetV3PoolQuery(
    {
      address,
      chainID: chainID,
    }
  )


  if (!pool?.chainId || !pool.token0Address || !pool.token1Address) {
    return <></>
  }

  return (
    <div>
      {pool &&
        <div>
          <V3PoolInfo pool={pool} />
          <V3PoolSwapsList
            pool={pool}
            chainId={pool.chainId}
            token0Address={pool.token0Address}
            token1Address={pool.token1Address}
          />
        </div>
      }
    </div>
  )
}

export default V3PoolPage
