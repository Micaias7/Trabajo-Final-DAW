import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ReservasApiClient } from '../../reservas/reservas-api-client';
import { ReservaPaciente } from './reserva-paciente-dto';

@Component({
  selector: 'app-reservas-paciente',
  imports: [DatePipe, RouterLink, ButtonModule],
  templateUrl: './reservas.html',
  styleUrl: './reservas.css',
})
export class ReservasPaciente implements OnInit {
  private readonly reservasApi = inject(ReservasApiClient);
  private readonly messageService = inject(MessageService);

  reservas = signal<ReservaPaciente[]>([]);
  cargando = signal(false);
  error = signal('');
  cancelandoId = signal<number | null>(null);

  ngOnInit(): void {
    this.cargarReservas();
  }

  cargarReservas(): void {
    this.cargando.set(true);
    this.error.set('');

    this.reservasApi.obtenerReservasPaciente().subscribe({
      next: (datos) => {
        this.reservas.set(datos);
        this.cargando.set(false);
      },
      error: (error: unknown) => {
        this.error.set(this.obtenerMensajeError(error));
        this.cargando.set(false);
      },
    });
  }

  puedeCancelar(reserva: ReservaPaciente): boolean {
    if (reserva.estado !== 'ACTIVO') {
      return false;
    }

    const fechaTurno = new Date(reserva.fechaHora);
    if (Number.isNaN(fechaTurno.getTime())) {
      return false;
    }

    const inicioDiaTurno = new Date(fechaTurno);
    inicioDiaTurno.setHours(0, 0, 0, 0);

    return Date.now() < inicioDiaTurno.getTime();
  }

  cancelarReserva(reserva: ReservaPaciente): void {
    if (this.cancelandoId() !== null || !this.puedeCancelar(reserva)) {
      return;
    }

    this.cancelandoId.set(reserva.id);

    this.reservasApi.cancelarReserva(reserva.id).subscribe({
      next: (respuesta) => {
        this.cancelandoId.set(null);
        this.messageService.add({
          severity: 'success',
          summary: 'Turno cancelado',
          detail: respuesta.mensaje,
        });
        this.cargarReservas();
      },
      error: (error: unknown) => {
        this.cancelandoId.set(null);
        this.messageService.add({
          severity: 'error',
          summary: 'No se pudo cancelar el turno',
          detail: this.obtenerMensajeError(error),
        });
      },
    });
  }

  private obtenerMensajeError(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const mensaje = error.error?.message;
      if (typeof mensaje === 'string') {
        return mensaje;
      }
    }

    return 'No se pudieron obtener las reservas.';
  }
}
