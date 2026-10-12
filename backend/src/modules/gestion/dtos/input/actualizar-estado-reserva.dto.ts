
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum EstadoReserva {
  ACTIVO = 'ACTIVO',
  ATENDIDO = 'ATENDIDO',
  AUSENTE = 'AUSENTE',
}

export class ActualizarEstadoReservaDto {
  @ApiProperty({
    description: 'Nuevo estado de la reserva',
    enum: [EstadoReserva.ATENDIDO, EstadoReserva.AUSENTE],
    example: EstadoReserva.ATENDIDO,
  })
  @IsNotEmpty({ message: 'El estado es obligatorio' })
  @IsEnum([EstadoReserva.ATENDIDO, EstadoReserva.AUSENTE], {
    message: 'El estado debe ser ATENDIDO o AUSENTE',
  })
  estado: EstadoReserva;
}