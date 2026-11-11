import { Component, inject, Input, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { Location } from '@angular/common';
import { DatosAlumno } from '../../interfaces/usuarios.interfaces';
import { AlumnosService } from '../../services/alumnos-service';

@Component({
  selector: 'app-registro-alumnos',
  imports: [
    ...SHARED_IMPORTS
  ],
  templateUrl: './registro-alumnos.html',
  styleUrl: './registro-alumnos.scss',
})
export class RegistroAlumnos implements OnInit {
  @Input() rol: string = '';
  @Input() datos_user: DatosAlumno = {} as DatosAlumno;

  //Inyectar el servicio Location para poder regresar a la página anterior
  private location = inject(Location);
  //Inyectar el servicio de alumnos para poder registrar y actualizar los datos del administrador
  private alumnosService = inject(AlumnosService);

  //Declarar las variables para el formulario de registro de alumnos
  public alumno: any = {};
  public errors: any = {};
  public editar: boolean = false;
  public idUser: number = 0;

  //Variables para el campo de contraseña
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  // Variables para acotar el calendario
  public minFechaNacimiento: Date = new Date(1950, 0, 1);
  public maxFechaNacimiento: Date = new Date();
  
  constructor() { }

  ngOnInit(): void {
    //Si el rol es alumno, se inicializa el objeto alumno con los datos del usuario
    this.alumno = this.alumnosService.esquemaAlumno();
    console.log('Datos del alumno:', this.alumno);

    this.minFechaNacimiento = new Date(1950, 0, 1);
    this.maxFechaNacimiento = new Date();
  }

  public regresar(): void {
    this.location.back();
  }

  public showPassword(): void {
    if (this.inputType_1 === 'password') {
      this.inputType_1 = 'text';
      this.hide_1 = true;
    } else {
      this.inputType_1 = 'password';
      this.hide_1 = false;
    }
  }

  public showPwdConfirmar(): void {
    if (this.inputType_2 === 'password') {
      this.inputType_2 = 'text';
      this.hide_2 = true;
    } else {
      this.inputType_2 = 'password';
      this.hide_2 = false;
    }
  }

  // Método para registrar o actualizar los datos del alumno
  public registrar(): void {
    this.errors = {};
    this.errors = this.alumnosService.validarAlumno(this.alumno, this.editar);

    console.log('Errores de validación:', this.errors);

    if (Object.keys(this.errors).length > 0) {
      return;

    }
    //Lógica para registrar o actualizar los datos del alumno
  }

  //Método para actualizar
  public actualizar(): void {

  }
  public soloLetras(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);

    if (
      !(charCode >= 65 && charCode <= 90) &&
      !(charCode >= 97 && charCode <= 122) &&
      charCode !== 32
    ) {
      event.preventDefault();
    }
  }
}
