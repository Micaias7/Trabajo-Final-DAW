import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateReservaAdministradorDto {

    @ApiProperty({
        description: 'Identificador del paciente',
        example: 2,
    })
    @IsInt()
    idPaciente!: number;

    @ApiProperty({
        description: 'Identificador del médico',
        example: 1,
    })
    @IsInt()
    idMedico!: number;

    @ApiProperty({
        description: 'Fecha y hora del turno en formato AAAA-MM-DDTHH:mm',
        example: '2026-10-21T11:00',
    })
    @IsNotEmpty()
    @IsDateString()
    fechaHora!: string;

}