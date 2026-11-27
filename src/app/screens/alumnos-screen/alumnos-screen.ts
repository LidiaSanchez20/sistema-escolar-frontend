import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { PageHeader } from '../../partials/page-header/page-header';
import { AuthService } from '../../services/auth-service';
import { AlumnosService } from '../../services/alumnos-service';
import { NotificationService } from '../../services/tools/notification-service';
import { AlumnoApi } from '../../interfaces/usuarios.interfaces';

@Component({
  selector: 'app-alumnos-screen',
  imports: [
    ...SHARED_IMPORTS,
    PageHeader,
    MatTableModule,
    MatPaginatorModule
  ],
  templateUrl: './alumnos-screen.html',
  styleUrl: './alumnos-screen.scss',
})
export class AlumnosScreen implements OnInit {
  private authService = inject(AuthService);
  private alumnosService = inject(AlumnosService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  public name_user: string = '';
  public rol: string = '';
  public cargando: boolean = false;

  public displayedColumns: string[] = [
    'matricula',
    'nombre',
    'email',
    'fecha_nacimiento',
    'curp',
    'rfc',
    'edad',
    'telefono',
    'ocupacion',
    'editar',
    'eliminar'
  ];

  public dataSource = new MatTableDataSource<AlumnoApi>([]);

  // La tabla está dentro de un @if, por eso el paginador se asigna cuando aparece en la vista
  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator | undefined) {
    if (paginator) {
      this.dataSource.paginator = paginator;
    }
  }

  ngOnInit(): void {
    this.name_user = this.authService.getUserCompleteName();
    this.rol = this.authService.getUserRole();
    this.obtenerAlumnos();
  }

  public obtenerAlumnos(): void {
    this.cargando = true;
    this.alumnosService.obtenerListaAlumnos().subscribe({
      next: (response) => {
        this.dataSource.data = response;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.notificationService.error('No se pudo obtener la lista de alumnos');
      }
    });
  }

  // idAlumno identifica el registro; idUsuario es la cuenta asociada, que es la que se guarda en la sesión
  public goEditar(idAlumno: number, idUsuario: number): void {
    const userId = Number(this.authService.getUserId());

    if (this.rol === 'administrador' || (this.rol === 'alumno' && userId === idUsuario)) {
      // La ruta de edición se habilitará cuando se implemente la actualización
      this.router.navigate(['registro-usuarios', 'alumno', idAlumno]);
    } else {
      this.notificationService.error('No tienes permisos para editar este alumno');
    }
  }

  public delete(idAlumno: number, idUsuario: number): void {
    // Pendiente: confirmar y llamar al servicio de eliminación
  }
}
