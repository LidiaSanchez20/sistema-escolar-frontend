import { Routes } from '@angular/router';
import { DashboardLayout } from './layout/dashboard-layout/dashboard-layout';
import { AuthLayout } from './layout/auth-layout/auth-layout';
import { authGuard } from './guards/auth.guard';
import { publicGuard } from './guards/public.guard';
import { registerGuard } from './guards/registrer-users.guard';

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
      {
        path: 'registro-usuarios',
        canActivate: [registerGuard],
        loadComponent: () => import('./screens/registro-usuarios-screen/registro-usuarios-screen').then(m => m.RegistroUsuariosScreen),
      },
      // Ruta de edición temporalmente desactivada porque requiere parámetros dinámicos
      // durante el prerenderizado. Se habilitará cuando se configure su renderMode.
      // {
      //   path: 'registro-usuarios/:rol/:id',
      //   loadComponent: () => import('./screens/registro-usuarios-screen/registro-usuarios-screen').then(m => m.RegistroUsuariosScreen),
      // },
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
      // {
      //   path: 'administrador',
      //   loadComponent: () => import('./screens/admin-screen/admin-screen').then(m => m.AdminScreen),
      // },
      // {
      //   path: 'alumnos',
      //   loadComponent: () => import('./screens/alumnos-screen/alumnos-screen').then(m => m.AlumnosScreen),
      // },
      // {
      //   path: 'maestros',
      //   loadComponent: () => import('./screens/maestros-screen/maestros-screen').then(m => m.MaestrosScreen),
      // },
      // {
      //   path: 'graficas',
      //   loadComponent: () => import('./screens/graficas-screen/graficas-screen').then(m => m.GraficasScreen),
      // }
    ]
  },

  // Retorna a la ruta de login para cualquier ruta no reconocida

  { path: '**', redirectTo: 'login' },
];
