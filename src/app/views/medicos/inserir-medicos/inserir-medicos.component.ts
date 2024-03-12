import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormsMedicoViewModel } from '../models/forms-medico.view-model';
import { MedicosService } from '../services/medicos.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-inserir-medicos',
  templateUrl: './inserir-medicos.component.html',
  styleUrls: ['./inserir-medicos.component.css']
})
export class InserirMedicosComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private medicosService: MedicosService,
    private toastrService: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nome: new FormControl('', [Validators.required]),
      crm: new FormControl('', [Validators.required, /*Validators.crm*/]),
      telefone: new FormControl('', [Validators.required]),
      endereco: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  campoEstaInvalido(nome: string) {
    return this.form.get(nome)!.touched && this.form.get(nome)!.invalid;
  }

  get crm() {
    return this.form.get('crm');
  }

  gravar() {
    if (this.form.invalid) {
      for (const campo of Object.keys(this.form.controls)) {
        const control = this.form.get(campo);
        if (control?.invalid) {
          this.toastrService.warning(`Campo ${campo} é obrigatório.`);
        }
      }
      return;
    }

    this.medicosService.inserir(this.form.value).subscribe({
      next: () => this.processarSucesso(this.form.value),
      error: (err) => this.processarFalha(err)
    });
  }

  processarSucesso(medico: FormsMedicoViewModel) {
    this.toastrService.success(`O médico "${medico.nome}" foi cadastrado com sucesso!`, 'Sucesso');
    this.router.navigate(['/medicos/listar']);
  }

  processarFalha(err: HttpErrorResponse) {
    const mensagemErro = err.error.erros.length > 0 ? err.error.erros[0] : 'Ocorreu um erro desconhecido.';
    this.toastrService.error(mensagemErro);
  }
}
