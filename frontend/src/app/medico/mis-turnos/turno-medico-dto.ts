export type EstadoReserva = 'ACTIVO' | 'ATENDIDO' | 'AUSENTE' | 'CANCELADO';

export interface PacienteTurno {
  documento: string;
  apellidos: string;
  nombres: string;
}


export interface TurnoMedico {
  id: number;
  fecha_hora: string;
  estado: EstadoReserva;
  valor_consulta: number;
  paciente: PacienteTurno;
}

export type EstadoReservaResponse = TurnoMedico;