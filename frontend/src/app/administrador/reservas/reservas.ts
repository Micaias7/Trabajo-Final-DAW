import { Component, inject, OnInit, signal } from '@angular/core';
import { ReservasApiClient } from './reservas-api-client';
import { ReservaAdministrador } from './reserva-admin-dto';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-reservas',
  imports: [DatePipe, RouterLink, TableModule, ButtonModule],
  templateUrl: './reservas.html',
  styleUrl: './reservas.css',
})
export class Reservas implements OnInit {
  private readonly reservasApi = inject(ReservasApiClient);
  private readonly messageService = inject(MessageService);

  reservas = signal<ReservaAdministrador[]>([]);

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
}
