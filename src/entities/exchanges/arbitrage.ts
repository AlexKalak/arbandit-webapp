type ArbitragePathUnitData = {
  poolAddress?: string
  tokenInAddress?: string
  tokenOutAddress?: string
  amountIn?: string
  amountOut?: string
}
export type ArbitrageData = {
  path?: ArbitragePathUnitData[],
}

export class ArbitragePathUnitModel {
  poolAddress: string
  tokenInAdress: string
  tokenOutAddress: string
  amountIn: number
  amountOut: number

  constructor(data: ArbitragePathUnitData) {
    if (!data.poolAddress || !data.tokenInAddress || !data.tokenOutAddress || !Number(data.amountIn) || !Number(data.amountOut)) {
      throw new Error("ArbitragePathUnitData passed in ArbitragePathUnitModel.constructor is invalid")
    }
    this.poolAddress = data.poolAddress
    this.tokenInAdress = data.tokenInAddress
    this.tokenOutAddress = data.tokenOutAddress
    this.amountIn = Number(data.amountIn)
    this.amountOut = Number(data.amountOut)
  }

}

export class ArbitrageModel {
  path?: ArbitragePathUnitModel[]

  constructor(data: ArbitrageData) {
    if (!data) {
      throw new Error("ArbitrageData passed in ArbitrageModel.constructor is invalid")
    }
    if (!data.path) {
      throw new Error("ArbitrageData.path passed in ArbitrageModel.constructor is invalid")
    }

    this.path = []
    for (const arbPathUnitData of data.path) {
      const arbPathUnitModel = new ArbitragePathUnitModel(arbPathUnitData)
      this.path.push(arbPathUnitModel)
    }
  }
}
