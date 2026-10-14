import { ApiProperty } from '@nestjs/swagger';

export class CancelarReservaResponseDTO {
  @ApiProperty({
    description: 'Identificador del turno cancelado',
    example: 15,
  })
  id!: number;
}
