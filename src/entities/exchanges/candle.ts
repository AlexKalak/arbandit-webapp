import { v4 } from "uuid"

export type CandleData = {
  uuid: string,
  open: number,
  close: number,
  low: number,
  high: number,
  timestamp: number,
  amountSwaps: number

}

export class CandleModel {
  uuid: string
  open: number
  close: number
  low: number
  high: number
  timestamp: number
  amountSwaps: number

  constructor(candleData?: CandleData) {
    if (candleData === undefined) {
      this.uuid = v4().toString()
      this.open = 0
      this.close = 0
      this.low = 0
      this.high = 0
      this.timestamp = 0
      this.amountSwaps = 0

      return
    }

    this.uuid = candleData.uuid
    this.open = Number(candleData.open)
    this.close = Number(candleData.close)
    this.low = Number(candleData.low)
    this.high = Number(candleData.high)
    this.timestamp = Number(candleData.timestamp)
    this.amountSwaps = Number(candleData.amountSwaps)
  }
}
