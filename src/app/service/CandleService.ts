import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Candle} from '../models/Candle';

@Injectable({
  providedIn: 'root'
})
export class CandleService {
  private baseUrl = 'https://600195826587.ngrok-free.app/api/trade/candle';

  constructor(private http: HttpClient) {}

  getCandlesForToday(): Observable<Candle[]> {
    return this.http.get<Candle[]>(`${this.baseUrl}/today`);
  }
}
