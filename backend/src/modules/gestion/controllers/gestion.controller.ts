import { Controller, Patch, Param, Body, ParseIntPipe } from '@nestjs/common';
import { GestionService } from '../servicios/gestion.service.js';
import { EstadosReservasEnum } from '../enums/estados-reservas.enum.js';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Gestión de Reservas')
@Controller('gestion')
export class GestionController {
  constructor(private readonly gestionService: GestionService) {}

  @Patch('reservas/:id/estado')
  @ApiOperation({ summary: 'Actualizar el estado de una reserva' })
  @ApiResponse({ status: 200, description: 'Estado actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada.' })
  async cambiarEstadoReserva(
    @Param('id', ParseIntPipe) id: number,
    @Body('estado') estado: EstadosReservasEnum,
  ) {
    return await this.gestionService.actualizarEstadoReserva(id, estado);
  }
}