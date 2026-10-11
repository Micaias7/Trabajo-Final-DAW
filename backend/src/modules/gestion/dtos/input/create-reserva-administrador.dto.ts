import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateReservaAdministradorDto {

    @ApiProperty()
    @IsInt()
    idPaciente!: number;

    @ApiProperty()
    @IsInt()
    idMedico!: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsDateString()
    fechaHora!: string;

}