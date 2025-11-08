'use client'
import { AreaData, AreaSeries, CandlestickData, CandlestickSeries, ColorType, createChart, Time } from 'lightweight-charts'
import { useEffect, useRef } from 'react';



interface ChartComponentColor {
  backgroundColor: string
  lineColor: string
  textColor: string
  areaTopColor: string
  areaBottomColor: string
}

interface ChartComponentProps {
  data: CandlestickData<Time>[],
  colors?: ChartComponentColor
}

export const V3PoolTransactionsChart = ({ data, colors }: ChartComponentProps) => {
  const {
    backgroundColor = 'black',
    lineColor = '#2962FF',
    textColor = 'white',
    areaTopColor = '#2962FF',
    areaBottomColor = 'rgba(41, 98, 255, 0.28)',
  } = {}

  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(
    () => {
      if (!chartContainerRef?.current) return;

      const handleResize = () => {
        chart.applyOptions({ width: chartContainerRef?.current?.clientWidth });
      };

      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: backgroundColor },
          textColor,
        },
        width: chartContainerRef.current.clientWidth,
        height: 300,
      });

      chart.timeScale().fitContent();

      chart.applyOptions({
        localization: {
          timeFormatter: (time: Time) => {
            return `#${time}`
          },
        },
      })
      // timeScale: {
      // tickMarkFormatter: (time: Time) => {
      //   return `#${time}`
      // }
      // }

      const newSeries = chart.addSeries(CandlestickSeries, {});
      newSeries.setData(data);

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);

        chart.remove();
      };
    },
    [data, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor]
  );

  return (
    <div ref={chartContainerRef}>
    </div>
  )

}

export default V3PoolTransactionsChart
