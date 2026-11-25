import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

// Evita que un usuario autenticado acceda a pantallas públicas como el login.
export const publicGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // El token se almacena en una cookie cuando el usuario inicia sesión.
  const token = authService.getSessionToken();

  /*
   * - Un UrlTree redirige mediante el Router sin navegación manual.
   * - true permite acceder a la ruta pública.
   * - Se usa trim() para considerar inválido un token que solo tenga espacios.
   */
  return token?.trim()
    ? router.createUrlTree(['/home'])
    : true;
};
