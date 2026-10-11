import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty } from 'class-validator';

export class CreateReservaDto {

    @ApiProperty()
    @IsInt()
    idMedico!: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsDateString()
    fechaHora!: string;

}