
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Medico } from '../entities/medico.entity.js';
import { ActualizarValorConsultaDto } from '../dtos/input/actualizar-valor-consulta.dto.js';

@Injectable()
export class MedicosService {

  constructor(
    @InjectRepository(Medico)
    private readonly repository: Repository<Medico>,
  ) {}

  async actualizarValorConsulta(
    id: number,
    dto: ActualizarValorConsultaDto,
  ): Promise<Medico> {

    const medico = await this.repository.findOne({
      where: { id },
    });

    if (!medico) {
      throw new NotFoundException('Médico no encontrado');
    }

    medico.valor_consulta = dto.valor_consulta;

    return await this.repository.save(medico);
  }

}
