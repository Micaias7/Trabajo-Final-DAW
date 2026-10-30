import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ReservaCreada } from '../../paciente/reservar-turno/reserva-creada-dto';

@Injectable({
  providedIn: 'root',
})
export class ReservarTurnoApiClient {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = '/api/v1/reservas/administrador';

  reservarTurno(
    idPaciente: number,
    idMedico: number,
    fechaHora: string,
  ): Observable<ReservaCreada> {
    return this.http.post<ReservaCreada>(this.apiUrl, { idPaciente, idMedico, fechaHora });
  }

  obtenerHorariosOcupados(idMedico: number, fecha: string): Observable<string[]> {
    return this.http.get<string[]>(`/api/v1/reservas/horarios-ocupados`, {
      params: {
        idMedico: idMedico.toString(),
        fecha,
      },
    });
  }
}
