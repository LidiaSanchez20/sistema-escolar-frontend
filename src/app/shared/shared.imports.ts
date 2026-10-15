//Módulos para formularios y directivas de Angular que se importan en los componentes standalone de la aplicación.
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';

//Router
import { RouterModule } from '@angular/router';

// Angular material
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';


/**
 * SHARED_IMPORTS
 * ----------------------------------------------------------
 * Colección de módulos/directivas reutilizables en
 * componentes standalone.
 *
 * Se importa así:
 * imports: [...SHARED_IMPORTS, HeaderApp,  FooterApp]
 */

export const SHARED_IMPORTS = [
  /*Angular*/
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  RouterModule,
  NgOptimizedImage,
  /*Angular Material*/
  MatDividerModule,
  MatButtonModule,
  MatIconModule,
];
