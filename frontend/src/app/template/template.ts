import { Component, inject } from '@angular/core';
import { AuthStore } from '../auth/auth-store';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-template',
  imports: [Button],
  templateUrl: './template.html',
  styleUrl: './template.css'
})
export class Template {

  private readonly authStore = inject(AuthStore);

  cerrarSesion() {
    this.authStore.cerrarSesion();
  }

}