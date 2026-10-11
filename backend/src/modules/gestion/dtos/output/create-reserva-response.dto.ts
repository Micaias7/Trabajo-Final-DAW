import { ApiProperty } from '@nestjs/swagger';

export class CreateReservaResponseDTO {

  @ApiProperty({
    description: 'Mensaje de confirmación',
    example: 'Reserva realizada exitosamente',
  })
  mensaje!: string;

  @ApiProperty({
    description: 'Identificador del paciente',
    example: 1,    
  })
  idPaciente!: number;

  @ApiProperty({
    description: 'Identificador de la reserva',
    example: 15,
  })
  idReserva!: number;

  @ApiProperty({
    description: 'Fecha y hora del turno',
    example: '2026-10-21T11:00',
  })
  fechaHora!: string;

  @ApiProperty({
    description: 'Nombre completo del médico',
    example: 'Juan Pérez',
  })
  medico!: string;
}