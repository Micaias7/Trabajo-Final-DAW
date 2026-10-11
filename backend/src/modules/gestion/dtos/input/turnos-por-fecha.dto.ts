import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';

export class TurnosPorFechaDto {
  @ApiProperty({ example: '2026-10-15', description: 'Fecha en formato YYYY-MM-DD' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'La fecha debe tener formato YYYY-MM-DD' })
  fecha!: string;
}
