import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReservaAdministrador } from '../administrador/reservas/reserva-admin-dto';
import { ReservaPaciente } from '../paciente/reservas/reserva-paciente-dto';

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
    return this.http.get<ReservaAdministrador[]>(
      `${this.apiUrl}/administrador`
    );
  }

  obtenerReservasPaciente(): Observable<ReservaPaciente[]> {
    return this.http.get<ReservaPaciente[]>(`${this.apiUrl}/mis-turnos`);
  }

  cancelarReserva(id: number): Observable<CancelarReservaResponse> {
    return this.http.patch<CancelarReservaResponse>(
      `${this.apiUrl}/${id}/cancelar`,
      {}
    );
  }
}
