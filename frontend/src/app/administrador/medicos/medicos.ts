import { Component, inject, OnInit, signal } from '@angular/core';
import { MedicosApiClient } from './medicos-api-client';
import { MedicoListadoDto } from './medico-listado-dto';

@Component({
  selector: 'app-medicos',
  imports: [],
  templateUrl: './medicos.html',
  styleUrl: './medicos.css',
})
export class Medicos implements OnInit {

  private readonly medicosApi = inject(MedicosApiClient);

  medicos = signal<MedicoListadoDto[]>([]);
  cargando = signal(false);
  error = signal('');
  medicoSeleccionado = signal<MedicoListadoDto | null>(null);
  nuevoValor = signal<string>('');
  errorPrecio = signal('');
  guardando = signal(false);
  mensajeExito = signal('');

  ngOnInit(): void {
    this.cargarMedicos();
  }

  cargarMedicos(): void {
    this.cargando.set(true);
    this.error.set('');

    this.medicosApi.obtenerMedicos().subscribe({
      next: (datos) => {
        this.medicos.set(datos);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el listado de médicos.');
        this.cargando.set(false);
      },
    });
  }
  
  seleccionarMedico(medico: MedicoListadoDto): void {
    this.medicoSeleccionado.set(medico);
    this.nuevoValor.set(String(medico.valor_consulta));
    this.errorPrecio.set('');
    this.mensajeExito.set('');
  }
  
  cancelarEdicion(): void {
    this.medicoSeleccionado.set(null);
    this.nuevoValor.set('');
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

    if (
      valorIngresado === '' ||
      !Number.isSafeInteger(precio) ||
      precio <= 0
    ) {
      this.errorPrecio.set(
        'El precio debe ser un número entero mayor que cero.'
      );
      return false;
    }

    if (precio === medico.valor_consulta) {
      this.errorPrecio.set(
        'El nuevo precio debe ser diferente al actual.'
      );
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
    this.mensajeExito.set('');

    this.medicosApi.actualizarValorConsulta(
      medico.id,
      Number(this.nuevoValor())
    ).subscribe({
      next: () => {
        this.guardando.set(false);
        this.cancelarEdicion();
        this.cargarMedicos();
        this.mensajeExito.set('Precio actualizado correctamente.');
      },
      error: () => {
        this.guardando.set(false);
        this.errorPrecio.set('No se pudo actualizar el precio.');
      },
    });
  }

}

