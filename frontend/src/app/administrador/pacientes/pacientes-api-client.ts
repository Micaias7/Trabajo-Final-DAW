import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { PacienteListadoDto } from './paciente-listado-dto';

@Injectable({
  providedIn: 'root',
})
export class PacientesApiClient {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = '/api/v1/pacientes';

  obtenerPacientes(): Observable<PacienteListadoDto[]> {
    return this.http.get<PacienteListadoDto[]>(this.apiUrl);
  }
}