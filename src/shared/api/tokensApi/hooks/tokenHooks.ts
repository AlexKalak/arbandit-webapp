import { TokenData, TokenModel } from "@/src/entities/exchanges/token";
import { useQuery } from "@apollo/client/react";
import GET_TOKENS from "../gql/tokensQuery.gql"

type TokensWhere = {
  chainId?: number;

  decimals?: number;

  name?: string;

  symbol?: string;

  address?: string;

  logoUri?: string;

  usdPrice?: string;
}

type TokenQueryData = {
  tokens: TokenData[],
}

export const useGetTokenByAddressAndChainID = (tokenAddress: string, chainID: number, pollInterval?: number): {
  token: TokenModel | null,
  isLoading: boolean,
  error: string | null
} => {
  const where: TokensWhere = {
    address: tokenAddress,
    chainId: chainID,
  }

  const { data: rawData, error, loading } = useQuery<TokenQueryData>(GET_TOKENS, {
    variables: { first: 1, skip: 0, where: where },
    pollInterval: pollInterval
  });


  const firstTokenData = rawData?.tokens?.[0] ?? null
  if (!firstTokenData) {
    return {
      token: null,
      isLoading: loading,
      error: error?.message ?? ""
    }
  }

  try {
    const tokenModel = new TokenModel(firstTokenData, { useDefaultValues: true })
    return {
      token: tokenModel,
      isLoading: loading,
      error: error?.message ?? ""
    }
  } catch {
    return {
      token: null,
      isLoading: loading,
      error: "unable to contruct tokenModel from tokenData",

    }

  }
}
