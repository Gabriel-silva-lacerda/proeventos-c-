import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Lote } from '@app/models/Lote';
import { Observable, take } from 'rxjs';

@Injectable()
export class LoteService {
  private baseURL = 'https://localhost:5001/Lotes';
  constructor(private htpp: HttpClient) {}

  public getLotesByEventoId(eventoId: number): Observable<Lote[]> {
    return this.htpp.get<Lote[]>(`${this.baseURL}/${eventoId}`).pipe(take(1));
  }

  public saveLote(eventoId: number, lotes: Lote[]): Observable<Lote[]> {
    return this.htpp
      .put<Lote[]>(`${this.baseURL}/${eventoId}`, lotes)
      .pipe(take(1));
  }

  public deleteLote(eventoId: number, loteId: number): Observable<any> {
    return this.htpp
      .delete(`${this.baseURL}/${eventoId}/${loteId}`)
      .pipe(take(1));
  }
}
