import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "./usuario.entity.js";

@Entity('medicos')
export class Medico {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({unique: true})
  matricula!: number;

  @Column()
  valor_consulta!: number;

  @OneToOne(
    () => Usuario
  )  
  @JoinColumn({name: 'id_usuario'})
  usuario!: Usuario;

}