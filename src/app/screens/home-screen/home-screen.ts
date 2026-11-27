import { Component, inject, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { PageHeader } from '../../partials/page-header/page-header';
import { AuthService } from '../../services/auth-service';

// Acceso rápido que se muestra como tarjeta en el Home
interface Acceso {
  titulo: string;
  descripcion: string;
  icono: string;
  ruta: string;
}

@Component({
  selector: 'app-home-screen',
  imports: [...SHARED_IMPORTS, PageHeader],
  templateUrl: './home-screen.html',
  styleUrl: './home-screen.scss',
})
export class HomeScreen implements OnInit {
  private authService = inject(AuthService);

  public name_user: string = '';
  public rol: string = '';
  public accesos: Acceso[] = [];

  ngOnInit(): void {
    this.name_user = this.authService.getUserCompleteName();
    this.rol = this.authService.getUserRole();
    this.accesos = this.obtenerAccesos();
  }

  // Cada tarjeta se muestra con las mismas reglas de rol que usa el sidebar
  private obtenerAccesos(): Acceso[] {
    const accesos: Acceso[] = [];

    if (this.authService.canSeeRegisterItem()) {
      accesos.push({
        titulo: 'Registro',
        descripcion: 'Da de alta administradores, maestros y alumnos.',
        icono: 'person_add',
        ruta: '/registro-usuarios'
      });
    }

    if (this.authService.canSeeAdminItems()) {
      accesos.push({
        titulo: 'Administradores',
        descripcion: 'Consulta la lista de administradores registrados.',
        icono: 'admin_panel_settings',
        ruta: '/administrador'
      });
    }

    if (this.authService.canSeeTeacherItems()) {
      accesos.push({
        titulo: 'Maestros',
        descripcion: 'Consulta la lista de maestros registrados.',
        icono: 'people',
        ruta: '/maestros'
      });
    }

    if (this.authService.canSeeStudentItems()) {
      accesos.push({
        titulo: 'Alumnos',
        descripcion: 'Consulta la lista de alumnos registrados.',
        icono: 'school',
        ruta: '/alumnos'
      });
    }

    return accesos;
  }
}
