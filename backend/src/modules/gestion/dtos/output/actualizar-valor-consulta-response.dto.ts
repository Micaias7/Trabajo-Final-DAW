import { ApiProperty } from '@nestjs/swagger';

export class ActualizarValorConsultaResponseDto {

    @ApiProperty({
        description: 'Mensaje de confirmación',
        example: 'Valor de consulta actualizado correctamente',
    })
    mensaje!: string;

    @ApiProperty({
        description: 'Identificador del médico',
        example: 3,
    })
    idMedico!: number;

    @ApiProperty({
        description: 'Nuevo valor de la consulta',
        example: 25000,
    })
    valorConsulta!: number;
}