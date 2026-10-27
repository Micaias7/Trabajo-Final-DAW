import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

export const rolGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = sessionStorage.getItem('accessToken');

  if (!token) {
    return router.createUrlTree(['/login']);
  }

  try {
    const datos = jwtDecode<{ rol: string; exp?: number }>(token);
    const rolPermitido = route.data['rol'];

    if (datos.exp && datos.exp * 1000 <= Date.now()) {
      return router.createUrlTree(['/login']);
    }

    if (datos.rol === rolPermitido) {
      return true;
    }

    return router.createUrlTree(['/login']);
  } catch {
    return router.createUrlTree(['/login']);
  }
};
