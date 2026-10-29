import { Component, inject, signal, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { MedicosApiClient } from '../medicos/medicos-api-client';
import { MedicoListadoDto } from '../medicos/medico-listado-dto';
import { PacientesApiClient } from '../pacientes/pacientes-api-client';
import { PacienteListadoDto } from '../pacientes/paciente-listado-dto';
import { ReservarTurnoApiClient } from './reservar-turno-api-client';
import { ReservasApiClient } from '../reservas/reservas-api-client';
import { ReservaAdministrador } from '../reservas/reserva-admin-dto';

@Component({
  selector: 'app-reservar-turno',
  imports: [ButtonModule, FormsModule],
  templateUrl: './reservar-turno.html',
  styleUrl: './reservar-turno.css',
})
export class ReservarTurno implements OnInit {

  private readonly messageService = inject(MessageService);
  private readonly medicosApi = inject(MedicosApiClient);
  private readonly pacientesApi = inject(PacientesApiClient);
  private readonly reservasApi = inject(ReservarTurnoApiClient);
  private readonly reservasConsultaApi = inject(ReservasApiClient);

medicos = signal<MedicoListadoDto[]>([]);
pacientes = signal<PacienteListadoDto[]>([]);
reservas = signal<ReservaAdministrador[]>([]);

  idPaciente: number | null = null;
  idMedico: number | null = null;

  fecha: string = '';
  hora: string = '';

  horarios: string[] = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00'
  ];

  fechaMinima: string = '';
  fechaMaxima: string = '';

  ngOnInit(): void {
    this.cargarMedicos();
    this.cargarPacientes();
    this.cargarReservas();

    const hoy = new Date();
    const fechaLimite = new Date();

    fechaLimite.setDate(hoy.getDate() + 30);

    const formatearFecha = (fecha: Date): string => {
      const anio = fecha.getFullYear();
      const mes = String(fecha.getMonth() + 1).padStart(2, '0');
      const dia = String(fecha.getDate()).padStart(2, '0');

      return `${anio}-${mes}-${dia}`;
    };

    this.fechaMinima = formatearFecha(hoy);
    this.fechaMaxima = formatearFecha(fechaLimite);
  }
  cargarMedicos(): void {
  this.medicosApi.obtenerMedicos().subscribe({
    next: (datos) => {
      this.medicos.set(datos);
    },
    error: (error) => {
      console.error('Error al cargar médicos:', error);

      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo obtener la lista de médicos.',
      });
    },
    
  });
}

cargarPacientes(): void {
  this.pacientesApi.obtenerPacientes().subscribe({
    next: (datos) => {
      this.pacientes.set(datos);
    },
    error: (error) => {
      console.error('Error al cargar pacientes:', error);

      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo obtener la lista de pacientes.',
      });
    },
  });
}
reservarTurno(): void {

  if (
    this.idPaciente === null ||
    this.idMedico === null ||
    !this.fecha ||
    !this.hora
  ) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Datos incompletos',
      detail: 'Debe completar todos los campos.',
    });
    return;
  }

  const fechaHora = `${this.fecha}T${this.hora}`;

  this.reservasApi.reservarTurno(
    this.idPaciente,
    this.idMedico,
    fechaHora
  ).subscribe({
    next: () => {
      this.messageService.add({
        severity: 'success',
        summary: 'Reserva realizada',
        detail: 'El turno se reservó correctamente.',
      });

      this.idPaciente = null;
      this.idMedico = null;
      this.fecha = '';
      this.hora = '';
      this.cargarReservas();
    },
    error: (error) => {
      console.error('Error al reservar turno:', error);

      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error.error?.message || 'No se pudo reservar el turno.',
      });
    },
  });
}
cargarReservas(): void {
  this.reservasConsultaApi.obtenerReservasAdministrador().subscribe({
    next: (datos) => {
      this.reservas.set(datos);
    },
    error: (error) => {
      console.error('Error al cargar reservas:', error);
    },
  });
}
horarioOcupado(horario: string): boolean {
  if (this.idMedico === null || !this.fecha) {
    return false;
  }

  return this.reservas().some((reserva) => {
    const fechaReserva = new Date(reserva.fechaHora);

    const fechaLocal = [
      fechaReserva.getFullYear(),
      String(fechaReserva.getMonth() + 1).padStart(2, '0'),
      String(fechaReserva.getDate()).padStart(2, '0')
    ].join('-');

    const horaLocal = [
      String(fechaReserva.getHours()).padStart(2, '0'),
      String(fechaReserva.getMinutes()).padStart(2, '0')
    ].join(':');

    return (
      reserva.idMedico === this.idMedico &&
      fechaLocal === this.fecha &&
      horaLocal === horario &&
      reserva.estado === 'ACTIVO'
    );
  });
}
}