import { ApiTags, ApiOperation,  ApiCreatedResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiBearerAuth, ApiOkResponse, ApiNotFoundResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Controller , Body, Post , Get, Patch, Param, ParseIntPipe, UseGuards , Req, Query } from '@nestjs/common';
import { ReservasService } from '../services/reservas.service.js';

import { AuthGuard } from '../../auth/guards/auth.guard.js';
import { RolesGuard } from '../../auth/guards/roles.guard.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { RolesUsuariosEnum } from '../../auth/enums/roles-usuarios.enum.js';

import { CreateReservaDto } from '../dtos/input/create-reserva.dto.js';
import { CreateReservaAdministradorDto } from '../dtos/input/create-reserva-administrador.dto.js';
import { CreateReservaResponseDTO } from '../dtos/output/create-reserva-response.dto.js';
import { ListReservaPacienteDTO } from '../dtos/output/list-reserva-paciente.dto.js';
import { ListReservaAdministradorDTO } from '../dtos/output/list-reserva-administrador.dto.js';
import { CancelarReservaResponseDTO } from '../dtos/output/cancelar-reserva-response.dto.js';


@ApiTags('Reservas')
@Controller('reservas')
export class ReservasController {

    constructor(
        private readonly reservasService: ReservasService
    ) {}

    @ApiOperation({
    summary: 'Reservar un turno para el Paciente logueado',
    description:
        'Permite a un paciente autenticado reservar un turno médico. ' +
        'Los turnos tienen una duración de una hora, deben comenzar ' +
        'en hora exacta, estar dentro del horario de 08:00 a 16:00 ' +
        'y reservarse con un máximo de 30 días de anticipación. ' +
        'No se permiten reservas duplicadas para el mismo médico y horario.',
    })
    @ApiCreatedResponse({
        description: 'Reserva creada correctamente',
        type: CreateReservaResponseDTO,
    })
    @ApiBadRequestResponse({
        description: 'Fecha, horario o disponibilidad inválidos',
    })
    @ApiNotFoundResponse({
    description: 'Médico no encontrado',
    })
    @ApiUnauthorizedResponse({
        description: 'Token ausente o inválido',
    })
    @ApiForbiddenResponse({
        description: 'No tiene permisos para realizar esta operación',
    })
    @ApiBearerAuth()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RolesUsuariosEnum.PACIENTE)
    @Post()
    async crearReserva(
        @Req() request: any,
        @Body() dto: CreateReservaDto
    ): Promise<CreateReservaResponseDTO> {
        const idPaciente = request.user.sub;

        return await this.reservasService.crearReserva(idPaciente, dto);
    }


    @ApiOperation({
    summary: 'Consultar mis reservas',
    description:
        'Permite al paciente autenticado consultar todas sus reservas de turnos médicos.',
    })
    @ApiOkResponse({
    description: 'Reservas del paciente obtenidas correctamente',
    type: [ListReservaPacienteDTO],
    })
    @ApiUnauthorizedResponse({
    description: 'Token ausente o inválido',
    })
    @ApiForbiddenResponse({
    description: 'No tiene permisos para realizar esta operación',
    })
    @ApiBearerAuth()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RolesUsuariosEnum.PACIENTE)
    @Get('mis-turnos')
    async obtenerReservasPaciente(@Req() request: any): Promise<ListReservaPacienteDTO[]> {
        const idPaciente = request.user.sub;

        return await this.reservasService.obtenerReservasPaciente(idPaciente);
    }


    @ApiOperation({
    summary: 'Consultar todas las reservas',
    description:
        'Permite al administrador autenticado consultar todas las reservas de turnos médicos, tanto las realizadas por los pacientes como las creadas por el administrador.',
    })
    @ApiOkResponse({
    description: 'Todas las reservas obtenidas correctamente',
    type: [ListReservaAdministradorDTO],
    })
    @ApiUnauthorizedResponse({
    description: 'Token ausente o inválido',
    })
    @ApiForbiddenResponse({
    description: 'No tiene permisos para realizar esta operación',
    })
    @ApiBearerAuth()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RolesUsuariosEnum.ADMINISTRADOR)
    @Get('administrador')
    async obtenerReservasAdministrador(): Promise<ListReservaAdministradorDTO[]> {
        return await this.reservasService.obtenerReservasAdministrador();
    }

    @ApiOperation({
    summary: 'Crear una reserva para un paciente',
    description:
        'Permite al administrador autenticado crear una reserva de turno médico para un paciente activo. ' +
        'Los turnos deben comenzar en hora exacta, estar dentro del horario de 08:00 a 16:00 ' +
        'y reservarse con un máximo de 30 días de anticipación. ' +
        'No se permiten reservas duplicadas para el mismo médico y horario.',
    })
    @ApiCreatedResponse({
    description: 'Reserva creada correctamente por el administrador',
    type: CreateReservaResponseDTO,
    })
    @ApiBadRequestResponse({
    description: 'Datos inválidos, fecha, horario o disponibilidad incorrectos',
    })
    @ApiUnauthorizedResponse({
    description: 'Token ausente o inválido',
    })
    @ApiNotFoundResponse({
    description: 'Paciente o médico no encontrado',
    })
    @ApiForbiddenResponse({
    description: 'No tiene permisos para realizar esta operación',
    })
    @ApiBearerAuth()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RolesUsuariosEnum.ADMINISTRADOR)
    @Post('administrador')
    async crearReservaAdministrador(
        @Body() dto: CreateReservaAdministradorDto
    ): Promise<CreateReservaResponseDTO> {
        return await this.reservasService.crearReservaAdministrador(dto);
    }

    @ApiOperation({
        summary: 'Cancelar un turno',
        description:
            'Permite a pacientes cancelar sus propios turnos hasta el día anterior a la consulta. ' +
            'Los administradores pueden cancelar cualquier turno antes de que inicie la consulta.',
    })
    @ApiParam({
        name: 'id',
        description: 'Identificador del turno',
        example: 15,
    })
    @ApiOkResponse({
        description: 'Turno cancelado correctamente',
        type: CancelarReservaResponseDTO,
    })
    @ApiBadRequestResponse({
        description: 'El turno no está activo o ya no se puede cancelar según el rol',
    })
    @ApiUnauthorizedResponse({
        description: 'Token ausente, inválido o expirado',
    })
    @ApiForbiddenResponse({
        description: 'Solo pacientes y administradores pueden cancelar turnos',
    })
    @ApiNotFoundResponse({
        description: 'Turno no encontrado',
    })
    @ApiBearerAuth()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RolesUsuariosEnum.PACIENTE, RolesUsuariosEnum.ADMINISTRADOR)
    @Patch(':id/cancelar')
    async cancelarReserva(
        @Req() request: any,
        @Param('id', ParseIntPipe) idReserva: number
    ): Promise<CancelarReservaResponseDTO> {
        return await this.reservasService.cancelarReserva(
            request.user.sub,
            idReserva,
            request.user.rol
        );
    }

    @ApiOperation({
        summary: 'Consultar horarios ocupados de un médico',
        description:
            'Permite a pacientes y administradores autenticados consultar ' +
            'los horarios ocupados de un médico en una fecha determinada. ' +
            'Solo se consideran reservas con estado ACTIVO. ' +
            'No se exponen datos personales de los pacientes.',
    })
    @ApiQuery({
        name: 'idMedico',
        description: 'Identificador del médico',
        required: true,
        type: Number,
        example: 1,
    })
    @ApiQuery({
        name: 'fecha',
        description: 'Fecha de consulta en formato YYYY-MM-DD',
        required: true,
        type: String,
        example: '2026-11-02',
    })
    @ApiOkResponse({
        description: 'Horarios ocupados obtenidos correctamente',
        schema: {
            type: 'array',
            items: {
                type: 'string',
                example: '09:00',
            },
            example: ['09:00', '11:00', '14:00'],
        },
    })
    @ApiBadRequestResponse({
        description:
            'El identificador del médico o el formato de la fecha no son válidos.',
    })
    @ApiUnauthorizedResponse({
        description: 'Token ausente, inválido o expirado.',
    })
    @ApiForbiddenResponse({
        description:
            'El usuario no tiene permisos para consultar los horarios ocupados.',
    })
    @ApiBearerAuth()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(
        RolesUsuariosEnum.PACIENTE,
        RolesUsuariosEnum.ADMINISTRADOR
    )
    @Get('horarios-ocupados')
    async obtenerHorariosOcupados(
        @Query('idMedico', ParseIntPipe) idMedico: number,
        @Query('fecha') fecha: string
    ): Promise<string[]> {
        return await this.reservasService.obtenerHorariosOcupados(
            idMedico,
            fecha
        );
    }

}