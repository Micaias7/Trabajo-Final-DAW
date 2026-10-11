import { ApiProperty } from '@nestjs/swagger';
import { EstadosReservasEnum } from '../../enums/estados-reservas.enum.js';

export class ListReservaPacienteDTO {

    @ApiProperty()
    id!: number;

    @ApiProperty()
    fechaHora!: string;

    @ApiProperty()
    estado!: EstadosReservasEnum;

    @ApiProperty()
    medico!: string;

    @ApiProperty()
    valorConsulta!: number;

}