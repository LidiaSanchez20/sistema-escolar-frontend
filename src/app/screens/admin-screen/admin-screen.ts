import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { PageHeader } from '../../partials/page-header/page-header';
import { AuthService } from '../../services/auth-service';
import { AdministradoresService } from '../../services/administradores-service';
import { NotificationService } from '../../services/tools/notification-service';
import { AdministradorApi } from '../../interfaces/usuarios.interfaces';

@Component({
  selector: 'app-admin-screen',
  imports: [
    ...SHARED_IMPORTS,
    PageHeader,
    MatTableModule,
    MatPaginatorModule
  ],
  templateUrl: './admin-screen.html',
  styleUrl: './admin-screen.scss',
})
export class AdminScreen implements OnInit {
  private authService = inject(AuthService);
  private administradoresService = inject(AdministradoresService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  public name_user: string = '';
  public rol: string = '';
  public cargando: boolean = false;

  public displayedColumns: string[] = [
    'clave_admin',
    'nombre',
    'email',
    'rfc',
    'ocupacion',
    'editar',
    'eliminar'
  ];

  public dataSource = new MatTableDataSource<AdministradorApi>([]);

  // La tabla está dentro de un @if, por eso el paginador se asigna cuando aparece en la vista
  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator | undefined) {
    if (paginator) {
      this.dataSource.paginator = paginator;
    }
  }

  ngOnInit(): void {
    // El nombre y el rol se toman de las cookies de sesión guardadas al iniciar sesión
    this.name_user = this.authService.getUserCompleteName();
    this.rol = this.authService.getUserRole();
    // Se obtiene la lista de administradores al cargar la pantalla
    this.obtenerAdmins();
  }

  // Obtiene la lista de administradores y la asigna a la tabla
  public obtenerAdmins(): void {
    this.cargando = true;
    this.administradoresService.obtenerListaAdmins().pipe(
      finalize(() => this.cargando = false)
    ).subscribe({
      next: (response) => {
        this.dataSource.data = response;
        console.log('Lista de administradores:', response);
      },
      error: () => this.notificationService.error('No se pudo obtener la lista de administradores'),
    });
  }

  // Redirige al formulario de registro en modo edición para el administrador seleccionado
  public goEditar(idUser: number): void {
    this.router.navigate(['registro-usuarios', 'administrador', idUser]);
  }

  public delete(idUser: number): void {
    // Pendiente: confirmar y llamar al servicio de eliminación
    console.log('Eliminar administrador', idUser);
  }
}
