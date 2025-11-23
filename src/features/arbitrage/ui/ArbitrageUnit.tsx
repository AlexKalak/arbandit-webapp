import { ArbitragePathUnitModel } from "@/src/entities/exchanges/arbitrage"
import { useGetTokenByAddressAndChainID } from "@/src/shared/api/tokensApi/hooks/tokenHooks"
import { useGetV3PoolQuery } from "@/src/shared/api/v3PoolsApi/hooks/v3PoolsApiHooks"
import { formatPrice } from "@/src/shared/helpers/numbers"
import Link from "next/link"

type ArbitrageUnitProps = {
  chainID: number
  unit: ArbitragePathUnitModel
}

const ArbitrageUnit = ({ chainID, unit }: ArbitrageUnitProps) => {
  const { pool, isLoading, error } = useGetV3PoolQuery({ address: unit.poolAddress, chainID })
  const { token: tokenIn, isLoading: tokenInIsLoading, error: tokenInError } = useGetTokenByAddressAndChainID(unit.tokenInAdress, chainID)
  const { token: tokenOut, isLoading: tokenOutIsLoading, error: tokenOutError } = useGetTokenByAddressAndChainID(unit.tokenOutAddress, chainID)

  if (!pool || !tokenIn || !tokenOut) return <div>...</div>

  const tokenInDecimalsPower = Math.pow(10, tokenIn.decimals)
  const tokenOutDecimalsPower = Math.pow(10, tokenOut.decimals)

  const zfo = pool.token0Address === unit.tokenInAdress
  const token0 = zfo ? tokenIn : tokenOut
  const token1 = zfo ? tokenOut : tokenIn

  const tokenInPrice = zfo ?
    pool.zfo_10usdRate * token1.usdPrice :
    pool.nonZfo_10usdRate * token0.usdPrice
  const tokenOutPrice = zfo ?
    pool.nonZfo_10usdRate * token0.usdPrice :
    pool.zfo_10usdRate * token1.usdPrice

  return <div>
    <div className=" flex flex-col">
      <Link
        className="text-sm m-0 underline"
        href={`https://dextools.io/app/en/ether/pair-explorer/${pool.address}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        DexTools.io
      </Link>
      <Link style={{ maxWidth: 200 }} className="text-sm overflow-hidden border border-sm rounded-sm border-white px-2 py-1" href={`/pools/${pool.address}`}>
        {pool.address}
      </Link>
    </div>
    <div className="flex flex-col text-base">
      <span>{tokenIn.symbol} ({formatPrice(tokenInPrice)})$</span>
      <span>{unit.amountIn / tokenInDecimalsPower}</span>
    </div>
    <div className="flex flex-col text-base">
      {tokenOut.symbol} ({formatPrice(tokenOutPrice)})$
      <span>{unit.amountOut / tokenOutDecimalsPower}</span>
    </div>
  </div>
}

export default ArbitrageUnit
