import { ApiProperty } from '@nestjs/swagger';
import { EstadosReservasEnum } from '../../enums/estados-reservas.enum.js';

export class PacienteTurnoDto {
  @ApiProperty({ example: '22222222', description: 'Documento del paciente' })
  documento!: string;

  @ApiProperty({ example: 'Perez', description: 'Apellidos del paciente' })
  apellidos!: string;

  @ApiProperty({ example: 'Juan', description: 'Nombres del paciente' })
  nombres!: string;
}

export class TurnoMedicoResponseDto {
  @ApiProperty({ example: 1, description: 'Identificador de la reserva' })
  id!: number;

  @ApiProperty({
    example: '2026-10-15T13:00:00.000Z',
    description: 'Fecha y hora del turno (los turnos duran una hora)',
  })
  fecha_hora!: string;

  @ApiProperty({
    enum: EstadosReservasEnum,
    example: EstadosReservasEnum.ACTIVO,
    description: 'Estado del turno: ACTIVO, ATENDIDO, AUSENTE o CANCELADO',
  })
  estado!: string;

  @ApiProperty({
    example: 20000,
    description:
      'Valor de la consulta congelado al momento de realizar la reserva',
  })
  valor_consulta!: number;

  @ApiProperty({
    type: PacienteTurnoDto,
    description: 'Datos del paciente que reservó el turno',
  })
  paciente!: PacienteTurnoDto;
}