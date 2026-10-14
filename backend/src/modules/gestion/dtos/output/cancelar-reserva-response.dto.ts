import { ApiProperty } from '@nestjs/swagger';
import { EstadosReservasEnum } from '../../enums/estados-reservas.enum.js';

export class CancelarReservaResponseDTO {

  @ApiProperty({
    description: 'Mensaje de confirmación',
    example: 'Turno cancelado correctamente',
  })
  mensaje!: string;

  @ApiProperty({
    description: 'Identificador de la reserva cancelada',
    example: 3,
  })
  idReserva!: number;

  @ApiProperty({
    description: 'Nuevo estado de la reserva',
    enum: EstadosReservasEnum,
    example: EstadosReservasEnum.CANCELADO,
  })
  estado!: EstadosReservasEnum;
}