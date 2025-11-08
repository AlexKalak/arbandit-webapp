import { V3PoolModel } from "@/src/entities/exchanges/v3pool"
import Link from "next/link"

const V3PoolCard = ({
  pool
}: {
  pool: V3PoolModel
}) => {

  return (
    <div>
      <Link href={`/pools/${pool.address}`}>{pool.token0?.symbol}/{pool.token1?.symbol}</Link>
    </div>
  )

}

export default V3PoolCard
