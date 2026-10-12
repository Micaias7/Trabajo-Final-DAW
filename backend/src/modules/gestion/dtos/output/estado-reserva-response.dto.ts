import { ApiProperty } from '@nestjs/swagger';
import { EstadosReservasEnum } from '../../enums/estados-reservas.enum.js';
import { PacienteTurnoDto } from './turno-medico-response.dto.js';
 
export class EstadoReservaResponseDto {
  @ApiProperty({ example: 1, description: 'Identificador de la reserva' })
  id!: number;
 
  @ApiProperty({
    example: '2026-10-15T13:00:00.000Z',
    description: 'Fecha y hora del turno (los turnos duran una hora)',
  })
  fecha_hora!: string;
 
  @ApiProperty({
    enum: EstadosReservasEnum,
    example: EstadosReservasEnum.ATENDIDO,
    description: 'Estado actualizado de la reserva: ATENDIDO o AUSENTE',
  })
  estado!: EstadosReservasEnum;
 
  @ApiProperty({
    example: 20000,
    description: 'Valor de la consulta congelado al momento de realizar la reserva',
  })
  valor_consulta!: number;
 
  @ApiProperty({
    type: PacienteTurnoDto,
    description: 'Datos del paciente que reservó el turno',
  })
  paciente!: PacienteTurnoDto;
}