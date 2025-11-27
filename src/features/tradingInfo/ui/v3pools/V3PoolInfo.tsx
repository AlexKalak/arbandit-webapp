import { TokenModel } from "@/src/entities/exchanges/token"
import { V3PoolModel } from "@/src/entities/exchanges/v3pool"
import { handleCopyClick } from "@/src/shared/helpers/clipboard"
import { formatPrice } from "@/src/shared/helpers/numbers"
import Link from "next/link"

type V3PoolInfoProps = {
  pool: V3PoolModel,
  token0: TokenModel,
  token1: TokenModel,
  forToken: number,
  setForToken: (value: number) => void
}

const V3PoolInfo = ({
  pool,
  token0,
  token1,
  forToken,
  setForToken,
}: V3PoolInfoProps) => {
  return (
    <>
      <h1 className="flex gap-5 justify-center items-center my-5">
        <Link
          href={`https://dextools.io/app/en/ether/pair-explorer/${pool.address}`}
          className="underline text-3xl"
          target="_blank"
          rel="noopener noreferrer"
        >
          DexTools.io
        </Link>
        <Link
          href={`https://etherscan.io/address/${pool.address}`}
          className="underline text-3xl"
          target="_blank"
          rel="noopener noreferrer"
        >
          Etherscan.io
        </Link>
      </h1>

      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center justify-center w-fit">
          <div className="flex gap-5 items-left justify-center mb-4">
            <div>
              <span
                className="border border rounded-xl py px-2 cursor-pointer"
                onClick={() => handleCopyClick(token0.address)}
              >
                {token0.address}
              </span>

              <div className="grid grid-cols-2 text-left text-2xl">
                <span>{token0.symbol}</span>
                <span>({formatPrice(pool.zfo_10usdRate * token1.usdPrice)}$)</span>
                <span>Avg.</span>
                <span>({formatPrice(token0.usdPrice)}$)</span>
              </div>
            </div>
            <div>
              <span
                className="border border rounded-xl py px-2 cursor-pointer"
                onClick={() => handleCopyClick(token1.address)}
              >
                {token1.address}
              </span>

              <div className="grid grid-cols-2 text-left text-2xl">
                <span>{token1.symbol}</span>
                <span>({formatPrice(pool.nonZfo_10usdRate * token0.usdPrice)}$)</span>
                <span>Avg.</span>
                <span>({formatPrice(token1.usdPrice)}$)</span>
              </div>
            </div>
          </div>

          <button
            className="w-full border border-xl rounded-xl text-center text-2xl px-5 py-1 cursor-pointer"
            onClick={() => setForToken(forToken ? 0 : 1)}
          >
            For {" "}
            {forToken === 0 ? token0?.symbol : token1.symbol}
          </button>
        </div>
      </div>
    </>

  )
}

export default V3PoolInfo
