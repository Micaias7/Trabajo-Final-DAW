import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDTO {

  @ApiProperty({
    description: 'Token JWT generado al iniciar sesión',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken!: string;

}