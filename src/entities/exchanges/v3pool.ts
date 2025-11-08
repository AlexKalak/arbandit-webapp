import { TokenModel } from "./token"

export type V3PoolModel = {
  address: string;
  token0Address: string | null;
  token0: TokenModel | null;
  token1Address: string | null;
  token1: TokenModel | null;
  sqrtPriceX96: string | null;
  liquidity: string | null;
  tick: number | null;
  feeTier: number | null;
  chainId: number | null;
  isDusty: boolean | null;
  exchangeName: string | null;
  blockNumber: number | null;
  tickSpacing: number | null;
  tickLower: number | null;
  tickUpper: number | null;
  nearTicks: string | null;
  zfo_10usdRate: string | null;
  nonZfo_10usdRate: string | null;
}
