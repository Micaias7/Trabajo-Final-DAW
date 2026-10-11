import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "../services/auth.service.js";
import { LoginDTO } from "../dtos/input/login.dto.js";

import {ApiTags, ApiOperation, ApiOkResponse, ApiUnauthorizedResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { LoginResponseDTO } from "../dtos/output/login-response.dto.js";

@ApiTags('Autenticación')
@Controller('/auth')
export class AuthController {

  constructor(
    private readonly service: AuthService,
  ) {}

  @Post('login')
  @ApiOperation({
    summary: 'Iniciar sesión',
    description:
      'Autentica un usuario activo mediante sus credenciales y devuelve un token JWT.',
  })
  @ApiOkResponse({
    description: 'Inicio de sesión exitoso',
    type: LoginResponseDTO,
  })
  @ApiUnauthorizedResponse({
    description: 'Credenciales incorrectas o usuario no habilitado',
  })
  @ApiBadRequestResponse({
    description: 'Datos de entrada inválidos',
  })
  async login(
    @Body() dto: LoginDTO,
  ): Promise<LoginResponseDTO> {
    return await this.service.login(dto);
  }
  
}