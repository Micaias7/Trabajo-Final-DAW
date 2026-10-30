import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { ReservarTurnoApiClient } from './reservar-turno-api-client';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MedicosApiClient } from '../../administrador/medicos/medicos-api-client';
import { MedicoListadoDto } from '../../administrador/medicos/medico-listado-dto';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Template } from '../../template/template';

@Component({
  selector: 'app-reservar-turno',
  imports: [ButtonModule, FormsModule, RouterLink, Template],
  templateUrl: './reservar-turno.html',
  styleUrl: './reservar-turno.css',
})
export class ReservarTurno implements OnInit, OnDestroy {
  private readonly reservarTurnoApi = inject(ReservarTurnoApiClient);
  private readonly medicosApi = inject(MedicosApiClient);
  private readonly messageService = inject(MessageService);
  private consultaHorarios?: Subscription;

  idMedico: number | null = null;
  fechaHora: string = '';
  fecha: string = '';
  hora: string = '';
  horarios: string[] = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
  fechaMinima: string = '';
  fechaMaxima: string = '';
  medicos = signal<MedicoListadoDto[]>([]);
  horariosOcupados = signal<string[]>([]);
  cargandoHorarios = signal(false);
  errorHorarios = signal(false);
  guardandoReserva = signal(false);

  ngOnDestroy(): void {
    this.consultaHorarios?.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();

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
        alert('No se pudo obtener la lista de médicos.');
      },
    });
  }

  reservarTurno(): void {
    if (this.guardandoReserva()) {
      return;
    }

    if (
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
        summary: 'Campos incompletos',
        detail: 'Por favor, seleccioná un médico, una fecha y un horario.',
      });
      return;
    }

    this.fechaHora = `${this.fecha}T${this.hora}`;
    this.guardandoReserva.set(true);

    this.reservarTurnoApi.reservarTurno(this.idMedico, this.fechaHora).subscribe({
      next: () => {
        this.guardandoReserva.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: '¡Turno reservado correctamente!',
        });
        this.hora = '';
        this.cargarHorariosOcupados();
      },
      error: (error) => {
        this.guardandoReserva.set(false);
        console.error('Error al reservar turno:', error);

        const mensaje = error.error?.message;

        if (
          error.status === 400 &&
          String(mensaje).includes('El médico ya tiene un turno reservado')
        ) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Horario ocupado',
            detail: 'Este horario ya está reservado. Por favor, seleccioná otro.',
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo reservar el turno.',
          });
        }
      },
    });
  }

  cargarHorariosOcupados(): void {
    this.consultaHorarios?.unsubscribe();

    this.hora = '';
    this.horariosOcupados.set([]);
    this.errorHorarios.set(false);

    if (this.idMedico === null || !this.fecha) {
      return;
    }

    this.cargandoHorarios.set(true);

    this.consultaHorarios = this.reservarTurnoApi
      .obtenerHorariosOcupados(this.idMedico, this.fecha)
      .subscribe({
        next: (horarios) => {
          this.horariosOcupados.set(horarios);
          this.cargandoHorarios.set(false);
          this.errorHorarios.set(false);
        },
        error: (error) => {
          console.error('Error al consultar horarios ocupados:', error);
          this.cargandoHorarios.set(false);
          this.errorHorarios.set(true);

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron consultar los horarios disponibles.',
          });
        },
      });
  }

  horarioOcupado(horario: string): boolean {
    return this.horariosOcupados().includes(horario);
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

