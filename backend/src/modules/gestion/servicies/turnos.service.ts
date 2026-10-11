import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Medico } from '../entities/medico.entity.js';
import { Reserva } from '../entities/reserva.entity.js';
import { TurnoMedicoResponseDto } from '../dtos/output/turno-medico-response.dto.js';

@Injectable()
export class TurnosService {
  constructor(
    @InjectRepository(Medico) private readonly medicoRepo: Repository<Medico>,
    @InjectRepository(Reserva) private readonly reservaRepo: Repository<Reserva>,
  ) {}

  async turnosDelMedico(idUsuario: number, fecha: string): Promise<TurnoMedicoResponseDto[]> {
    const medico = await this.medicoRepo.findOne({
      where: { usuario: { id: idUsuario } },
    });
    if (!medico) {
      throw new NotFoundException('El usuario no es un médico registrado');
    }

    const reservas = await this.reservaRepo.find({
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
}
