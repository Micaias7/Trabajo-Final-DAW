import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Inicio } from './paciente/inicio/inicio';
import { Inicio as InicioMedico } from './medico/inicio/inicio';
import { Inicio as InicioAdministrador } from './administrador/inicio/inicio';
import { rolGuard } from './auth/rol-guard';

export const routes: Routes = [
    { path: "login", component: Login },
    {
  path: 'paciente',
  component: Inicio,
  canActivate: [rolGuard],
  data: { rol: 'PACIENTE' }
},
  {
  path: 'medico',
  component: InicioMedico,
  canActivate: [rolGuard],
  data: { rol: 'MEDICO' }
},
     {
  path: 'administrador',
  component: InicioAdministrador,
  canActivate: [rolGuard],
  data: { rol: 'ADMINISTRADOR' }
},
    { path: "**", redirectTo: "login" }
];
