
import { ApiProperty } from '@nestjs/swagger';

export class MedicoListadoDto {
  @ApiProperty({ example: 2 })
  id!: number;

  @ApiProperty({ example: 12345 })
  matricula!: number;

  @ApiProperty({ example: 'Juan' })
  nombres!: string;

  @ApiProperty({ example: 'Pérez' })
  apellidos!: string;

  @ApiProperty({
    example: 25000,
    description: 'Valor actual de la consulta médica',
  })
  valor_consulta!: number;
}
