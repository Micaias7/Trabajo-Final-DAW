import { ApiProperty } from '@nestjs/swagger';
 
export class MedicoResponseDto {
  @ApiProperty({ example: 1, description: 'Identificador del médico' })
  id!: number;
 
  @ApiProperty({ example: 54321, description: 'Número de matrícula del médico' })
  matricula!: number;
 
  @ApiProperty({
    example: 20000,
    description: 'Valor de consulta actualizado para este médico',
  })
  valor_consulta!: number;
}
 