import { Component } from '@angular/core';


interface Turno {
  id: number;
  medico: string;
  fecha: string;
  estado: string;
  observacion?: string;
}

@Component({
  selector: 'app-inicio',
  imports: [],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})


export class Inicio {
  titulo: string = 'Bienvenido, paciente';
  botonDeshabilitado: boolean = false;
  turnoSeleccionado: Turno | null = null;

  especialidades: string[] = [
    'Cardiología',
    'Pediatría',
    'Dermatología'
  ];

  turnos: Turno[] = [
    {
      id: 1,
      medico: 'Dr. García',
      fecha: '28/10/2026',
      estado: 'ACTIVO',
      observacion: 'Control anual'
    },
    {
      id: 2,
      medico: 'Dra. López',
      fecha: '30/10/2026',
      estado: 'CANCELADO'
    }
  ];

  solicitarTurno() {
    this.botonDeshabilitado = true;
    this.titulo = 'Solicitud de turno iniciada';
  }

  verTurno(id: number) {
    this.turnoSeleccionado =
      this.turnos.find(turno => turno.id === id) ?? null;
  }

  cerrarDetalle() {
    this.turnoSeleccionado = null;
  }
}