
import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ActualizarValorConsultaDto {
 
  @ApiProperty({
    description: 'Nuevo valor de la consulta médica. Debe ser un número entero mayor que cero.',
    example: 20000,
    minimum: 1,
    type: 'integer',
  })
  @IsInt()
  @Min(1)
  valor_consulta!: number;

}
