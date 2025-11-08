import { V3PoolsApi } from "@/src/shared/api/v3PoolsApi/v3PoolApi"
import { useAsyncEffect } from "@/src/utils/hooks/useAsyncEffect"
import V3PoolInfo from "./V3PoolInfo"
import V3PoolTransactionList from "./V3PoolTransactionList"

const V3PoolPage = ({ address, chainId }: { address: string, chainId: number }) => {
  const { data, isLoading, error } = useAsyncEffect(
    () => V3PoolsApi.getPoolByAddress(
      address,
      chainId
    ),
    [address, chainId]
  )

  const pool = data?.pool

  if (!pool?.chainId || !pool.token0Address || !pool.token1Address) {
    return <></>
  }

  return (
    <div>
      {data?.pool &&
        <div>
          <V3PoolInfo pool={data.pool} />
          <V3PoolTransactionList
            poolAddress={pool.address}
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
