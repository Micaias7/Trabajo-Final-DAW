import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { PacientesService } from '../services/pacientes.service.js';

import { AuthGuard } from '../../auth/guards/auth.guard.js';
import { RolesGuard } from '../../auth/guards/roles.guard.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { RolesUsuariosEnum } from '../../auth/enums/roles-usuarios.enum.js';
import { PacienteListadoDto } from '../dtos/output/paciente-listado.dto.js';

@ApiTags('Pacientes')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(RolesUsuariosEnum.ADMINISTRADOR)
@Controller({ path: 'pacientes', version: '1' })
export class PacientesController {

  constructor(
    private readonly pacientesService: PacientesService,
  ) {}

  @ApiOperation({
    summary: 'Consultar el listado de pacientes activos',
    description:
      'Permite al administrador consultar los pacientes activos registrados en el sistema.',
  })
  @ApiOkResponse({
  description: 'Listado de pacientes obtenido correctamente',
  type: [PacienteListadoDto],
})
  @ApiUnauthorizedResponse({
    description: 'Token ausente, inválido o expirado',
  })
  @ApiForbiddenResponse({
    description: 'Acceso permitido solo a ADMINISTRADOR',
  })
@Get()
async listarPacientes(): Promise<PacienteListadoDto[]> {
  return await this.pacientesService.obtenerPacientesActivos();
}
}