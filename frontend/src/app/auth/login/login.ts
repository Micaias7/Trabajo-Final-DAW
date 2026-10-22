import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { LoginApiClient } from './login-api-client';
import { AuthStore } from '../auth-store';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { Password } from 'primeng/password';
import { InputText } from 'primeng/inputtext';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.css',
  imports: [ReactiveFormsModule, InputText, Password, Button],
})
export class Login {
  private readonly messageService: MessageService = inject(MessageService);

  private readonly loginApiClient: LoginApiClient = inject(LoginApiClient);

  private readonly authStore: AuthStore = inject(AuthStore);

  private readonly router: Router = inject(Router);

  form: FormGroup = new FormGroup({
    email: new FormControl(null, Validators.required),
    clave: new FormControl(null, Validators.required),
  });

  iniciarSesion() {
    if (!this.form.valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Es necesario completar todos los campos del formulario para avanzar',
      });
      return;
    }

    const email: string = this.form.value.email;

    const clave: string = this.form.value.clave;

    this.loginApiClient.iniciarSesion(email, clave).subscribe({
      next: (res) => {
        this.authStore.guardarToken(res.accessToken);
        const datos = jwtDecode<{ rol: string }>(res.accessToken);
        console.log('Rol del usuario:', datos.rol);
        if (datos.rol === 'ADMINISTRADOR') {
          this.router.navigateByUrl('/administrador');
        } else if (datos.rol === 'MEDICO') {
          this.router.navigateByUrl('/medico');
        } else if (datos.rol === 'PACIENTE') {
          this.router.navigateByUrl('/paciente');
        }
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Ha ocurrido un error al iniciar sesión. Verifique las credenciales ingresadas',
        });
      },
    });
  }
}
