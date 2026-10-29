import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { MedicoApiClient } from './medico-api-client';
import { EstadoReserva, TurnoMedico } from './turno-medico-dto';
import { formatearFechaISO } from './fechas-turnos.util';
import { Template } from '../../template/template';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

type SeveridadTag = 'success' | 'info' | 'warn' | 'danger' | 'secondary';

@Component({
  selector: 'app-mis-turnos-medico',
  imports: [
    DatePipe,
    DecimalPipe,
    FormsModule,
    RouterLink,
    TableModule,
    ButtonModule,
    DatePicker,
    Tag,
    Template,
    ConfirmDialogModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './mis-turnos.html',
  styleUrl: './mis-turnos.css',
})
export class MisTurnos implements OnInit, OnDestroy {
  private readonly medicoApi: MedicoApiClient = inject(MedicoApiClient);
  private readonly messageService: MessageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  private suscripcionTurnos?: Subscription;

  fecha = signal<Date | null>(new Date());
  turnos = signal<TurnoMedico[]>([]);
  cargando = signal<boolean>(false);

  ngOnInit(): void {
    this.cargarTurnos();
  }

  ngOnDestroy(): void {
    this.suscripcionTurnos?.unsubscribe();
  }

  cambiarFecha(nuevaFecha: Date | null): void {
    this.fecha.set(nuevaFecha);
    this.cargarTurnos();
  }

  diaAnterior(): void {
    const fechaActual = this.fecha() ?? new Date();
    const nuevaFecha = new Date(fechaActual);

    nuevaFecha.setDate(nuevaFecha.getDate() - 1);

    this.cambiarFecha(nuevaFecha);
  }

  diaSiguiente(): void {
    const fechaActual = this.fecha() ?? new Date();
    const nuevaFecha = new Date(fechaActual);

    nuevaFecha.setDate(nuevaFecha.getDate() + 1);

    this.cambiarFecha(nuevaFecha);
  }

  cargarTurnos(): void {
    // Si el médico cambia de fecha rápido, se cancela la consulta anterior.
    this.suscripcionTurnos?.unsubscribe();

    const fecha = this.fecha();

    if (!fecha) {
      this.turnos.set([]);
      this.cargando.set(false);
      return;
    }

    this.cargando.set(true);

    this.suscripcionTurnos = this.medicoApi
      .obtenerTurnos(formatearFechaISO(fecha))
      .subscribe({
        next: (turnos) => {
          this.turnos.set(turnos);
          this.cargando.set(false);
        },
        error: (error: HttpErrorResponse) => {
          this.cargando.set(false);
          this.turnos.set([]);
          this.mostrarError(error, 'No se pudieron obtener los turnos');
        },
      });
  }

  marcar(turno: TurnoMedico, estado: 'ATENDIDO' | 'AUSENTE'): void {
    this.medicoApi.actualizarEstado(turno.id, estado).subscribe({
      next: (actualizado) => {
        this.turnos.update((lista) =>
          lista.map((t) =>
            t.id === actualizado.id
              ? { ...t, estado: actualizado.estado }
              : t,
          ),
        );

        this.messageService.add({
          severity: 'success',
          summary: 'Turno actualizado',
          detail: `El turno quedó marcado como ${actualizado.estado}`,
        });
      },
      error: (error: HttpErrorResponse) => {
        this.mostrarError(error, 'No se pudo actualizar el turno');
      },
    });
  }

  confirmarCambioEstado(
    turno: TurnoMedico,
    estado: 'ATENDIDO' | 'AUSENTE',
  ): void {
    this.confirmationService.confirm({
      header: 'Confirmar cambio de estado',
      message: `¿Estás seguro de que querés marcar este turno como ${estado}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.marcar(turno, estado);
      },
    });
  }

  // Solo se puede marcar un turno ACTIVO cuyo horario ya comenzó.
  puedeMarcar(turno: TurnoMedico): boolean {
    return (
      turno.estado === 'ACTIVO' &&
      new Date(turno.fecha_hora).getTime() <= Date.now()
    );
  }

  severidad(estado: EstadoReserva): SeveridadTag {
    switch (estado) {
      case 'ATENDIDO':
        return 'success';
      case 'AUSENTE':
        return 'warn';
      case 'CANCELADO':
        return 'danger';
      default:
        return 'info';
    }
  }

  private mostrarError(
    error: HttpErrorResponse,
    porDefecto: string,
  ): void {
    const mensaje = error.error?.message;

    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: Array.isArray(mensaje)
        ? mensaje.join('. ')
        : (mensaje ?? porDefecto),
    });
  }
}
