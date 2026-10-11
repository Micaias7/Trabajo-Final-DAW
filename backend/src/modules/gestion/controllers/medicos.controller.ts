import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { MedicosService } from '../services/medicos.service.js';
import { TurnosPorFechaDto } from '../dtos/input/turnos-por-fecha.dto.js';
import { TurnoMedicoResponseDto } from '../dtos/output/turno-medico-response.dto.js';
import { AuthGuard } from '../../auth/guards/auth.guard.js';
import { RolesGuard } from '../../auth/guards/roles.guard.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { RolesUsuariosEnum } from '../../auth/enums/roles-usuarios.enum.js';

@ApiTags('Médicos')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(RolesUsuariosEnum.MEDICO)
@Controller({ path: 'medicos', version: '1' })
export class MedicosController {
  constructor(private readonly medicoService: MedicosService) {}

  @Get('mis-turnos')
  @ApiOkResponse({ type: [TurnoMedicoResponseDto] })
  turnos(@Req() req: any, @Query() query: TurnosPorFechaDto) {
    return this.medicoService.turnosDelMedico(req.user.sub, query.fecha);
  }
}