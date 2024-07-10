import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Evento } from '../models/Evento';

@Injectable()
export class EventoService {
  private baseURL = 'https://localhost:5001/Eventos';
  constructor(private htpp: HttpClient) {}

  public getEvento(): Observable<Evento[]> {
    return this.htpp.get<Evento[]>(this.baseURL).pipe(take(1));
  }

  public getEventoByTema(tema: string): Observable<Evento[]> {
    return this.htpp.get<Evento[]>(`${this.baseURL}/${tema}/tema`).pipe(take(1));
  }

  public getEventoById(id: number): Observable<Evento[]> {
    return this.htpp.get<Evento[]>(`${this.baseURL}/${id}`).pipe(take(1));
  }

  public post(evento: Evento): Observable<Evento> {
    return this.htpp.post<Evento>(this.baseURL, evento).pipe(take(1));
  }

  public put(evento: Evento): Observable<Evento> {
    return this.htpp.put<Evento>(`${this.baseURL}/${evento.id}`, evento).pipe(take(1));
  }

  public deleteEvento(id: number): Observable<any> {
    return this.htpp.delete(`${this.baseURL}/${id}`).pipe(take(1));
  }
}
