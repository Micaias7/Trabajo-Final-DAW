import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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


  cancelarReserva(id: number): Observable<CancelarReservaResponse> {
    return this.http.patch<CancelarReservaResponse>(
      `${this.apiUrl}/${id}/cancelar`,
      {}
    );
  }
}
