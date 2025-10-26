import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Candle} from '../models/Candle';

@Injectable({
  providedIn: 'root'
})
export class CandleService {
  private baseUrl = 'http://localhost:8080/api/trade/candle';

  constructor(private http: HttpClient) {}

  getCandlesForToday(): Observable<Candle[]> {
    return this.http.get<Candle[]>(`${this.baseUrl}/today`);
  }
}
