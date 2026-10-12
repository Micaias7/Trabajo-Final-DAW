import { ApiProperty } from '@nestjs/swagger';
import { EstadosReservasEnum } from '../../enums/estados-reservas.enum.js';

export class ListReservaPacienteDTO {

    @ApiProperty({
        description: 'Identificador de la reserva',
        example: 1,
    })
    id!: number;

    @ApiProperty({
        description: 'Fecha y hora del turno',
        example: '2026-10-21T11:00:00',
    })
    fechaHora!: string;

    @ApiProperty({
        description: 'Estado actual de la reserva',
        enum: EstadosReservasEnum,
        example: EstadosReservasEnum.ACTIVO,
    })
    estado!: EstadosReservasEnum;

    @ApiProperty({
        description: 'Nombre completo del médico',
        example: 'Juan Pérez',
    })
    medico!: string;

    @ApiProperty({
        description: 'Valor de la consulta al momento de realizar la reserva',
        example: 20000,
    })
    valorConsulta!: number;
}