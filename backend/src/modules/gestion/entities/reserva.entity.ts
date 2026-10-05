import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { EstadosReservasEnum } from "../enums/estados-reservas.enum.js";
import { Medico } from "./medico.entity.js";
import { Usuario } from "./usuario.entity.js";


@Entity('reservas')
export class Reserva {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({type: 'timestamp'})
  fecha_hora!: string;

  @Column({type: 'money'})
  valor_consulta!: number;

  @Column({
    type: 'enum',
    enum: EstadosReservasEnum,
    default: EstadosReservasEnum.ACTIVO,
  })
  estado!: EstadosReservasEnum

  @ManyToOne(
    () => Medico
  )
  @JoinColumn({name: 'id_medico'})
  medico!: Medico

  @ManyToOne(
    () => Usuario
  )
  @JoinColumn({name: 'id_paciente'})
  usuario!: Usuario

}