import {
  ColorType,
  createChart as createLightWeightChart,
  CrosshairMode,
  ISeriesApi,
  LineStyle,
  UTCTimestamp,
} from "lightweight-charts";

export interface ChartTheme {
  /** Axis label colour. */
  color: string;
  /** Gridline colour: barely there. */
  grid: string;
  /** Crosshair line colour. */
  crosshair: string;
  /** Crosshair label background: the accent. */
  accent: string;
  up: string;
  down: string;
  fontFamily?: string;
  /** Kept for compatibility; the chart sits on its surface, so this is unused. */
  background?: string;
}

export class ChartManager {
  private candleSeries: ISeriesApi<"Candlestick">;
  private lastUpdateTime: number = 0;
  private chart: any;
  private currentBar: {
    open: number | null;
    high: number | null;
    low: number | null;
    close: number | null;
  } = {
    open: null,
    high: null,
    low: null,
    close: null,
  };

  constructor(ref: any, initialData: any[], layout: ChartTheme) {
    const chart = createLightWeightChart(ref, {
      autoSize: true,
      overlayPriceScales: {
        ticksVisible: false,
        borderVisible: false,
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: layout.crosshair,
          width: 1,
          style: LineStyle.Dashed,
          labelBackgroundColor: layout.accent,
        },
        horzLine: {
          color: layout.crosshair,
          width: 1,
          style: LineStyle.Dashed,
          labelBackgroundColor: layout.accent,
        },
      },
      rightPriceScale: {
        visible: true,
        ticksVisible: false,
        entireTextOnly: true,
        borderVisible: false,
        scaleMargins: { top: 0.12, bottom: 0.12 },
      },
      grid: {
        horzLines: {
          visible: true,
          color: layout.grid,
        },
        vertLines: {
          visible: true,
          color: layout.grid,
        },
      },
      layout: {
        background: {
          type: ColorType.Solid,
          color: "transparent",
        },
        textColor: layout.color,
        fontSize: 11,
        fontFamily: layout.fontFamily,
      },
      timeScale: {
        borderVisible: false,
        timeVisible: true,
        secondsVisible: false,
      },
    });
    this.chart = chart;
    this.candleSeries = chart.addCandlestickSeries({
      upColor: layout.up,
      downColor: layout.down,
      borderVisible: false,
      wickUpColor: layout.up,
      wickDownColor: layout.down,
      priceLineColor: layout.crosshair,
      priceLineStyle: LineStyle.Dotted,
    });

    this.candleSeries.setData(
      initialData.map((data) => ({
        ...data,
        time: (data.timestamp / 1000) as UTCTimestamp,
      }))
    );
    chart.timeScale().fitContent();
  }

  public update(updatedPrice: any) {
    if (!this.lastUpdateTime) {
      this.lastUpdateTime = new Date().getTime();
    }

    this.candleSeries.update({
      time: (this.lastUpdateTime / 1000) as UTCTimestamp,
      close: updatedPrice.close,
      low: updatedPrice.low,
      high: updatedPrice.high,
      open: updatedPrice.open,
    });

    if (updatedPrice.newCandleInitiated) {
      this.lastUpdateTime = updatedPrice.time;
    }
  }

  public destroy() {
    this.chart.remove();
  }
}
