import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Medico } from "./entities/medico.entity.js";
import { Reserva } from "./entities/reserva.entity.js";
import { MedicosController } from "./controllers/medicos.controller.js";
import { TurnosService } from "./servicies/turnos.service.js";


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Medico,
      Reserva,
    ]),
  ],
  controllers: [MedicosController],
  providers: [TurnosService],
  exports: [],
})
export class GestionModule{}