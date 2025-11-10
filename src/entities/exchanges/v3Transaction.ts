export type V3TransactionWhere = {
  id?: number;

  chainId?: number;

  txHash?: string;

  blockNumber?: number;

  poolAddress?: string;
}

export type V3TransactionModel = {
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
