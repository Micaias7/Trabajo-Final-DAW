import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ReservasApiClient } from './reservas-api-client';
import { ReservaAdministrador } from './reserva-admin-dto';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Template } from '../../template/template';
import { ReservasApiClient as ReservasCompartidasApiClient } from '../../compartido/reservas-api-client';


@Component({
  selector: 'app-reservas',
  imports: [DatePipe, CurrencyPipe, RouterLink, TableModule, ButtonModule, Template, ConfirmDialogModule],
  providers: [ConfirmationService],
  templateUrl: './reservas.html',
  styleUrl: './reservas.css',
})
export class Reservas implements OnInit {
  private readonly reservasApi = inject(ReservasApiClient);
  private readonly reservasApiCancelar = inject(ReservasCompartidasApiClient);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  reservas = signal<ReservaAdministrador[]>([]);
  cancelandoId = signal<number | null>(null);

  ngOnInit(): void {
    this.cargarReservas();
  }

  cargarReservas(): void {
    this.reservasApi.obtenerReservasAdministrador().subscribe({
      next: (datos) => {
        this.reservas.set(datos);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron obtener las reservas',
        });
      },
    });
  }

  confirmarCancelacion(reserva: ReservaAdministrador): void {
    this.confirmationService.confirm({
      header: 'Confirmar cancelación',
      message: `¿Estás seguro de que querés cancelar la reserva N.º ${reserva.id}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, cancelar',
      rejectLabel: 'Volver',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.cancelarReserva(reserva);
      },
    });
  }

  cancelarReserva(reserva: ReservaAdministrador): void {
    if (this.cancelandoId() !== null) {
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

    return 'Ocurrió un error al cancelar el turno.';
  }
}
