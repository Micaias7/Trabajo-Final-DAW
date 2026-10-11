
import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ActualizarValorConsultaDto {

  @ApiProperty({
    example: 20000,
    description: 'Nuevo valor de la consulta médica',
  })
  @IsInt()
  @Min(1)
  valor_consulta!: number;

}
