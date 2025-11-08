import { V3PoolModel } from "@/src/entities/exchanges/v3pool"

const V3PoolInfo = (
  { pool }:
    { pool: V3PoolModel }
) => {
  return (
    <div className="grid grid-cols-2 text-center">
      <div className="border border-sm col-span-2">
        {pool.token0?.symbol}/{pool.token1?.symbol}
      </div>

      <div className="border border-sm flex flex-col gap-2, items-center">
        <span>10USD {pool.token0?.symbol} {'->'} {pool.token1?.symbol}</span>
        <span>{pool.zfo_10usdRate}</span>
      </div>
      <div className="border border-sm flex flex-col gap-2, items-center">
        <span>10USD {pool.token1?.symbol} {'->'} {pool.token0?.symbol}</span>
        <span>{pool.nonZfo_10usdRate}</span>
      </div>

      <div className="border border-sm flex flex-col gap-2, items-center">
        <span>Liquidity</span>
        <span>{pool.liquidity}</span>
      </div>
    </div>
  )
}

export default V3PoolInfo
