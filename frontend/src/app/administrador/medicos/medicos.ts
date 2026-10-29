import { Component, inject, OnInit, signal } from '@angular/core';
import { MedicosApiClient } from './medicos-api-client';
import { MedicoListadoDto } from './medico-listado-dto';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { RouterLink } from '@angular/router';
import { Template } from '../../template/template';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-medicos',
  imports: [TableModule, ButtonModule, InputNumberModule, FormsModule, RouterLink, Template, CurrencyPipe],
  templateUrl: './medicos.html',
  styleUrl: './medicos.css',
})
export class Medicos implements OnInit {
  private readonly medicosApi = inject(MedicosApiClient);
  private readonly messageService = inject(MessageService);

  medicos = signal<MedicoListadoDto[]>([]);
  cargando = signal(false);
  medicoSeleccionado = signal<MedicoListadoDto | null>(null);
  nuevoValor = signal<string>('');
  errorPrecio = signal('');
  guardando = signal(false);

  ngOnInit(): void {
    this.cargarMedicos();
  }

  cargarMedicos(): void {
    this.cargando.set(true);

    this.medicosApi.obtenerMedicos().subscribe({
      next: (datos) => {
        this.medicos.set(datos);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el listado de médicos.',
        });
      },
    });
  }

  seleccionarMedico(medico: MedicoListadoDto): void {
    this.medicoSeleccionado.set(medico);
    this.nuevoValor.set(String(medico.valor_consulta));
    this.errorPrecio.set('');
  }

  cancelarEdicion(): void {
    this.medicoSeleccionado.set(null);
    this.nuevoValor.set('');
    this.errorPrecio.set('');
  }

  validarPrecio(): boolean {
    const medico = this.medicoSeleccionado();
    const valorIngresado = this.nuevoValor().trim();
    const precio = Number(valorIngresado);

    this.errorPrecio.set('');

    if (!medico) {
      this.errorPrecio.set('Debés seleccionar un médico.');
      return false;
    }

    if (valorIngresado === '' || !Number.isSafeInteger(precio) || precio <= 0) {
      this.errorPrecio.set('El precio debe ser un número entero mayor que cero.');
      return false;
    }

    if (precio === medico.valor_consulta) {
      this.errorPrecio.set('El nuevo precio debe ser diferente al actual.');
      return false;
    }

    return true;
  }

  guardarPrecio(): void {
    if (this.guardando() || !this.validarPrecio()) {
      return;
    }

    const medico = this.medicoSeleccionado();
    if (!medico) return;

    this.guardando.set(true);

    this.medicosApi.actualizarValorConsulta(medico.id, Number(this.nuevoValor())).subscribe({
      next: () => {
        this.guardando.set(false);
        this.cancelarEdicion();
        this.cargarMedicos();

        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Valor de consulta actualizado correctamente.',
        });
      },
      error: () => {
        this.guardando.set(false);

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el valor de consulta.',
        });
      },
    });
  }
}
