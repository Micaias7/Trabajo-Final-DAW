import { Controller , Body, Post , Get, Patch, Param, ParseIntPipe, UseGuards , Req } from '@nestjs/common';
import { ReservasService } from '../services/reservas.service.js';
import { CreateReservaDto } from '../dtos/input/create-reserva.dto.js';
import { AuthGuard } from '../../auth/guards/auth.guard.js';
import { RolesGuard } from '../../auth/guards/roles.guard.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { RolesUsuariosEnum } from '../../auth/enums/roles-usuarios.enum.js';
import { ApiTags, ApiOperation,  ApiCreatedResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiBearerAuth, ApiOkResponse, ApiNotFoundResponse, ApiParam } from '@nestjs/swagger';
import { CreateReservaAdministradorDto } from '../dtos/input/create-reserva-administrador.dto.js';

import { CreateReservaResponseDTO } from '../dtos/output/create-reserva-response.dto.js';
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
    ) {
        const idPaciente = request.user.sub;

        return await this.reservasService.crearReserva(idPaciente, dto);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RolesUsuariosEnum.PACIENTE)
    @Get('mis-turnos')
    async obtenerReservasPaciente(@Req() request: any) {
        const idPaciente = request.user.sub;

        return await this.reservasService.obtenerReservasPaciente(idPaciente);
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
    ) {
        return await this.reservasService.cancelarReserva(
            request.user.sub,
            idReserva,
            request.user.rol
        );
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RolesUsuariosEnum.ADMINISTRADOR)
    @Get('administrador')
    async obtenerReservasAdministrador() {
        return await this.reservasService.obtenerReservasAdministrador();
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RolesUsuariosEnum.ADMINISTRADOR)
    @Post('administrador')
    async crearReservaAdministrador(
        @Body() dto: CreateReservaAdministradorDto
    ) {
        return await this.reservasService.crearReservaAdministrador(dto);
    }

}