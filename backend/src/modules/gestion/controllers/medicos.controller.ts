
import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { MedicosService } from '../servicies/medicos.service.js';
import { ActualizarValorConsultaDto } from '../dtos/input/actualizar-valor-consulta.dto.js';

import { AuthGuard } from '../../auth/guards/auth.guard.js';
import { RolesGuard } from '../../auth/guards/roles.guard.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { RolesUsuariosEnum } from '../../auth/enums/roles-usuarios.enum.js';

@ApiTags('Médicos')
@ApiBearerAuth()
@Controller('medicos')
export class MedicosController {

  constructor(
    private readonly medicosService: MedicosService,
  ) {}

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
