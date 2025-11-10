export type CandleData = {
  uuid: string,
  open: number,
  close: number,
  low: number,
  high: number,
  timestamp: number,
  amountTransactions: number

}

export class CandleModel {
  uuid: string
  open: number
  close: number
  low: number
  high: number
  timestamp: number
  amountTransactions: number

  constructor(candleData: CandleData) {
    this.uuid = candleData.uuid
    this.open = Number(candleData.open)
    this.close = Number(candleData.close)
    this.low = Number(candleData.low)
    this.high = Number(candleData.high)
    this.timestamp = Number(candleData.timestamp)
    this.amountTransactions = Number(candleData.amountTransactions)
  }
}
