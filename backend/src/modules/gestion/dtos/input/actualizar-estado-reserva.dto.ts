import { IsIn, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EstadosReservasEnum } from '../../enums/estados-reservas.enum.js';


export class ActualizarEstadoReservaDto {
  @ApiProperty({
    description: 'Nuevo estado de la reserva',
    enum: [EstadosReservasEnum.ATENDIDO, EstadosReservasEnum.AUSENTE],
    example: EstadosReservasEnum.ATENDIDO,
  })
  @IsNotEmpty({ message: 'El estado es obligatorio' })
  @IsIn([EstadosReservasEnum.ATENDIDO, EstadosReservasEnum.AUSENTE], {
    message: 'El estado debe ser ATENDIDO o AUSENTE',
  })
  estado: EstadosReservasEnum;
}