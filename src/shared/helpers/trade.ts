export const getPrice = (forToken: number, token0UsdPrice: number, token1UsdPrice: number, amount0Real: number, amount1Real: number) => {
  const tokenPrice = forToken == 0 ?
    token1UsdPrice * Math.abs(amount1Real / amount0Real) :
    token0UsdPrice * Math.abs(amount0Real / amount1Real)

  return tokenPrice
}

