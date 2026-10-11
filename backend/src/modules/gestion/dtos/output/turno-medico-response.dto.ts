import { ApiProperty } from '@nestjs/swagger';

export class PacienteTurnoDto {
  @ApiProperty() documento!: string;
  @ApiProperty() apellidos!: string;
  @ApiProperty() nombres!: string;
}

export class TurnoMedicoResponseDto {
  @ApiProperty() id!: number;
  @ApiProperty() fecha_hora!: string;
  @ApiProperty() estado!: string;
  @ApiProperty() valor_consulta!: number;
  @ApiProperty({ type: PacienteTurnoDto }) paciente!: PacienteTurnoDto;
}
