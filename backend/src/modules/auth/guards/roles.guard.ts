import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator.js';
import { RolesUsuariosEnum } from '../enums/roles-usuarios.enum.js';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {

    const rolesRequeridos =
      this.reflector.getAllAndOverride<RolesUsuariosEnum[]>(
        ROLES_KEY,
        [
          context.getHandler(),
          context.getClass(),
        ],
      );

    if (!rolesRequeridos) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest();

    const usuario = request.user;

    if (!rolesRequeridos.includes(usuario.rol)) {
      throw new ForbiddenException(
        'No tiene permisos para realizar esta operación',
      );
    }

    return true;
  }
}