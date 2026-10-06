import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

import { UsuariosService } from "./usuarios.services.js";
import { LoginDTO } from "../dtos/input/login.dto.js";
import { Usuario } from "../entities/usuario.entity.js";
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class AuthService {

  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async validarUsuario(dto: LoginDTO): Promise<Usuario> {
    
    //Se valida si es usuario activo
    const usuario = await this.usuariosService.buscarUsuarioActivoPorMail(dto.email);

    if (!usuario) {
      throw new UnauthorizedException('Credenciales invalidas');
    }
    //Validacion de clave
    const claveValida = await bcrypt.compare(
        dto.clave,
        usuario.clave,
      )
     
    if(!claveValida) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    return usuario;
  }

  async login(dto: LoginDTO): Promise<{ accessToken: string }>{
    //Usuario activo
    const usuario = await this.validarUsuario(dto);

    //Creamos un payload con los datos del usuario logeado
    const payload = {
      email: usuario.email,
      sub: usuario.id,
      rol: usuario.rol,
    };

    //Firmamos con el JWT_SECRET, la expiracion y el payload. Creando el accessToken
    return {
      accessToken:
        await this.jwtService.signAsync(payload),
    };
  }
}