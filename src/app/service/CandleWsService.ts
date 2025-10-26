import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import SockJS from 'sockjs-client';
import { Client, IMessage, Stomp } from '@stomp/stompjs';
import { Candle } from '../models/Candle';

// Polyfill global for SockJS
(window as any).global = window;

@Injectable({ providedIn: 'root' })
export class CandleWsService {
  private socketUrl = 'http://localhost:8080/ws/candles'; // your STOMP endpoint
  private client!: Client;
  private _candleUpdates = new BehaviorSubject<Candle | null>(null);

  public candleUpdates = this._candleUpdates.asObservable();

  constructor() {
    this.initWebSocket();
  }

  private initWebSocket() {
    const sock = new SockJS(this.socketUrl);

    this.client = new Client({
      webSocketFactory: () => sock as any,
      debug: (msg) => {},
      reconnectDelay: 5000,
    });

    this.client.onConnect = (frame) => {
      console.log('[STOMP] Connected:', frame);

      // Subscribe to candle updates from backend
      this.client.subscribe('/topic/candles', (message: IMessage) => {
        if (message.body) {
          const candle: Candle = JSON.parse(message.body);
          this._candleUpdates.next(candle);
        }
      });
    };

    this.client.onStompError = (frame) => {
      console.error('[STOMP] Error:', frame.headers['message'], frame.body);
    };

    this.client.activate();
  }
}
