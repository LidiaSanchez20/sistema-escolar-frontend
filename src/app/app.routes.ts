import { Routes } from '@angular/router';
import { DashboardLayout } from './layout/dashboard-layout/dashboard-layout';
import { AuthLayout } from './layout/auth-layout/auth-layout';
import { authGuard } from './guards/auth.guard';
import { publicGuard } from './guards/public.guard';
import { publicRegisterMatch } from './guards/registrer-users.guard';

export const routes: Routes = [

  {
    path: '',
    component: AuthLayout,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        canActivate: [publicGuard],
        loadComponent: () => import('./screens/login-screen/login-screen').then(m => m.LoginScreen),
      },
      // Registro público: solo coincide cuando no hay sesión iniciada
      {
        path: 'registro-usuarios',
        canMatch: [publicRegisterMatch],
        loadComponent: () => import('./screens/registro-usuarios-screen/registro-usuarios-screen').then(m => m.RegistroUsuariosScreen),
      },
    ]
  },

  {
    path: '',
    component: DashboardLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./screens/home-screen/home-screen').then(m => m.HomeScreen),
      },
      // Registro con sesión iniciada: se muestra dentro del dashboard (con sidebar y navbar)
      {
        path: 'registro-usuarios',
        canActivate: [authGuard],
        data: { expectedRoles: ['administrador', 'maestro'] },
        loadComponent: () => import('./screens/registro-usuarios-screen/registro-usuarios-screen').then(m => m.RegistroUsuariosScreen),
      },
      // La ruta de edición (registro-usuarios/:rol/:id) se habilitará cuando se implemente la actualización
      // expectedRoles coincide con los elementos que el sidebar muestra a cada rol
      {
        path: 'administrador',
        canActivate: [authGuard],
        data: { expectedRoles: ['administrador'] },
        loadComponent: () => import('./screens/admin-screen/admin-screen').then(m => m.AdminScreen),
      },
      {
        path: 'alumnos',
        loadComponent: () => import('./screens/alumnos-screen/alumnos-screen').then(m => m.AlumnosScreen),
      },
      {
        path: 'maestros',
        canActivate: [authGuard],
        data: { expectedRoles: ['administrador', 'maestro'] },
        loadComponent: () => import('./screens/maestros-screen/maestros-screen').then(m => m.MaestrosScreen),
      },
      // {
      //   path: 'graficas',
      //   loadComponent: () => import('./screens/graficas-screen/graficas-screen').then(m => m.GraficasScreen),
      // }
    ]
  },

  // Retorna a la ruta de login para cualquier ruta no reconocida

  { path: '**', redirectTo: 'login' },
];
