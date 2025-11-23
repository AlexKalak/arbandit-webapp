export const chains: Record<number, string> = {
  1: "Ethereum"
}

export const ID2Name = (chainID: number): string => {
  return chains[chainID] ?? "unknown"

}
