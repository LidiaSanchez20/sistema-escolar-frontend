import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

// Protege rutas que requieren una sesión activa y, opcionalmente, roles específicos.
export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Un token vacío o inexistente indica que el usuario no ha iniciado sesión.
  const token = authService.getSessionToken();

  if (!token?.trim()) {
    return router.createUrlTree(['/login']);
  }

  /*
   * Los roles permitidos pueden configurarse en la propiedad "data" de la ruta.
   * Si la ruta no los define, cualquier usuario autenticado puede acceder.
   */
  const expectedRoles = route.data['expectedRoles'] as string[] | undefined;

  if (!expectedRoles || expectedRoles.length === 0) {
    return true;
  }

  const userRole = authService.getUserRole();

  // El usuario puede entrar si su rol está incluido entre los permitidos.
  if (expectedRoles.includes(userRole)) {
    return true;
  }

  // Si está autenticado, pero no autorizado, se redirige al inicio.
  return router.createUrlTree(['/home']);
};
