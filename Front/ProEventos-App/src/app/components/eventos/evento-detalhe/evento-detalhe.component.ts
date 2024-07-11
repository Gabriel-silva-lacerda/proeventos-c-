import { Component, OnInit, TemplateRef } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Evento } from '@app/models/Evento';
import { Lote } from '@app/models/Lote';
import { EventoService } from '@app/services/evento.service';
import { LoteService } from '@app/services/lote.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrl: './evento-detalhe.component.scss',
})
export class EventoDetalheComponent implements OnInit {
  modalRef!: BsModalRef;
  eventoId!: number;
  evento = {} as any;
  form!: FormGroup;
  locale = 'pt-br';
  estadoSalvar: 'post' | 'put' = 'post';
  loteAtual = { id: 0, nome: '', indice: 0 };

  constructor(
    private fb: FormBuilder,
    private localeService: BsLocaleService,
    private activatedRouter: ActivatedRoute,
    private eventoService: EventoService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    private loteService: LoteService,
    private modalService: BsModalService
  ) {
    this.localeService.use(this.locale);
  }

  ngOnInit(): void {
    this.validation();
    this.carregarEvento();
  }

  get modoEditar(): boolean {
    return this.estadoSalvar === 'put';
  }

  get lotes(): FormArray {
    return this.form.get('lotes') as FormArray;
  }

  get f(): any {
    return this.form.controls;
  }

  get bsConfig(): any {
    return {
      isAnimated: true,
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY',
      containerClass: 'theme-default',
      showWeekNumbers: false,
    };
  }

  public carregarEvento(): void {
    // this.eventoId = +(this.activatedRouter.snapshot.paramMap.get('id') ?? 0);
    const eventoId = this.activatedRouter.snapshot.paramMap.get('id');

    if (eventoId !== null) {
      this.spinner.show();

      this.estadoSalvar = 'put';

      this.eventoService.getEventoById(+eventoId).subscribe({
        next: (evento) => {
          this.evento = { ...evento };
          this.form.patchValue(this.evento);
          this.evento.lotes.forEach((lote: any) => {
            this.lotes.push(this.criarLote(lote));
          });
        },
        error: (err) => {
          this.spinner.hide();
          this.toastr.error('Erro ao tentar carregar evento', 'Erro!');
          console.error(err);
        },
        complete: () => {
          this.spinner.hide();
        },
      });
    }
  }

  public validation(): void {
    this.form = this.fb.group({
      tema: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
        ],
      ],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(12000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      imagemURL: ['', Validators.required],
      lotes: this.fb.array([]),
    });
  }

  adicionarLote(): void {
    this.lotes.push(this.criarLote({ id: 0 } as Lote));
  }

  criarLote(lote: Lote): FormGroup {
    return this.fb.group({
      id: [lote.id],
      nome: [lote.nome, Validators.required],
      quantidade: [lote.quantidade, Validators.required],
      preco: [lote.preco, Validators.required],
      dataInicio: [lote.dataInicio],
      dataFim: [lote.dataFim],
    });
  }

  public mudalValorData(value: Date, indice: number, campo: string): void {
    this.lotes.value[indice][campo] = value;
  }

  public retornaTituloLote(nome: string): string {
    return nome === null || nome === '' ? 'Nome do lote' : nome;
  }

  public resetForm(): void {
    this.form.reset();
  }

  public cssValidator(campoForm: FormControl | AbstractControl | any): any {
    return { 'is-invalid': campoForm.errors && campoForm.touched };
  }

  public savalEvento(): void {
    if (this.form.valid) {
      this.spinner.show();
      this.evento =
        this.estadoSalvar === 'post'
          ? { ...this.form.value }
          : { id: this.evento.id, ...this.form.value };

      this.eventoService[this.estadoSalvar](this.evento).subscribe(
        (eventoRetorno: Evento) => {
          this.toastr.success('Evento salvo com Sucesso!', 'Sucesso');
          this.router.navigate([`eventos/detalhe/${eventoRetorno.id}`]);
        },
        (error: any) => {
          console.error(error);
          this.spinner.hide();
          this.toastr.error('Error ao salvar evento', 'Erro');
        },
        () => this.spinner.hide()
      );
    }
  }

  public salvarLotes(): void {
    const eventoId = this.activatedRouter.snapshot.paramMap.get('id');
    this.spinner.show();

    if (this.form.controls['lotes'].valid && eventoId !== null) {
      this.loteService
        .saveLote(+eventoId, this.form.value.lotes)
        .subscribe(
          () => {
            this.toastr.success('Lotes foi salvo com sucesso', 'Sucesso');
            this.lotes.reset();
          },
          (err: any) => {
            this.spinner.hide();
            this.toastr.error('Erro ao salvar o lote', 'Erro!');
            console.error(err);
          }
        )
        .add(() => this.spinner.hide());
    }
  }

  public removerLote(template: TemplateRef<any>, indice: number): void {
    this.loteAtual.id = this.lotes.get(indice + '.id')?.value;
    this.loteAtual.nome = this.lotes.get(indice + '.nome')?.value;
    this.loteAtual.indice = indice;

    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  public confirmDeleteLote(): void {
    const eventoId = this.activatedRouter.snapshot.paramMap.get('id');

    this.modalRef.hide();
    this.spinner.show();
    if (eventoId !== null) {
      this.loteService
        .deleteLote(+eventoId, this.loteAtual.id)
        .subscribe(
          () => {
            this.toastr.success('Lotes deletado com sucesso', 'Sucesso');
            this.lotes.removeAt(this.loteAtual.indice);
          },
          (err: any) => {
            this.spinner.hide();
            this.toastr.error('Erro ao deletar o lote', 'Erro!');
            console.error(err);
          }
        )
        .add(() => this.spinner.hide());
    }
  }

  public declineDeleteLote(): void {
    this.modalRef.hide();
  }
}
