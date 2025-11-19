import { TokenData, TokenModel } from "./token"

export type V3PoolData = {
  address: string;
  token0Address: string | null;
  token0: TokenData | null;
  token1Address: string | null;
  token1: TokenData | null;
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
  ticks: string | null;
  zfo_10usdRate: string | null;
  nonZfo_10usdRate: string | null;
}


export class V3PoolModel {
  address: string;
  token0Address: string;
  token0: TokenModel | null;
  token1Address: string;
  token1: TokenModel | null;
  sqrtPriceX96: number;
  liquidity: number;
  tick: number;
  feeTier: number;
  chainId: number;
  isDusty: boolean;
  exchangeName: string;
  blockNumber: number;
  tickSpacing: number;
  tickLower: number;
  tickUpper: number;
  ticks: string;
  zfo_10usdRate: number;
  nonZfo_10usdRate: number;

  constructor(v3poolData: V3PoolData, token0?: TokenModel, token1?: TokenModel) {
    if (
      v3poolData.address === null ||
      v3poolData.token0Address === null ||
      v3poolData.token1Address === null ||
      v3poolData.sqrtPriceX96 === null ||
      v3poolData.liquidity === null ||
      v3poolData.tick === null ||
      v3poolData.feeTier === null ||
      v3poolData.chainId === null ||
      v3poolData.isDusty === null ||
      v3poolData.exchangeName === null ||
      v3poolData.blockNumber === null ||
      v3poolData.tickSpacing === null ||
      v3poolData.tickLower === null ||
      v3poolData.tickUpper === null ||
      v3poolData.ticks === null ||
      v3poolData.zfo_10usdRate === null ||
      !v3poolData.nonZfo_10usdRate === null
    ) {
      throw new Error("PoolData passed in PoolModel constructor is invalid")
    }

    this.token0 = token0 ?? null;
    this.token1 = token1 ?? null;

    this.address = v3poolData.address;
    this.token0Address = v3poolData.token0Address;
    this.token1Address = v3poolData.token1Address;
    this.sqrtPriceX96 = Number(v3poolData.sqrtPriceX96);
    this.liquidity = Number(v3poolData.liquidity);
    this.tick = v3poolData.tick;
    this.feeTier = v3poolData.feeTier;
    this.chainId = v3poolData.chainId;
    this.isDusty = v3poolData.isDusty;
    this.exchangeName = v3poolData.exchangeName;
    this.blockNumber = v3poolData.blockNumber;
    this.tickSpacing = v3poolData.tickSpacing;
    this.tickLower = v3poolData.tickLower;
    this.tickUpper = v3poolData.tickUpper;
    this.ticks = v3poolData.ticks;
    this.zfo_10usdRate = Number(v3poolData.zfo_10usdRate);
    this.nonZfo_10usdRate = Number(v3poolData.nonZfo_10usdRate);
  }

}
