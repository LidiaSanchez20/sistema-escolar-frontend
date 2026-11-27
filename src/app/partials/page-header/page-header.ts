import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  imports: [],
  templateUrl: './page-header.html',
  styleUrl: './page-header.scss',
})
export class PageHeader {
  // Nombre completo del usuario en sesión
  @Input() nombre: string = '';
  // Rol del usuario en sesión (administrador, maestro o alumno)
  @Input() rol: string = '';
}
