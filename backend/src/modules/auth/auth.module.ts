import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Usuario } from "../gestion/entities/usuario.entity.js";


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Usuario,      
    ]),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AuthModule{}