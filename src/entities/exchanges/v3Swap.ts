export type V3SwapWhere = {
  id?: number;

  chainId?: number;

  txHash?: string;

  blockNumber?: number;

  poolAddress?: string;
}

export type V3SwapData = {
  id: number;

  txHash: string | null;

  txTimestamp: number | null;

  blockNumber: number | null;

  amount0: number | null;

  amount1: number | null;

  archiveToken0UsdPrice: number | null;

  archiveToken1UsdPrice: number | null;

  chainId: number | null;

  poolAddress: string | null;
}

export class V3SwapModel {
  id: number;
  txHash: string;
  txTimestamp: number;
  blockNumber: number;
  amount0: number;
  amount1: number;
  archiveToken0UsdPrice: number;
  archiveToken1UsdPrice: number;
  chainId: number;
  poolAddress: string;

  constructor(
    swapData: V3SwapData
  ) {
    if (
      !swapData.id ||
      !swapData.txHash ||
      !swapData.txTimestamp ||
      !swapData.blockNumber ||
      !swapData.amount0 ||
      !swapData.amount1 ||
      !swapData.archiveToken0UsdPrice ||
      !swapData.archiveToken1UsdPrice ||
      !swapData.chainId ||
      !swapData.poolAddress
    ) {
      throw new Error("V3SwapData passed in V3SwapModel constructor is invalid")
    }

    this.id = swapData.id;
    this.txHash = swapData.txHash;
    this.txTimestamp = swapData.txTimestamp;
    this.blockNumber = swapData.blockNumber;
    this.amount0 = swapData.amount0;
    this.amount1 = swapData.amount1;
    this.archiveToken0UsdPrice = swapData.archiveToken0UsdPrice;
    this.archiveToken1UsdPrice = swapData.archiveToken1UsdPrice;
    this.chainId = swapData.chainId;
    this.poolAddress = swapData.poolAddress;
  }

}
