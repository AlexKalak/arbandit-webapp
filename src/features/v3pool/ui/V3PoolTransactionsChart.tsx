'use client'
import { AreaData, AreaSeries, CandlestickData, CandlestickSeries, ColorType, createChart, IChartApi, ISeriesApi, Time } from 'lightweight-charts'
import { useEffect, useRef, useState } from 'react';



interface ChartComponentColor {
  backgroundColor: string
  lineColor: string
  textColor: string
  areaTopColor: string
  areaBottomColor: string
}

interface ChartComponentProps {
  data: CandlestickData<Time>[],
  updatedCandle: CandlestickData<Time>,
  colors?: ChartComponentColor
}

export const V3PoolTransactionsChart = ({ data, updatedCandle, colors }: ChartComponentProps) => {
  const {
    backgroundColor = 'black',
    lineColor = '#2962FF',
    textColor = 'white',
    areaTopColor = '#2962FF',
    areaBottomColor = 'rgba(41, 98, 255, 0.28)',
  } = {}

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [series, setSeries] = useState<ISeriesApi<"Candlestick">>()

  useEffect(
    () => {
      if (!chartContainerRef?.current) return;

      const handleResize = () => {
        if (!chart) return;

        chart.applyOptions({ width: chartContainerRef?.current?.clientWidth });
      };


      let chart: IChartApi | null = null
      console.log("Creating")

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
      const newSeries = chart.addSeries(CandlestickSeries, {});
      setSeries(newSeries)

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);

        chart?.remove();
      };
    },
    [setSeries, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor]
  );

  useEffect(() => {
    if (!series) {
      return
    }
    series.setData(data)
  }, [series, data])

  return (
    <div ref={chartContainerRef}>
    </div>
  )

}

export default V3PoolTransactionsChart
