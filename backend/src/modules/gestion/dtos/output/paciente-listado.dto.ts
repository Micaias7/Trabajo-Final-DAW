import { ApiProperty } from '@nestjs/swagger';

export class PacienteListadoDto {

  @ApiProperty({ example: 3 })
  id!: number;

  @ApiProperty({ example: 'María' })
  nombres!: string;

  @ApiProperty({ example: 'Gómez' })
  apellidos!: string;

  @ApiProperty({
    example: '30123456',
    description: 'Número de documento del paciente',
  })
  documento!: string;
}