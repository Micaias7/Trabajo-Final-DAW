import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Medico } from '../entities/medico.entity.js';
import { Reserva } from '../entities/reserva.entity.js';
import { TurnoMedicoResponseDto } from '../dtos/output/turno-medico-response.dto.js';
import { EstadosReservasEnum } from '../enums/estados-reservas.enum.js';
import { ActualizarValorConsultaDto } from '../dtos/input/actualizar-valor-consulta.dto.js';

@Injectable()
export class MedicosService {

    constructor(
        @InjectRepository(Medico)
        private readonly medicoRepository: Repository<Medico>,
        @InjectRepository(Reserva)
        private readonly reservaRepository: Repository<Reserva>
        
    ) {}

    async buscarMedicoPorId(id: number): Promise<Medico | null> {
        return await this.medicoRepository.findOne({
            where: { id: id },
            relations: {
                usuario: true
            }
        });
    }

    async turnosDelMedico(idUsuario: number, fecha: string): Promise<TurnoMedicoResponseDto[]> {
        
        const medico = await this.medicoRepository.findOne({
            where: { usuario: { id: idUsuario } },
        });
        if (!medico) {
            throw new NotFoundException('El usuario no es un médico registrado');
        }

        const reservas = await this.reservaRepository.find({
            where: {
                medico: { id: medico.id },
                fecha_hora: Between(`${fecha} 00:00:00`, `${fecha} 23:59:59`),
            },
            relations: { usuario: true },
            order: { fecha_hora: 'ASC' },
            });

        return reservas.map((r) => ({
            id: r.id,
            fecha_hora: r.fecha_hora,
            estado: r.estado,
            valor_consulta: r.valor_consulta,
            paciente: {
                documento: r.usuario.documento,
                apellidos: r.usuario.apellidos,
                nombres: r.usuario.nombres,
            },
        }));
    }

    async actualizarEstadoReserva(id: number, nuevoEstado: EstadosReservasEnum): Promise<Reserva> {
        const reserva = await this.reservaRepository.findOne({ where: { id } });
    
        if (!reserva) {
          throw new NotFoundException(`No se encontró la reserva con el ID ${id}`);
        }
    
        reserva.estado = nuevoEstado;
        return await this.reservaRepository.save(reserva);
    }

    async actualizarValorConsulta(id: number, dto: ActualizarValorConsultaDto): Promise<Medico> {
    
        const medico = await this.medicoRepository.findOne({
          where: { id },
        });
    
        if (!medico) {
          throw new NotFoundException('Médico no encontrado');
        }
    
        medico.valor_consulta = dto.valor_consulta;
    
        return await this.medicoRepository.save(medico);
    }

}