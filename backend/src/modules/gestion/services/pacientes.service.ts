import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Usuario } from '../../auth/entities/usuario.entity.js';
import { EstadosUsuariosEnum } from '../../auth/enums/estados-usuarios.enum.js';
import { RolesUsuariosEnum } from '../../auth/enums/roles-usuarios.enum.js';
import { PacienteListadoDto } from '../dtos/output/paciente-listado.dto.js';


@Injectable()
export class PacientesService {

  constructor(
    @InjectRepository(Usuario)
    private readonly repository: Repository<Usuario>,
  ) {}

async obtenerPacientesActivos(): Promise<PacienteListadoDto[]> {
    return await this.repository.find({
      select: {
        id: true,
        nombres: true,
        apellidos: true,
        documento: true,
      },
      where: {
        rol: RolesUsuariosEnum.PACIENTE,
        estado: EstadosUsuariosEnum.ACTIVO,
      },
      order: {
        apellidos: 'ASC',
        nombres: 'ASC',
      },
    });
  }
}