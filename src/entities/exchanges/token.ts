export type TokenImpactData = {
  chainId: number | null;

  tokenAddress: string | null;

  exchangeIdentifier: string | null;

  impact: number | null;

  usdPrice: number | null;
}

export class TokenImpactModel {
  chainId: number
  tokenAddress: string
  exchangeIdentifier: string
  impact: number
  usdPrice: number

  constructor(data: TokenImpactData) {
    if (!data.chainId || !data.tokenAddress || !data.exchangeIdentifier || !data.impact || !data.usdPrice) {
      throw new Error("TokenImpactData passed in TokenImpactModel constructor is invalid")
    }
    this.chainId = data.chainId
    this.tokenAddress = data.tokenAddress
    this.exchangeIdentifier = data.exchangeIdentifier
    this.impact = data.impact
    this.usdPrice = data.usdPrice
  }
}


export type TokenData = {
  chainId: number | null;

  decimals: number | null;

  name: string | null;

  symbol: string | null;

  address: string | null;

  logoUri: string | null;

  usdPrice: number | null;

  tokenImpacts: TokenImpactData[]
}

export class TokenModel {
  chainId: number
  decimals: number;
  name: string;
  symbol: string;
  address: string;
  logoUri: string;
  usdPrice: number;
  tokenImpacts: TokenImpactModel[]

  constructor(
    tokenData: TokenData,
    {
      useDefaultValues = true
    }
  ) {

    if (useDefaultValues) {
      if (!tokenData.chainId || !tokenData.decimals || !tokenData.address || !tokenData.usdPrice) {
        throw new Error("TokenData passed in TokenModel constructor is invalid")
      }

      this.tokenImpacts = []
      if (tokenData.tokenImpacts) {
        for (const impactData of tokenData.tokenImpacts) {
          const impact = new TokenImpactModel(impactData)
          this.tokenImpacts.push(impact)
        }
      }


      this.usdPrice = tokenData.usdPrice
      this.chainId = tokenData.chainId
      this.decimals = tokenData.decimals
      this.address = tokenData.address

      this.name = tokenData.name ?? ""
      this.symbol = tokenData.symbol ?? ""
      this.logoUri = tokenData.logoUri ?? ""

      return
    }

    if (!tokenData.chainId || !tokenData.decimals || !tokenData.name || !tokenData.symbol || !tokenData.address || tokenData.logoUri === undefined || !tokenData.usdPrice || !tokenData.tokenImpacts) {
      throw new Error("TokenData passed in TokenModel constructor is invalid")
    }

    this.tokenImpacts = []
    for (const impactData of tokenData.tokenImpacts) {
      const impact = new TokenImpactModel(impactData)
      this.tokenImpacts.push(impact)
    }

    this.chainId = tokenData.chainId
    this.decimals = tokenData.decimals
    this.name = tokenData.name
    this.symbol = tokenData.symbol
    this.address = tokenData.address
    this.logoUri = tokenData.logoUri ?? ""
    this.usdPrice = tokenData.usdPrice
  }

}


export const getRealAmountOfToken = (token: TokenModel, amount: number) => {
  if (!token.decimals) {
    return 0;
  }
  return amount / Math.pow(10, token.decimals);
} 
