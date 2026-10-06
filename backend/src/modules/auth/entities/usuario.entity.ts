import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { EstadosUsuariosEnum } from "../enums/estados-usuarios.enum.js";
import { RolesUsuariosEnum } from "../enums/roles-usuarios.enum.js";

@Entity('usuarios')
export class Usuario {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({unique: true})
  documento!: string;

  @Column()
  apellidos!: string;

  @Column()
  nombres!: string;

  @Column()
  email!: string;

  @Column()
  clave!: string;

  @Column({
    type: 'enum',
    enum: EstadosUsuariosEnum,
    default: EstadosUsuariosEnum.ACTIVO,
  })
  estado!: EstadosUsuariosEnum;
  
  @Column({
    type: 'enum',
    enum: RolesUsuariosEnum,
    default: RolesUsuariosEnum.PACIENTE,
  })
  rol!: RolesUsuariosEnum;
  
}