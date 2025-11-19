import V3PoolCard from "./V3PoolCard"
import { useGetV3PoolsQuery } from "@/src/shared/api/v3PoolsApi/hooks/v3PoolsApiHooks"
import { V3PoolWhere } from "@/src/shared/api/v3PoolsApi/v3PoolApi"

const V3PoolsList = () => {
  const queryWhere: V3PoolWhere = {
    isDusty: false
  }
  const { pools, isLoading, error } = useGetV3PoolsQuery({ where: queryWhere, pollInterval: 10000 })
  return (
    <div>
      <h1 className="text-center text-3xl">V3Pools</h1>
      <div className="flex flex-col gap-2 px-5">{pools?.map(pool => (
        <V3PoolCard key={pool.address} pool={pool} />
      ))}</div>
    </div>)
}

export default V3PoolsList
