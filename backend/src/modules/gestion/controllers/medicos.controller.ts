import { Controller, Get, Patch, Query, Req, UseGuards, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { MedicosService } from '../services/medicos.service.js';
import { TurnosPorFechaDto } from '../dtos/input/turnos-por-fecha.dto.js';
import { TurnoMedicoResponseDto } from '../dtos/output/turno-medico-response.dto.js';
import { AuthGuard } from '../../auth/guards/auth.guard.js';
import { RolesGuard } from '../../auth/guards/roles.guard.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { RolesUsuariosEnum } from '../../auth/enums/roles-usuarios.enum.js';
import { EstadosReservasEnum } from '../enums/estados-reservas.enum.js';

@ApiTags('Médicos')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(RolesUsuariosEnum.MEDICO)
@Controller({ path: 'medicos', version: '1' })
export class MedicosController {
  constructor(private readonly medicoService: MedicosService) {}

  @Get('mis-turnos')
  @ApiResponse({ type: [TurnoMedicoResponseDto] })
  turnos(@Req() req: any, @Query() query: TurnosPorFechaDto) {
    return this.medicoService.turnosDelMedico(req.user.sub, query.fecha);
  }

  @Patch('reservas/:id/estado')
  @ApiOperation({ summary: 'Actualizar el estado de una reserva' })
  @ApiResponse({ status: 200, description: 'Estado actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada.' })
  async cambiarEstadoReserva(
    @Param('id', ParseIntPipe) id: number,
    @Body('estado') estado: EstadosReservasEnum,
  ) {
    return await this.medicoService.actualizarEstadoReserva(id, estado);
  }

}