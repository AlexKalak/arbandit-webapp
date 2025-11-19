import { V3PoolModel } from "@/src/entities/exchanges/v3pool"
import Link from "next/link"

const V3PoolCard = ({
  pool
}: {
  pool: V3PoolModel
}) => {
  return (

    <Link href={`/pools/${pool.address}`}>
      <div className="border-solid border rounded-sm border-gray-600 px-10 py-2">
        <div>
          <span className="text-green-600">{pool.token0?.symbol}</span>/<span className="text-red-400">{pool.token1?.symbol}</span>
        </div>
        <div className="flex flex-col gap-1">
          {(pool.token0 && pool.token1) &&
            <div>
              <div>
                <span className="text-green-600">{pool.token0.symbol} {" "} {pool.zfo_10usdRate * pool.token1?.usdPrice}</span>
              </div>
              <div>
                <span className="text-red-400">{pool.token1.symbol} {" "}{pool.nonZfo_10usdRate * pool.token0?.usdPrice}</span>
              </div>
            </div>
          }
        </div>

      </div>
    </Link>
  )

}

export default V3PoolCard
