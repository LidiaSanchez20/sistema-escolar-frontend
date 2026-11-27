import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { PageHeader } from '../../partials/page-header/page-header';
import { AuthService } from '../../services/auth-service';
import { MaestrosService } from '../../services/maestros-service';
import { NotificationService } from '../../services/tools/notification-service';
import { MaestroApi } from '../../interfaces/usuarios.interfaces';

@Component({
  selector: 'app-maestros-screen',
  imports: [
    ...SHARED_IMPORTS,
    PageHeader,
    MatTableModule,
    MatPaginatorModule
  ],
  templateUrl: './maestros-screen.html',
  styleUrl: './maestros-screen.scss',
})
export class MaestrosScreen implements OnInit {
  private authService = inject(AuthService);
  private maestrosService = inject(MaestrosService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  public name_user: string = '';
  public rol: string = '';
  public cargando: boolean = false;

  public displayedColumns: string[] = [
    'id_trabajador',
    'nombre',
    'email',
    'fecha_nacimiento',
    'telefono',
    'rfc',
    'cubiculo',
    'area_investigacion',
    'editar',
    'eliminar'
  ];

  public dataSource = new MatTableDataSource<MaestroApi>([]);

  // La tabla está dentro de un @if, por eso el paginador se asigna cuando aparece en la vista
  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator | undefined) {
    if (paginator) {
      this.dataSource.paginator = paginator;
    }
  }

  ngOnInit(): void {
    this.name_user = this.authService.getUserCompleteName();
    this.rol = this.authService.getUserRole();
    this.obtenerMaestros();
  }

  public obtenerMaestros(): void {
    this.cargando = true;
    this.maestrosService.obtenerListaMaestros().subscribe({
      next: (response) => {
        this.dataSource.data = response;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.notificationService.error('No se pudo obtener la lista de maestros');
      }
    });
  }

  // idMaestro identifica el registro; idUsuario es la cuenta asociada, que es la que se guarda en la sesión
  public goEditar(idMaestro: number, idUsuario: number): void {
    const userId = Number(this.authService.getUserId());

    if (this.rol === 'administrador' || (this.rol === 'maestro' && userId === idUsuario)) {
      // La ruta de edición se habilitará cuando se implemente la actualización
      this.router.navigate(['registro-usuarios', 'maestro', idMaestro]);
    } else {
      this.notificationService.error('No tienes permisos para editar este maestro');
    }
  }

  public delete(idMaestro: number, idUsuario: number): void {
    // Pendiente: confirmar y llamar al servicio de eliminación
  }
}
