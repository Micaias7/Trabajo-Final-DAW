import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "../services/auth.service.js";
import { LoginDTO } from "../dtos/input/login.dto.js";


@Controller('/auth')
export class AuthController {

  constructor(
    private readonly service: AuthService,
  ) {}

  @Post('login')
  async login(
    @Body() dto: LoginDTO,
  ): Promise<{ accessToken: string }> {
    return await this.service.login(dto);
  }
  
}