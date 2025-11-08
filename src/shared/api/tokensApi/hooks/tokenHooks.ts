import { TokenModel } from "@/src/entities/exchanges/token";
import { useQuery } from "@apollo/client/react";
import GET_TOKENS from "../tokensQuery.gql"
import { TokensWhere } from "../tokensApi";

type TokenData = {
  tokens: TokenModel[],
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

  const { data: rawData, error, loading } = useQuery<TokenData>(GET_TOKENS, {
    variables: { first: 1, skip: 0, where: where },
    pollInterval: pollInterval
  });


  const firstToken = rawData?.tokens?.[0] ?? null


  return {
    token: firstToken,
    isLoading: loading,
    error: error ? error.message : null,
  }
}
