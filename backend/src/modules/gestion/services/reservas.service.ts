import { BadRequestException, Injectable ,  NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reserva } from '../entities/reserva.entity.js';
import { CreateReservaDto } from '../dtos/input/create-reserva.dto.js';
import { EstadosReservasEnum } from '../enums/estados-reservas.enum.js';
import { Usuario } from '../../auth/entities/usuario.entity.js';
import { Medico } from '../entities/medico.entity.js';
import { MedicosService } from './medicos.service.js';
import { ListReservaPacienteDTO } from '../dtos/output/list-reserva-paciente.dto.js';
import { ListReservaAdministradorDTO } from '../dtos/output/list-reserva-administrador.dto.js';
import { CreateReservaAdministradorDto } from '../dtos/input/create-reserva-administrador.dto.js';
import { RolesUsuariosEnum } from '../../auth/enums/roles-usuarios.enum.js';
import { EstadosUsuariosEnum } from '../../auth/enums/estados-usuarios.enum.js';    

@Injectable()
export class ReservasService {

    constructor(
    @InjectRepository(Reserva)
    private readonly repository: Repository<Reserva>,

    private readonly medicosService: MedicosService,

    @InjectRepository(Usuario)
private readonly usuariosRepository: Repository<Usuario>
) {}

async crearReserva(
    idPaciente: number,
    dto: CreateReservaDto
): Promise<{ id: number }> {
    const reserva: Reserva = this.repository.create();
reserva.estado = EstadosReservasEnum.ACTIVO;
reserva.usuario = { id: idPaciente } as Usuario;
reserva.medico = { id: dto.idMedico } as Medico;
reserva.fecha_hora = dto.fechaHora;

const fechaTurno = new Date(reserva.fecha_hora);

if (Number.isNaN(fechaTurno.getTime())) {
    throw new BadRequestException(
        'La fecha del turno no es válida'
    );
}
const hora = fechaTurno.getHours();

if (hora < 8 || hora >= 16) {
    throw new BadRequestException(
        'El horario de atención es de 8 a 16 hs'
    );
}

const minutos = fechaTurno.getMinutes();

if (minutos !== 0) {
    throw new BadRequestException(
        'Los turnos deben comenzar en hora exacta'
    );
}
const ahora = new Date();

if (fechaTurno <= ahora) {
    throw new BadRequestException(
        'La fecha del turno debe ser futura'
    );
}
const fechaLimite = new Date(ahora);

fechaLimite.setDate(fechaLimite.getDate() + 30);

if (fechaTurno > fechaLimite) {
    throw new BadRequestException(
        'La reserva no puede realizarse con más de 30 días de anticipación'
    );
}

const reservaExistente = await this.repository.findOne({
    where: {
        medico: { id: dto.idMedico },
        fecha_hora: reserva.fecha_hora,
        estado: EstadosReservasEnum.ACTIVO
    }
});
if (reservaExistente) {
    throw new BadRequestException(
        'El médico ya tiene un turno reservado en ese horario'
    );
}

const medico: Medico | null =
    await this.medicosService.buscarMedicoPorId(dto.idMedico);

if (!medico) {
    throw new BadRequestException('Médico no encontrado');
}
reserva.valor_consulta = medico.valor_consulta;
await this.repository.save(reserva);
return { id: reserva.id };
}


async obtenerReservasPaciente(idPaciente: number): Promise<ListReservaPacienteDTO[]> {
    const reservas: Reserva[] = await this.repository.find({
    relations: {
        medico: {
            usuario: true
        }
    },
   where: {
    usuario: {
        id: idPaciente
    }
}
});
 
    const dtoList: ListReservaPacienteDTO[] = [];
    for (const r of reservas) {
    const dto = new ListReservaPacienteDTO();
    dto.id = r.id;
dto.fechaHora = r.fecha_hora;
dto.estado = r.estado;
dto.medico = `${r.medico.usuario.nombres} ${r.medico.usuario.apellidos}`;
dto.valorConsulta = r.valor_consulta;
dtoList.push(dto);
}
    return dtoList;

}
async obtenerReservasAdministrador(): Promise<ListReservaAdministradorDTO[]> {
    const reservas: Reserva[] = await this.repository.find({
    relations: {
        medico: {
            usuario: true
        },
        usuario: true
    }
});
    const dtoList: ListReservaAdministradorDTO[] = [];
    for (const r of reservas) {
    const dto = new ListReservaAdministradorDTO();
    dto.id = r.id;
dto.fechaHora = r.fecha_hora;
dto.estado = r.estado;
dto.medico = `${r.medico.usuario.nombres} ${r.medico.usuario.apellidos}`;
dto.paciente = `${r.usuario.nombres} ${r.usuario.apellidos}`;
dto.valorConsulta = r.valor_consulta;
dtoList.push(dto);
}
    return dtoList;
}

async crearReservaAdministrador(dto: CreateReservaAdministradorDto) {

    const paciente = await this.usuariosRepository.findOne({
    where: { id: dto.idPaciente }


});
    if (!paciente) {
    throw new NotFoundException('El paciente no existe');
}

    if (paciente.rol !== RolesUsuariosEnum.PACIENTE) {
    throw new BadRequestException('El usuario no es un paciente');
}
    if (paciente.estado !== EstadosUsuariosEnum.ACTIVO) {
    throw new BadRequestException('El paciente no está activo');
}
    return await this.crearReserva(dto.idPaciente, dto);



}
}