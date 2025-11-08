import { V3PoolsApi, V3PoolWhere } from "@/src/shared/api/v3PoolsApi/v3PoolApi"
import { useAsyncEffect } from "@/src/utils/hooks/useAsyncEffect"
import { useState } from "react"
import V3PoolCard from "./V3PoolCard"

const V3PoolsList = () => {
  const [amount, setAmount] = useState(100)

  const queryWhere: V3PoolWhere = {
    isDusty: false
  }
  const { data, isLoading, error } = useAsyncEffect(() => V3PoolsApi.getPools(amount, 0, queryWhere), [amount, queryWhere])
  console.log(data)
  console.log(data?.pools)
  return (
    <div>
      <h1 className="text-center text-3xl">V3Pools</h1>
      <div>{data?.pools?.map(pool => (
        <V3PoolCard key={pool.address} pool={pool} />
      ))}</div>
    </div>)
}

export default V3PoolsList
