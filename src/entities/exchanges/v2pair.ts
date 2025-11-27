import { TokenData, TokenModel } from "./token"

export class V2PairWhere {
  id?: number;
  chainId?: number;
  address?: string;
  token0Address?: string;
  token1Address?: string;
  token0Symbol?: string;
  token1Symbol?: string;
}

export type V2PairData = {
  chainId: number | null;
  address: string;
  token0Address: string | null;
  token0: TokenData | null;
  token1Address: string | null;
  token1: TokenData | null;
  amount0: string;
  amount1: string;
  isDusty: boolean | null;
  feeTier: number | null;
  exchangeName: string | null;
  blockNumber: number | null;
  zfo_10usdRate: string | null;
  nonZfo_10usdRate: string | null;
}

export class V2PairModel {
  chainId: number;
  address: string;
  token0Address: string;
  token0: TokenModel | null;
  token1Address: string;
  token1: TokenModel | null;
  amount0: number;
  amount1: number;
  isDusty: boolean;
  feeTier: number;
  exchangeName: string;
  blockNumber: number;
  zfo_10usdRate: number;
  nonZfo_10usdRate: number;

  constructor(v2PairData: V2PairData, token0?: TokenModel, token1?: TokenModel) {
    if (
      v2PairData.address === null ||
      v2PairData.token0Address === null ||
      v2PairData.token1Address === null ||
      v2PairData.amount0 === null ||
      v2PairData.amount1 === null ||
      v2PairData.feeTier === null ||
      v2PairData.chainId === null ||
      v2PairData.isDusty === null ||
      v2PairData.exchangeName === null ||
      v2PairData.blockNumber === null ||
      v2PairData.zfo_10usdRate === null ||
      v2PairData.nonZfo_10usdRate === null
    ) {
      throw new Error("PoolData passed in PoolModel constructor is invalid")
    }

    this.token0 = token0 ?? null;
    this.token1 = token1 ?? null;

    this.address = v2PairData.address;
    this.token0Address = v2PairData.token0Address;
    this.token1Address = v2PairData.token1Address;
    this.amount0 = Number(v2PairData.amount0);
    this.amount1 = Number(v2PairData.amount1);
    this.feeTier = v2PairData.feeTier;
    this.chainId = v2PairData.chainId;
    this.isDusty = v2PairData.isDusty;
    this.exchangeName = v2PairData.exchangeName;
    this.blockNumber = v2PairData.blockNumber;
    this.zfo_10usdRate = Number(v2PairData.zfo_10usdRate);
    this.nonZfo_10usdRate = Number(v2PairData.nonZfo_10usdRate);
  }

}
