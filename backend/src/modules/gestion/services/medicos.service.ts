import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Medico } from '../entities/medico.entity.js';
import { Reserva } from '../entities/reserva.entity.js';
import { TurnoMedicoResponseDto } from '../dtos/output/turno-medico-response.dto.js';
import { EstadosReservasEnum } from '../enums/estados-reservas.enum.js';
import { ActualizarValorConsultaDto } from '../dtos/input/actualizar-valor-consulta.dto.js';
import { ActualizarEstadoReservaDto } from '../dtos/input/actualizar-estado-reserva.dto.js';
import { ActualizarValorConsultaResponseDto } from '../dtos/output/actualizar-valor-consulta-response.dto.js';
import { EstadoReservaResponseDto } from '../dtos/output/estado-reserva-response.dto.js';

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

  async actualizarEstadoReserva(
    id: number,
    dto: ActualizarEstadoReservaDto,
    idUsuario: number,
  ): Promise<EstadoReservaResponseDto> {
    const medico = await this.medicoRepository.findOne({
      where: { usuario: { id: idUsuario } },
    });
    if (!medico) {
      throw new NotFoundException('El usuario no es un médico registrado');
    }

    const reserva = await this.reservaRepository.findOne({
      where: { id, medico: { id: medico.id } },
      relations: { usuario: true },
    });
    if (!reserva) {
      throw new NotFoundException('La reserva no existe o no pertenece al médico autenticado');
    }

    if (reserva.estado !== EstadosReservasEnum.ACTIVO) {
      throw new BadRequestException(
        'Solo se pueden modificar reservas que se encuentren en estado ACTIVO',
      );
    }

    if (Date.now() < new Date(reserva.fecha_hora).getTime()) {
      throw new BadRequestException(
        'No se puede marcar como atendido o ausente un turno que todavía no comenzó',
      );
    }

    reserva.estado = dto.estado;
    const guardada = await this.reservaRepository.save(reserva);

    return {
      id: guardada.id,
      fecha_hora: guardada.fecha_hora,
      estado: guardada.estado,
      valor_consulta: guardada.valor_consulta,
      paciente: {
        documento: reserva.usuario.documento,
        apellidos: reserva.usuario.apellidos,
        nombres: reserva.usuario.nombres,
      },
    };
  }  
  async actualizarValorConsulta(id: number, dto: ActualizarValorConsultaDto): Promise<ActualizarValorConsultaResponseDto> {
    
        const medico = await this.medicoRepository.findOne({
          where: { id },
        });
    
        if (!medico) {
          throw new NotFoundException('Médico no encontrado');
        }
    
        medico.valor_consulta = dto.valor_consulta;

        const medicoActualizado = await this.medicoRepository.save(medico);
    
        return {
            mensaje: 'Valor de consulta actualizado correctamente',
            idMedico: medicoActualizado.id,
            valorConsulta: medicoActualizado.valor_consulta,
        };
    }

}