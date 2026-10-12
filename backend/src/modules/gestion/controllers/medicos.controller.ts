import { Controller, Get, Patch, Query, Req, UseGuards, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { MedicosService } from '../services/medicos.service.js';
import { TurnosPorFechaDto } from '../dtos/input/turnos-por-fecha.dto.js';
import { TurnoMedicoResponseDto } from '../dtos/output/turno-medico-response.dto.js';
import { AuthGuard } from '../../auth/guards/auth.guard.js';
import { RolesGuard } from '../../auth/guards/roles.guard.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { RolesUsuariosEnum } from '../../auth/enums/roles-usuarios.enum.js';
import { EstadosReservasEnum } from '../enums/estados-reservas.enum.js';
import { ActualizarValorConsultaDto } from '../dtos/input/actualizar-valor-consulta.dto.js';
import { ActualizarEstadoReservaDto } from '../dtos/input/actualizar-estado-reserva.dto.js';

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
  turnos(@Req() req: any, @Query() query: TurnosPorFechaDto) {
    return this.medicosService.turnosDelMedico(req.user.sub, query.fecha);
  }

  //endpoint para actualizar el estado de una reserva a ATENDIDO o AUSENTE (solo para médicos)
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesUsuariosEnum.MEDICO) 
  @Patch(':id/estado')
  @ApiOperation({ summary: 'Actualizar el estado de una reserva a ATENDIDO o AUSENTE (Médico)' })
  async actualizarEstadoReserva(
    @Param('id') id: number,
    @Body() dto: ActualizarEstadoReservaDto,
    @Req() request: any,
  ) {
      // Obtenemos el ID del médico logueado desde el token (usando .sub igual que en paciente)
      const medicoId = request.user.sub; 

      return await this.medicosService.actualizarEstadoReserva(id, dto, medicoId);
    }

  @Patch(':id/valor-consulta')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesUsuariosEnum.ADMINISTRADOR)
  async actualizarValorConsulta(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarValorConsultaDto,
  ) {
    return await this.medicosService.actualizarValorConsulta(id, dto);
  }

}
