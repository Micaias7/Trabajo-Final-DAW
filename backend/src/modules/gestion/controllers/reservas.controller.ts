import { Controller , Body, Post , Get, UseGuards , Req } from '@nestjs/common';
import { ReservasService } from '../services/reservas.service.js';
import { CreateReservaDto } from '../dtos/input/create-reserva.dto.js';
import { AuthGuard } from '../../auth/guards/auth.guard.js';
import { RolesGuard } from '../../auth/guards/roles.guard.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { RolesUsuariosEnum } from '../../auth/enums/roles-usuarios.enum.js';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateReservaAdministradorDto } from '../dtos/input/create-reserva-administrador.dto.js';


@Controller('reservas')
export class ReservasController {

    constructor(
        private readonly reservasService: ReservasService
    ) {}

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