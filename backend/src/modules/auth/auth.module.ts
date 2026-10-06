import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Usuario } from "./entities/usuario.entity.js";
import { UsuariosService } from "./services/usuarios.services.js";
import { AuthService } from "./services/auth.service.js";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { AuthController } from "./controllers/auth.controller.js";


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Usuario,      
    ]),

    JwtModule.registerAsync({
      inject: [
        ConfigService,
      ],

      global: true,

      useFactory: (
        configService: ConfigService,
      ) => ({
        secret: configService.get("JWT_SECRET"),

        signOptions: {
          expiresIn: configService.get("JWT_EXPIRES_IN"),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [UsuariosService, AuthService],
  exports: [],
})
export class AuthModule {}