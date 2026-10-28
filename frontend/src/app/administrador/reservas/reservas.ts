import { Component, inject, OnInit, signal } from '@angular/core';
import { ReservasApiClient } from './reservas-api-client';
import { ReservaAdministrador } from './reserva-admin-dto';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-reservas',
  imports: [DatePipe, RouterLink],
  templateUrl: './reservas.html',
  styleUrl: './reservas.css',
})
export class Reservas implements OnInit {
  private readonly reservasApi = inject(ReservasApiClient);

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
        console.error('Error al obtener reservas:', error);
      },
    });
  }
}
