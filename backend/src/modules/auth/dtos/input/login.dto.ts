import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";


export class LoginDTO {
  @ApiProperty({
    example: 'pepe@gmail.com',
    description: 'Email del usuario',

  })
  @IsEmail()
  @IsNotEmpty({ message: 'Se debe indicar un email' })
  declare email: string;

  @ApiProperty({
    example: '1234',
    description: 'Contraseña del usuario',
  })
  @IsString()
  @IsNotEmpty({ message: 'Se debe indicar la clave' })
  declare clave: string;
  
}