import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {CandleChart} from './candle-chart/candle-chart';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CandleChart],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('TradeFE');
}
