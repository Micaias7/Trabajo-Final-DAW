import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medico } from './entities/medico.entity.js';
import { Reserva } from './entities/reserva.entity.js';
import { GestionController } from './controllers/gestion.controller.js';
import { GestionService } from './servicios/gestion.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Medico,
      Reserva,
    ]),
  ],
  controllers: [GestionController],
  providers: [GestionService],
  exports: [GestionService],
})
export class GestionModule {}