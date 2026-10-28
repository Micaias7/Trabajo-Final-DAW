
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MedicoListadoDto } from './medico-listado-dto';

@Injectable({
  providedIn: 'root',
})
export class MedicosApiClient {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = '/api/v1/medicos';

    obtenerMedicos(): Observable<MedicoListadoDto[]> {
        return this.http.get<MedicoListadoDto[]>(this.apiUrl);
    }
  
    actualizarValorConsulta(
        id: number,
        valorConsulta: number
    ): Observable<{
        mensaje: string;
        idMedico: number;
        valorConsulta: number;
    }> {
      return this.http.patch<{
        mensaje: string;
        idMedico: number;
        valorConsulta: number;
    }>(
        `${this.apiUrl}/${id}/valor-consulta`,
        { valor_consulta: valorConsulta }
    );
    }
}
