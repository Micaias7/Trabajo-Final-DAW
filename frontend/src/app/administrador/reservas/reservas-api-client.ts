import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReservaAdministrador } from './reserva-admin-dto';

export interface CancelarReservaResponse {
  mensaje: string;
  idReserva: number;
  estado: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReservasApiClient {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = '/api/v1/reservas';

  obtenerReservasAdministrador(): Observable<ReservaAdministrador[]> {
    return this.http.get<ReservaAdministrador[]>(`${this.apiUrl}/administrador`);
  }
}