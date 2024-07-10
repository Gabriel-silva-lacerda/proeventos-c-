import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/services/evento.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrl: './evento-detalhe.component.scss',
})
export class EventoDetalheComponent implements OnInit {
  evento = {} as any;
  form!: FormGroup;
  locale = 'pt-br';
  estadoSalvar: 'post' | 'put' = 'post';

  constructor(
    private fb: FormBuilder,
    private localeService: BsLocaleService,
    private router: ActivatedRoute,
    private eventoService: EventoService,
    private spinner: NgxSpinnerService,
    private toasrt: ToastrService
  ) {
    this.localeService.use(this.locale);
  }

  ngOnInit(): void {
    this.validation();
    this.carregarEvento();
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
    const eventoIdParam = this.router.snapshot.paramMap.get('id');

    if (eventoIdParam !== null) {
      this.spinner.show();

      this.estadoSalvar = 'put';

      this.eventoService.getEventoById(+eventoIdParam).subscribe({
        next: (evento) => {
          this.evento = { ...evento };
          this.form.patchValue(this.evento);
        },
        error: (err) => {
          this.spinner.hide();
          this.toasrt.error('Erro ao tentar carregar evento', 'Erro!');
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
    });
  }

  public resetForm(): void {
    this.form.reset();
  }

  public cssValidator(campoForm: FormControl): any {
    return { 'is-invalid': campoForm.errors && campoForm.touched };
  }

  public salvarAlteracao(): void {
    this.spinner.show();
    if (this.form.valid) {
      this.estadoSalvar === 'post'
        ? (this.evento = { ...this.form.value })
        : (this.evento = { id: this.evento.id, ...this.form.value });

      this.eventoService[this.estadoSalvar](this.evento)
        .subscribe(
          () =>
            this.toasrt.success('O Evento foi salvo com sucesso', 'Sucesso'),
          (err: any) => {
            this.spinner.hide();
            this.toasrt.error('Erro ao salvar o evento', 'Erro!');
            console.error(err);
          }
        )
        .add(() => this.spinner.hide());
    }
  }
}
