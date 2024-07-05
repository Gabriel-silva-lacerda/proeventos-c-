import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Evento } from '../models/Evento';

@Injectable()
export class EventoService {
  private baseURL = 'https://localhost:5001/Eventos';
  constructor(private htpp: HttpClient) {}

  public getEvento(): Observable<Evento[]> {
    return this.htpp.get<Evento[]>(this.baseURL);
  }

  public getEventoByTema(tema: string): Observable<Evento[]> {
    return this.htpp.get<Evento[]>(`${this.baseURL}/${tema}/tema`);
  }

  public getEventoById(id: number): Observable<Evento[]> {
    return this.htpp.get<Evento[]>(`${this.baseURL}/${id}`);
  }
}
