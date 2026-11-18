import { Component, inject, Input, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { Location } from '@angular/common';
import { DatosAlumno } from '../../interfaces/usuarios.interfaces';
import { AlumnosService } from '../../services/alumnos-service';
import { NotificationService } from '../../services/tools/notification-service';

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
  // Inyectar el servicio de notificaciones para mostrar mensajes al usuario
  private notificationService = inject(NotificationService);

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

    // Validar que las contraseñas coincidan
    if (this.alumno.password !== this.alumno.confirmar_password) {
      this.errors['confirmar_password'] = 'Las contraseñas no coinciden';
      this.notificationService.error('Las contraseñas no coinciden');
      this.alumno.password = '';
      this.alumno.confirmar_password = '';
      return;
    }

    // Preparar datos con la fecha en formato YYYY-MM-DD para Django
    const datosEnviar = {
      ...this.alumno,
      rol: 'alumno',
      fecha_nacimiento: this.alumno.fecha_nacimiento instanceof Date
        ? this.alumno.fecha_nacimiento.toISOString().split('T')[0]
        : this.alumno.fecha_nacimiento,
    };

    //Lógica para registrar o actualizar los datos del alumno
    this.alumnosService.registrarAlumno(datosEnviar).subscribe(
      (response) => {
        console.log('Respuesta del backend:', response);
        this.notificationService.success('Alumno registrado correctamente');
        this.regresar();
      },
      (error) => {
        console.error('Error al registrar el alumno:', error);
        this.notificationService.error('Error al registrar el alumno');
      }
    );
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
