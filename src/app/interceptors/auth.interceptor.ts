import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth-service';

// Agrega el token de sesión a todas las peticiones, excepto al login.
// Si el backend rechaza el token (sesión vencida o eliminada), se cierra la sesión local.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.endsWith('/login/')) {
    return next(req);
  }

  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getSessionToken();

  if (!token) {
    return next(req);
  }

  // Las peticiones son inmutables, por eso se clona con el encabezado agregado
  const peticion = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });

  return next(peticion).pipe(
    catchError((error: HttpErrorResponse) => {
      // DRF responde 401 o 403 con un mensaje que menciona el token cuando ya no es válido
      const detalle = String(error.error?.detail ?? '').toLowerCase();
      const tokenInvalido = error.status === 401 || (error.status === 403 && detalle.includes('token'));

      if (tokenInvalido && !req.url.endsWith('/logout/')) {
        authService.destroyUser();
        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};
