import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReservaPacienteDto } from './reserva-paciente-dto';

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

  obtenerReservasPaciente(): Observable<ReservaPacienteDto[]> {
    return this.http.get<ReservaPacienteDto[]>(`${this.apiUrl}/mis-turnos`);
  }

  obtenerHorariosOcupados(idMedico: number, fecha: string): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.apiUrl}/horarios-ocupados`,
      {
        params: {
          idMedico: idMedico.toString(),
          fecha
        }
      }
    );
  }

}
