import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Medico } from "./entities/medico.entity.js";
import { Reserva } from "./entities/reserva.entity.js";


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Medico,
      Reserva,
    ]),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class GestionModule{}