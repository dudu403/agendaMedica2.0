import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormsMedicoViewModel } from '../models/forms-medico.view-model';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicosService } from '../services/medicos.service';
import { map } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-editar-medicos',
  templateUrl: './editar-medicos.component.html',
  styleUrls: ['./editar-medicos.component.css']
})
export class EditarMedicosComponent implements OnInit {
  form!: FormGroup;
  medicoVM!: FormsMedicoViewModel;

  constructor(
    private formBuilder: FormBuilder,
    private medicosService: MedicosService,
    private toastrService: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nome: new FormControl('', [Validators.required]),
      crm: new FormControl('', [Validators.required]),
      telefone: new FormControl('', [Validators.required]), // Adicionei o campo de telefone
      endereco: new FormControl('', [Validators.required]), // Adicionei o campo de endereço
      email: new FormControl('', [Validators.required, Validators.email]) // Adicionei o campo de email com validação de email
    });

    this.route.data.pipe(map((dados) => dados['medico'])).subscribe({
      next: (medico) => this.obterMedico(medico),
      error: (erro) => this.processarFalha(erro)
    });
  }

  gravar(): void {
    if (this.form.invalid) {
      for (const campo of Object.keys(this.form.controls)) {
        this.form.get(campo)?.markAsTouched(); // Marca todos os campos como tocados para exibir mensagens de erro
      }
      return;
    }

    this.medicoVM = this.form.value;

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      return;
    }

    this.medicosService.editar(id, this.medicoVM).subscribe({
      next: () => this.processarSucesso(this.medicoVM),
      error: (erro) => this.processarFalha(erro)
    });
  }

  obterMedico(medico: FormsMedicoViewModel): void {
    this.medicoVM = medico;
    this.form.patchValue(this.medicoVM);
  }

  processarSucesso(medico: FormsMedicoViewModel): void {
    this.toastrService.success(`O médico "${medico.nome}" foi editado com sucesso!`, 'Sucesso');
    this.router.navigate(['/medicos/listar']);
  }

  processarFalha(err: HttpErrorResponse): void {
    const mensagemErro = err.error.erros?.length > 0 ? err.error.erros[0] : 'Ocorreu um erro desconhecido.';
    this.toastrService.error(mensagemErro);
  }
}
