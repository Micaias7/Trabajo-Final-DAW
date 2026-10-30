import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { MedicosApiClient } from '../medicos/medicos-api-client';
import { MedicoListadoDto } from '../medicos/medico-listado-dto';
import { PacientesApiClient } from '../pacientes/pacientes-api-client';
import { PacienteListadoDto } from '../pacientes/paciente-listado-dto';
import { ReservarTurnoApiClient } from './reservar-turno-api-client';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Template } from '../../template/template';

@Component({
  selector: 'app-reservar-turno',
  imports: [ButtonModule, FormsModule, RouterLink, Template],
  templateUrl: './reservar-turno.html',
  styleUrl: './reservar-turno.css',
})
export class ReservarTurno implements OnInit, OnDestroy {
  private readonly messageService = inject(MessageService);
  private readonly medicosApi = inject(MedicosApiClient);
  private readonly pacientesApi = inject(PacientesApiClient);
  private readonly reservasApi = inject(ReservarTurnoApiClient);

  horariosOcupados = signal<string[]>([]);
  cargandoHorarios = signal(false);
  errorHorarios = signal(false);

  private consultaHorarios?: Subscription;

  medicos = signal<MedicoListadoDto[]>([]);
  pacientes = signal<PacienteListadoDto[]>([]);
  guardandoReserva = signal(false);

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
    '15:00',
  ];

  fechaMinima: string = '';
  fechaMaxima: string = '';

  ngOnDestroy(): void {
    this.consultaHorarios?.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();
    this.cargarPacientes();

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

  horarioOcupado(horario: string): boolean {
    return this.horariosOcupados().includes(horario);
  }

  reservarTurno(): void {
    if (this.guardandoReserva()) {
      return;
    }

    if (
      this.idPaciente === null ||
      this.idMedico === null ||
      !this.fecha ||
      !this.hora ||
      this.cargandoHorarios() ||
      this.errorHorarios() ||
      this.horarioOcupado(this.hora) ||
      this.horarioPasado(this.hora)
    ) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Reserva no disponible',
        detail: 'Completá los datos y seleccioná un horario disponible.',
      });
      return;
    }

    const fechaHora = `${this.fecha}T${this.hora}`;
    this.guardandoReserva.set(true);

    this.reservasApi
      .reservarTurno(this.idPaciente, this.idMedico, fechaHora)
      .subscribe({
        next: () => {
          this.guardandoReserva.set(false);

          this.messageService.add({
            severity: 'success',
            summary: 'Reserva realizada',
            detail: 'El turno se reservó correctamente.',
          });

          this.idPaciente = null;
          this.idMedico = null;
          this.fecha = '';
          this.hora = '';

          this.consultaHorarios?.unsubscribe();
          this.horariosOcupados.set([]);
          this.errorHorarios.set(false);
        },
        error: (error) => {
          this.guardandoReserva.set(false);
          console.error('Error al reservar turno:', error);

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'No se pudo reservar el turno.',
          });
        },
      });
  }

  cargarHorariosOcupados(): void {
    this.consultaHorarios?.unsubscribe();

    this.hora = '';
    this.horariosOcupados.set([]);
    this.errorHorarios.set(false);

    if (this.idMedico === null || !this.fecha) {
      this.cargandoHorarios.set(false);
      return;
    }

    this.cargandoHorarios.set(true);

    this.consultaHorarios = this.reservasApi
      .obtenerHorariosOcupados(this.idMedico, this.fecha)
      .subscribe({
        next: (horarios) => {
          this.horariosOcupados.set(horarios);
          this.cargandoHorarios.set(false);
        },
        error: (error) => {
          console.error('Error al consultar horarios:', error);

          this.errorHorarios.set(true);
          this.cargandoHorarios.set(false);

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron consultar los horarios disponibles.',
          });
        },
      });
  }

  horarioPasado(horario: string): boolean {
    if (!this.fecha) {
      return false;
    }

    const ahora = new Date();
    const fechaHoraTurno = new Date(`${this.fecha}T${horario}:00`);

    return fechaHoraTurno <= ahora;
  }
}
