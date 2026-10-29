import { DatePipe, CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ReservasApiClient as ReservasPacienteApiClient } from './reserva-api-client';
import { ReservasApiClient as ReservasCompartidasApiClient } from '../../compartido/reservas-api-client';
import { ReservaPacienteDto } from './reserva-paciente-dto';
import { Template } from '../../template/template';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-reservas-paciente',
  imports: [DatePipe, CurrencyPipe, RouterLink, ButtonModule, Template, ConfirmDialogModule],
  providers: [ConfirmationService],
  templateUrl: './reservas.html',
  styleUrl: './reservas.css',
})
export class ReservasPaciente implements OnInit {
  private readonly reservasApi = inject(ReservasPacienteApiClient);
  private readonly reservasApiCancelar = inject(ReservasCompartidasApiClient);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  reservas = signal<ReservaPacienteDto[]>([]);
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

  puedeCancelar(reserva: ReservaPacienteDto): boolean {
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

  confirmarCancelacion(reserva: ReservaPacienteDto): void {
    this.confirmationService.confirm({
      header: 'Confirmar cancelación',
      message: '¿Estás seguro de que querés cancelar este turno?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, cancelar',
      rejectLabel: 'Volver',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.cancelarReserva(reserva);
      },
    });
  }

  cancelarReserva(reserva: ReservaPacienteDto): void {
    if (this.cancelandoId() !== null || !this.puedeCancelar(reserva)) {
      return;
    }

    this.cancelandoId.set(reserva.id);

    this.reservasApiCancelar.cancelarReserva(reserva.id).subscribe({
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
