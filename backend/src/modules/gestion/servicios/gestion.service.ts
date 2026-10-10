import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reserva } from '../entities/reserva.entity.js';
import { EstadosReservasEnum } from '../enums/estados-reservas.enum.js';

@Injectable()
export class GestionService {
  constructor(
    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,
  ) {}

  async actualizarEstadoReserva(id: number, nuevoEstado: EstadosReservasEnum): Promise<Reserva> {
    const reserva = await this.reservaRepository.findOne({ where: { id } });

    if (!reserva) {
      throw new NotFoundException(`No se encontró la reserva con el ID ${id}`);
    }

    reserva.estado = nuevoEstado;
    return await this.reservaRepository.save(reserva);
  }
}