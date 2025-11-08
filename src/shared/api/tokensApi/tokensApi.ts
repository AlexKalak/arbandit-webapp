import client from "@/app/api/onClient/graphql/apolloClient"
import GET_TOKENS from "./tokensQuery.gql"
import { TokenModel } from "@/src/entities/exchanges/token";

export class TokensWhere {
  chainId?: number | null;

  decimals?: number | null;

  name?: string | null;

  symbol?: string | null;

  address?: string;

  logoUri?: string | null;

  usdPrice?: string;
}


type GetTokensRespType = {
  tokens: TokenModel[]
}


export const TokensApi = {

  async getTokens(
    amount: number = 100,
    skip: number = 0,
    where?: TokensWhere,
  ): Promise<{ tokens: TokenModel[], error: string | null }> {

    const resp = await client.query<GetTokensRespType>({
      query: GET_TOKENS,
      variables: {
        where: where,
        first: amount,
        skip: skip
      }
    })

    if (resp.error || resp.data === undefined) {
      return {
        tokens: [],
        error: "unable to fetch data"
      }
    }

    return {
      tokens: resp.data.tokens,
      error: null
    }
  },

  async getTokenByAddress(
    address: string,
    chainId: number
  ): Promise<{ token: TokenModel | null, error: string | null }> {

    const where: TokensWhere = {
      address,
      chainId
    }

    const resp = await client.query<GetTokensRespType>({
      query: GET_TOKENS,
      variables: {
        where: where,
        first: 1,
        skip: 0
      }
    })

    if (resp.error || resp.data === undefined) {
      return {
        token: null,
        error: "unable to fetch data"
      }
    }

    if (resp.data.tokens.length == 0) {
      return {
        token: null,
        error: "token not found"
      }
    }

    return {
      token: resp.data.tokens[0],
      error: null
    }
  }

}
