import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Usuario } from "../entities/usuario.entity.js";
import { Repository } from "typeorm";
import { EstadosUsuariosEnum } from "../enums/estados-usuarios.enum.js";


@Injectable()
export class UsuariosService {

  constructor(
    @InjectRepository(Usuario)
    private readonly repository: Repository<Usuario>,
  ) {}

  async buscarUsuarioActivoPorMail( email: string ): Promise<Usuario | null> {
    
    return await this.repository.findOne({
      where: {
        email,
        estado: EstadosUsuariosEnum.ACTIVO,
      }
    })
  }

}