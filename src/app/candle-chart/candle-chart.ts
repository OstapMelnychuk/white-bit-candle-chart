import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexChart,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexStroke,
  ApexTooltip,
  ApexDataLabels,
  NgApexchartsModule
} from 'ng-apexcharts';
import { Candle } from '../models/Candle';
import { CandleService } from '../service/CandleService';
import { CandleWsService } from '../service/CandleWsService';
import { CommonModule } from '@angular/common';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  theme?: any;
};

@Component({
  selector: 'app-candle-chart',
  templateUrl: './candle-chart.html',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule]
})
export class CandleChart implements OnInit, AfterViewInit {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions!: ChartOptions;

  private candleData: any[] = [];
  private emaData: any[] = [];

  constructor(
    private candleService: CandleService,
    private candleWsService: CandleWsService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.candleService.getCandlesForToday().subscribe(data => {
      this.candleData = this.transformCandlesToChartData(data);
      this.emaData = this.transformEmaToChartData(data);
      this.initChartOptions();
    });
  }

  ngAfterViewInit(): void {
    this.candleWsService.candleUpdates.subscribe(candle => {
      if (!candle || !this.chart) return;

      const newCandleData = this.transformCandlesToChartData([candle]);
      const newEmaData = this.transformEmaToChartData([candle]);

      this.candleData = [...this.candleData, ...newCandleData];
      this.emaData = [...this.emaData, ...newEmaData];

      // Update series without resetting zoom/scale
      this.chart.updateSeries([
        { name: 'Candles', type: 'candlestick', data: this.candleData },
        { name: 'EMA close', type: 'line', data: this.emaData }
      ], false); // false prevents animation/scale reset

      this.cd.detectChanges();
    });
  }

  private transformCandlesToChartData(candles: Candle[]) {
    return candles.map(c => ({
      x: new Date(c.timestamp * 1000),
      y: [c.open, c.high, c.low, c.close]
    }));
  }

  private transformEmaToChartData(candles: Candle[]) {
    return candles.map(c => ({
      x: new Date(c.timestamp * 1000),
      y: c.ema
    }));
  }

  private initChartOptions() {
    this.chartOptions = {
      series: [
        { name: 'Candles', type: 'candlestick', data: this.candleData },
        { name: 'EMA close', type: 'line', data: this.emaData }
      ],
      chart: {
        type: 'candlestick',
        height: 700,
        toolbar: { show: true },
        zoom: { enabled: true, type: 'x', autoScaleYaxis: false } // keep zoom scale fixed
      },
      theme: {
        mode: 'dark'
      },
      xaxis: { type: 'datetime', labels: { style: { colors: '#ccc' } } },
      yaxis: { labels: { style: { colors: '#ccc' } }, tooltip: { enabled: true } },
      title: { text: 'BTC_USDT – Candles + EMA', style: { color: '#fff' } },
      stroke: { width: [1, 2], curve: 'smooth' },
      tooltip: { enabled: true, shared: true, intersect: false },
      dataLabels: { enabled: false },
    };
  }
}
