import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medico } from '../entities/medico.entity.js';

@Injectable()
export class MedicosService {

    constructor(
        @InjectRepository(Medico)
        private readonly repository: Repository<Medico>
    ) {}

    async buscarMedicoPorId(id: number): Promise<Medico | null> {
        return await this.repository.findOne({
            where: { id: id }
        });
    }
}