import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrl: './eventos.component.scss',
})
export class EventosComponent implements OnInit {
  public eventos: any;

  constructor(private htpp: HttpClient) {}

  ngOnInit(): void {
    this.getEventos();
  }

  public getEventos(): void {
    this.htpp.get('https://localhost:7044/api/Eventos').subscribe(
      (response) => {
        this.eventos = response;
      },
      (error) => {
        console.error('Ocorreu um erro:', error);
      }
    );
  }
}
