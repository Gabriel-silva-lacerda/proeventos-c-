import { Component, TemplateRef } from '@angular/core';
import { EventoService } from '../../../services/evento.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Evento } from '../../../models/Evento';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from '@app/environments/environment';
import { PaginatedResult, Pagination } from '@app/models/Pagination';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrl: './evento-lista.component.scss',
})
export class EventoListaComponent {
  modalRef!: BsModalRef;
  public eventos: Evento[] = [];
  public larguraImagem = 150;
  public margemImagem = 2;
  public exibirImagem = true;
  public eventoId = 0;
  public pagination = {} as Pagination;

  termoBuscaChanded: Subject<string> = new Subject<string>();

  public filtrarEventos(evt: any): void {
    if (this.termoBuscaChanded.observers.length === 0) {
      this.termoBuscaChanded
        .pipe(debounceTime(500))
        .subscribe((filtrarPor) => {
          this.spinner.show();
          this.eventoService
            .getEventos(
              this.pagination.currentPage,
              this.pagination.itemsPerPage,
              filtrarPor
            )
            .subscribe({
              next: (response: PaginatedResult<Evento[]>) => {
                this.eventos = response.result;
                this.pagination = response.pagination;
              },
              error: (error: any) => {
                this.spinner.hide();
                console.error('Ocorreu um erro:', error);
                this.toasrt.error('erro ao Carregar os Eventos', 'Erro!');
              },
              complete: () => this.spinner.hide(),
            });
        });
    }
    this.termoBuscaChanded.next(evt.value);
  }

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private toasrt: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.pagination = {
      currentPage: 1,
      itemsPerPage: 3,
      totalItems: 1,
    } as Pagination;

    this.carregarEventos();
  }

  public alterarImagem(): void {
    this.exibirImagem = !this.exibirImagem;
  }

  public mostraImagem(imagemURL: string): string {
    return imagemURL !== ''
      ? `${environment.apiURL}resources/images/${imagemURL}`
      : 'assets/semImagem.jpeg';
  }

  public carregarEventos(): void {
    this.spinner.show();

    this.eventoService
      .getEventos(this.pagination.currentPage, this.pagination.itemsPerPage)
      .subscribe({
        next: (response: PaginatedResult<Evento[]>) => {
          this.eventos = response.result;
          this.pagination = response.pagination;
        },
        error: (error: any) => {
          this.spinner.hide();
          console.error('Ocorreu um erro:', error);
          this.toasrt.error('erro ao Carregar os Eventos', 'Erro!');
        },
        complete: () => this.spinner.hide(),
      });
  }

  openModal(event: any, template: TemplateRef<any>, eventoId: number): void {
    event.stopPropagation();
    this.eventoId = eventoId;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  public pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.carregarEventos();
  }

  confirm(): void {
    this.modalRef.hide();
    this.spinner.show();
    this.eventoService.deleteEvento(this.eventoId).subscribe(
      (result: string) => {
        this.toasrt.success('O Evento foi deletado com sucesso', 'Deletado');
        this.spinner.hide();
        this.carregarEventos();
      },
      (err) => {
        this.spinner.hide();
        this.toasrt.error('Erro ao tentar deletar o evento', 'Erro!');
        console.error(err);
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  decline(): void {
    this.modalRef.hide();
  }

  detalheEvento(id: number): void {
    this.router.navigate([`eventos/detalhe/${id}`]);
  }
}
