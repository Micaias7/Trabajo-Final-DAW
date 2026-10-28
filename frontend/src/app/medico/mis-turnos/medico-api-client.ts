import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EstadoReservaResponse, TurnoMedico } from './turno-medico-dto';

@Injectable({
  providedIn: 'root',
})
export class MedicoApiClient {
  private readonly http: HttpClient = inject(HttpClient);

  private readonly apiUrl = '/api/v1/medicos';

  obtenerTurnos(fecha: string): Observable<TurnoMedico[]> {
    return this.http.get<TurnoMedico[]>(`${this.apiUrl}/mis-turnos`, {
      params: { fecha },
    });
  }

  actualizarEstado(
    idReserva: number,
    estado: 'ATENDIDO' | 'AUSENTE',
  ): Observable<EstadoReservaResponse> {
    return this.http.patch<EstadoReservaResponse>(`${this.apiUrl}/${idReserva}/estado`, {
      estado,
    });
  }
}