import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    //Obtiene la Request HTTP
    const request = context
      .switchToHttp()
      .getRequest();

    //Obtenemos Authorization: Bearer eyJ123456...
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    //Separa el Bearer y JWT
    const [tipo, token] = authHeader.split(' ');

    if (tipo !== 'Bearer' || !token) {
      throw new UnauthorizedException('Token inválido');
    }

    try {
      //comprueba que el token sea válido y que no haya expirado.
      const payload = await this.jwtService.verifyAsync(token);

      //Agregamos el payload al request
      request.user = payload;

      return true;

    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}