import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReservaCreada } from './reserva-creada-dto';

@Injectable({
  providedIn: 'root',
})
export class ReservarTurnoApiClient {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = '/api/v1/reservas';
reservarTurno(idMedico: number, fechaHora: string): Observable<ReservaCreada> {
  return this.http.post<ReservaCreada>(
    this.apiUrl,
    { idMedico, fechaHora }
  );
}
}