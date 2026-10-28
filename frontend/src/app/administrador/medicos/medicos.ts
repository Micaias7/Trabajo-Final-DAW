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
}

