import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { AuthService } from '../services/auth-service';

// Decide qué versión de la ruta "registro-usuarios" se carga.
// Si no hay sesión, es un visitante haciendo un registro público: se usa la ruta del AuthLayout.
// Si hay sesión, esta ruta no coincide y el Router continúa con la del DashboardLayout.
export const publicRegisterMatch: CanMatchFn = () => {
  const token = inject(AuthService).getSessionToken();

  return !token?.trim();
};
