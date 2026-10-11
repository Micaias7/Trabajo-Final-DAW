import { Controller , Body, Post , Get, UseGuards , Req } from '@nestjs/common';
import { ReservasService } from '../services/reservas.service.js';
import { CreateReservaDto } from '../dtos/input/create-reserva.dto.js';
import { AuthGuard } from '../../auth/guards/auth.guard.js';
import { RolesGuard } from '../../auth/guards/roles.guard.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { RolesUsuariosEnum } from '../../auth/enums/roles-usuarios.enum.js';
import { ApiTags, ApiOperation,  ApiCreatedResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiBearerAuth , ApiOkResponse } from '@nestjs/swagger';
import { CreateReservaAdministradorDto } from '../dtos/input/create-reserva-administrador.dto.js';

import { CreateReservaResponseDTO } from '../dtos/output/create-reserva-response.dto.js';

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


    @ApiOperation({
    summary: 'Consultar mis reservas',
    description:
        'Permite al paciente autenticado consultar todas sus reservas de turnos médicos.',
})

    @ApiOkResponse({
    description: 'Reservas del paciente obtenidas correctamente',
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
    async obtenerReservasPaciente(@Req() request: any) {
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
    async obtenerReservasAdministrador() {
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
    description: 'Paciente inválido, fecha, horario o disponibilidad incorrectos',
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
    @Post('administrador')
    async crearReservaAdministrador(
        @Body() dto: CreateReservaAdministradorDto
    ) {
        return await this.reservasService.crearReservaAdministrador(dto);
    }

}