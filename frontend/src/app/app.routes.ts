import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Inicio } from './paciente/inicio/inicio';
import { Inicio as InicioMedico } from './medico/inicio/inicio';
import { Inicio as InicioAdministrador } from './administrador/inicio/inicio';
import { rolGuard } from './auth/rol-guard';
import { MisTurnos } from './medico/mis-turnos/mis-turnos';

import { Reservas } from './administrador/reservas/reservas';
import { Medicos } from './administrador/medicos/medicos';

export const routes: Routes = [
  { path: 'login', component: Login },
    {
    path: 'medico/mis-turnos',
    component: MisTurnos,
    canActivate: [rolGuard],
    data: { rol: 'MEDICO' },
  },
  {
    path: 'paciente',
    component: Inicio,
    canActivate: [rolGuard],
    data: { rol: 'PACIENTE' },
  },
  {
    path: 'paciente/turnos',
    loadComponent: () =>
      import('./paciente/reservas/reservas').then(
        (modulo) => modulo.ReservasPaciente
      ),
    canActivate: [rolGuard],
    data: { rol: 'PACIENTE' },
  },
  {
    path: 'medico',
    component: InicioMedico,
    canActivate: [rolGuard],
    data: { rol: 'MEDICO' },
  },
  {
    path: 'administrador',
    component: InicioAdministrador,
    canActivate: [rolGuard],
    data: { rol: 'ADMINISTRADOR' },
  },
  {
    path: 'administrador/reservas',
    component: Reservas,
    canActivate: [rolGuard],
    data: { rol: 'ADMINISTRADOR' },
  },
  {
    path: 'administrador/medicos',
    component: Medicos,
    canActivate: [rolGuard],
    data: { rol: 'ADMINISTRADOR' },
  },
  { path: '**', redirectTo: 'login' },
];
