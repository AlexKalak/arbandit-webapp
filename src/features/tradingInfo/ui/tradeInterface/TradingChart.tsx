'use client'

import { CandleModel } from '@/src/entities/exchanges/candle';
import { CandlestickData, CandlestickSeries, ColorType, createChart, IChartApi, ISeriesApi, Time, UTCTimestamp } from 'lightweight-charts'
import { useEffect, useRef, useState } from 'react';


function candleModelToCandleStickData(candle: CandleModel): CandlestickData<Time> {
  return {
    time: candle.timestamp as UTCTimestamp,
    open: candle.open,
    close: candle.close,
    low: candle.close,
    high: candle.high,
  }

}
function candleModelsArrayToData(candles: CandleModel[]): CandlestickData<Time>[] {
  const result: CandlestickData<Time>[] = []
  for (const candle of candles) {
    result.push(candleModelToCandleStickData(candle))
  }

  return result
}

interface ChartComponentColor {
  backgroundColor: string
  lineColor: string
  textColor: string
  areaTopColor: string
  areaBottomColor: string
}

interface ChartComponentProps {
  forToken: number,
  candles: CandleModel[],
  updatingCandle: CandleModel | null,
  colors?: ChartComponentColor
}

export const TradingChart = ({ forToken, candles, updatingCandle, colors }: ChartComponentProps) => {
  const {
    backgroundColor = 'black',
    lineColor = '#2962FF',
    textColor = 'white',
    areaTopColor = '#2962FF',
    areaBottomColor = 'rgba(41, 98, 255, 0.28)',
  } = {}

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick">>(null)

  const [chart, setChart] = useState<IChartApi>()

  useEffect(
    () => {
      if (!chartContainerRef?.current) return;

      const handleResize = () => {
        if (!chart) return;

        chart.applyOptions({ width: chartContainerRef?.current?.clientWidth });
      };


      let chart: IChartApi | null = null

      chart = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: backgroundColor },
          textColor,
        },
        grid: {
          vertLines: {
            color: 'rgba(255, 255, 255, 0.4)',   // color of vertical grid lines
            style: 1,                             // line style (0=solid, 1=dotted, 2=dashed)
            visible: true,                        // show/hide vertical lines
          },
          horzLines: {
            color: 'rgba(255, 255, 255, 0.4)',   // color of horizontal grid lines
            style: 1,
            visible: true,
          },
        },
        width: chartContainerRef.current.clientWidth,
        height: 600,
      });

      chart.timeScale().fitContent();
      setChart(chart)


      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);

        chart?.remove();
      };
    },
    [setChart, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor]
  );

  useEffect(() => {
    if (!chart) {
      return
    }

    seriesRef.current = chart.addSeries(CandlestickSeries, {});

    return () => {
      if (seriesRef?.current) {
        chart.removeSeries(seriesRef.current)
      }
    }

  }, [chart, forToken])

  useEffect(() => {
    const series = seriesRef.current
    if (!series) {
      return
    }
    if (series.data().length == 0) {
      series.setData(candleModelsArrayToData(candles))
    }

    if (updatingCandle) {
      series.update(candleModelToCandleStickData(updatingCandle))
    }
  }, [candles, updatingCandle])

  return (
    <div ref={chartContainerRef}>
    </div>
  )

}

export default TradingChart

