import { Controller, Get, Patch, Query, Req, UseGuards, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse, ApiParam, ApiBody } from '@nestjs/swagger';

import { MedicosService } from '../services/medicos.service.js';

import { AuthGuard } from '../../auth/guards/auth.guard.js';
import { RolesGuard } from '../../auth/guards/roles.guard.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';

import { RolesUsuariosEnum } from '../../auth/enums/roles-usuarios.enum.js';
import { EstadosReservasEnum } from '../enums/estados-reservas.enum.js';

import { TurnosPorFechaDto } from '../dtos/input/turnos-por-fecha.dto.js';
import { TurnoMedicoResponseDto } from '../dtos/output/turno-medico-response.dto.js';
import { ActualizarValorConsultaDto } from '../dtos/input/actualizar-valor-consulta.dto.js';
import { ActualizarValorConsultaResponseDto } from '../dtos/output/actualizar-valor-consulta-response.dto.js';
import { ActualizarEstadoReservaDto } from '../dtos/input/actualizar-estado-reserva.dto.js';
import { EstadoReservaResponseDto } from '../dtos/output/estado-reserva-response.dto.js';

import { MedicoListadoDto } from '../dtos/output/medico-listado.dto.js';


@ApiTags('Médicos')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(RolesUsuariosEnum.MEDICO)
@Controller({ path: 'medicos', version: '1' })
export class MedicosController {
  constructor(
    private readonly medicosService: MedicosService
  ) {}
  
  @ApiOperation({
    summary: 'Consultar el listado de médicos',
    description:
      'Permite a un usuario con rol ADMINISTRADOR consultar ' +
      'los médicos registrados en el sistema. ' +
      'Devuelve el identificador, matrícula, nombres, apellidos ' +
      'y valor actual de la consulta de cada médico.',
  })
  @ApiOkResponse({
    description: 'Listado de médicos obtenido correctamente',
    type: [MedicoListadoDto],
  })
  @ApiUnauthorizedResponse({
    description: 'Token ausente, inválido o expirado',
  })
  @ApiForbiddenResponse({
    description: 'Acceso permitido solo a ADMINISTRADOR',
  })
  @Get()
  @Roles  (RolesUsuariosEnum.ADMINISTRADOR,
  RolesUsuariosEnum.PACIENTE)
  async listarMedicos(): Promise<MedicoListadoDto[]> {
    return await this.medicosService.listarMedicos();
  }

  @ApiOperation({
    summary: 'Consultar los turnos del Médico logueado para una fecha',
    description:
      'Permite a un médico autenticado ver los turnos reservados a su nombre ' +
      'en la fecha indicada (formato YYYY-MM-DD). Los turnos se devuelven ' +
      'ordenados por horario e incluyen los datos del paciente. ' +
      'Si no hay turnos ese día, devuelve una lista vacía.',
  })
  @ApiOkResponse({
    description: 'Lista de turnos del día (puede estar vacía)',
    type: [TurnoMedicoResponseDto],
  })
  @ApiBadRequestResponse({
    description: 'La fecha no tiene el formato YYYY-MM-DD o no es válida',
  })
  @ApiUnauthorizedResponse({ description: 'Token ausente, inválido o expirado' })
  @ApiForbiddenResponse({
    description: 'No tiene permisos para realizar esta operación (solo MEDICO)',
  })
  @ApiNotFoundResponse({
    description: 'El usuario logueado no está registrado como médico',
  })
  @Get('mis-turnos')
  turnos(@Req() req: any, @Query() query: TurnosPorFechaDto): Promise<TurnoMedicoResponseDto[]> {
    return this.medicosService.turnosDelMedico(req.user.sub, query.fecha);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesUsuariosEnum.MEDICO)
  @Patch(':id/estado')
  @ApiOperation({
    summary: 'Marcar una reserva como ATENDIDO o AUSENTE',
    description:
      'Permite a un médico autenticado marcar un turno propio como ATENDIDO o AUSENTE. ' +
      'La reserva debe pertenecer al médico logueado, estar en estado ACTIVO ' +
      'y el turno ya debe haber comenzado.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Identificador de la reserva',
    example: 15,
  })
  @ApiBody({
    type: ActualizarEstadoReservaDto,
    examples: {
      atendido: { summary: 'Paciente atendido', value: { estado: EstadosReservasEnum.ATENDIDO } },
      ausente: { summary: 'Paciente ausente', value: { estado: EstadosReservasEnum.AUSENTE } },
    },
  })
  @ApiOkResponse({
    description: 'Estado de la reserva actualizado correctamente',
    type: EstadoReservaResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'Estado distinto de ATENDIDO/AUSENTE, la reserva no está en estado ACTIVO, ' +
      'o el turno todavía no comenzó',
  })
  @ApiUnauthorizedResponse({ description: 'Token ausente, inválido o expirado' })
  @ApiForbiddenResponse({ description: 'No tiene permisos de médico para realizar esta acción' })
  @ApiNotFoundResponse({
    description:
      'El usuario no es un médico registrado, o la reserva no existe o no pertenece al médico logueado',
  })
  async actualizarEstadoReserva(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarEstadoReservaDto,
    @Req() request: any,
  ): Promise<EstadoReservaResponseDto> {
      // Obtenemos el ID del médico logueado desde el token (usando .sub igual que en paciente)
      const medicoId = request.user.sub; 

      return await this.medicosService.actualizarEstadoReserva(id, dto, medicoId);
    }
  
  @ApiOperation({
    summary: 'Actualizar el valor de consulta de un médico',
    description:
      'Permite al administrador modificar el valor de consulta de un médico. ' +
      'Las reservas realizadas anteriormente conservan el valor registrado al momento de su creación.',
  })
  @ApiOkResponse({
    description: 'Valor de consulta actualizado correctamente',
    type: ActualizarValorConsultaResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'ID inválido o valor de consulta incorrecto',
  })
  @ApiUnauthorizedResponse({
    description: 'Token ausente, inválido o expirado',
  })
  @ApiForbiddenResponse({
    description: 'No tiene permisos para realizar esta operación',
  })
  @ApiNotFoundResponse({
    description: 'Médico no encontrado',
  })
  @Patch(':id/valor-consulta')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesUsuariosEnum.ADMINISTRADOR)
  async actualizarValorConsulta(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarValorConsultaDto,
  ): Promise<ActualizarValorConsultaResponseDto> {
    return await this.medicosService.actualizarValorConsulta(id, dto);
  }

}
