import { Component, inject, Input, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { Location } from '@angular/common';
import { MaestrosService } from '../../services/maestros-service';
//Importar la interfaz de datos del maestro
import { DatosMaestro } from '../../interfaces/usuarios.interfaces';
import { NotificationService } from '../../services/tools/notification-service';

@Component({
  selector: 'app-registro-maestros',
  imports: [
    ...SHARED_IMPORTS
  ],
  templateUrl: './registro-maestros.html',
  styleUrl: './registro-maestros.scss',
})
export class RegistroMaestros implements OnInit {
  @Input() rol: string = '';
  @Input() datos_user: DatosMaestro = {} as DatosMaestro;

  // Inyectar servicios
  //Inyectar el servicio Location para poder regresar a la página anterior
  private location = inject(Location);
  //Inyectar el servicio de maestros para poder registrar y actualizar los datos del maestro
  private maestrosService = inject(MaestrosService);
  //Inyectar el servicio de notificaciones para mostrar mensajes al usuario
  private notificationService = inject(NotificationService);

  // Variables para el formulario
  public maestro: any = {};
  public errors: any = {};
  public editar: boolean = false;
  public idUser: number = 0;

  // Variables para visibilidad de contraseña
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  // Catálogo de áreas de investigación
  public areasInvestigacion: any[] = [
    { value: 'Desarrollo Web y Móvil', label: 'Desarrollo Web y Móvil' },
    { value: 'Ciencia de Datos e Inteligencia Artificial', label: 'Ciencia de Datos e Inteligencia Artificial' },
    { value: 'Redes y Seguridad Informática', label: 'Redes y Seguridad Informática' },
    { value: 'Ingeniería de Software', label: 'Ingeniería de Software' },
  ];

  // Catálogo exacto de materias de las capturas
  public catalogoMaterias: string[] = [
    'Aplicaciones Web',
    'Programación 1',
    'Bases de datos',
    'Tecnologías Web',
    'Minería de datos',
    'Desarrollo móvil',
    'Estructuras de datos',
    'Administración de redes',
    'Ingeniería de Software',
    'Administración de S.O.',
  ];

  // Variables para acotar el calendario
  public minFechaNacimiento: Date = new Date(1950, 0, 1);
  public maxFechaNacimiento: Date = new Date();

  constructor() {}

  ngOnInit(): void {
    this.maestro = this.maestrosService.esquemaMaestro();
    console.log('Datos del maestro:', this.maestro);

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

  // Agrega o remueve la materia seleccionada
  public checkboxChange(event: any, materia: string): void {
    if (event.checked) {
      this.maestro.materias.push(materia);
    } else {
      this.maestro.materias = this.maestro.materias.filter(
        (m: string) => m !== materia
      );
    }
  }

  public materiaSeleccionada(materia: string): boolean {
    return this.maestro.materias?.includes(materia);
  }

  public registrar(): void {
    this.errors = {};
    this.errors = this.maestrosService.validarMaestro(this.maestro, this.editar);

    console.log('Errores de validación:', this.errors);

    if (Object.keys(this.errors).length > 0) {
      return;
    }

    // Validar que las contraseñas coincidan
    if (this.maestro.password !== this.maestro.confirmar_password) {
      this.errors['confirmar_password'] = 'Las contraseñas no coinciden';
      this.notificationService.error('Las contraseñas no coinciden');
      this.maestro.password = '';
      this.maestro.confirmar_password = '';
      return;
    }

    // Preparar datos con la fecha en formato YYYY-MM-DD para Django
    const datosEnviar = {
      ...this.maestro,
      rol: 'maestro',
      fecha_nacimiento: this.maestro.fecha_nacimiento instanceof Date
        ? this.maestro.fecha_nacimiento.toISOString().split('T')[0]
        : this.maestro.fecha_nacimiento,
    };

    this.maestrosService.registrarMaestro(datosEnviar).subscribe(
      (response) => {
        console.log('Respuesta del backend:', response);
        this.notificationService.success('Maestro registrado correctamente');
        this.regresar();
      },
      (error) => {
        console.error('Error al registrar el maestro:', error);
        this.notificationService.error('Error al registrar el maestro');
      }
    );
    // TODO: Aquí se debe implementar la lógica para registrar o actualizar los datos del maestro en el backend, utilizando el servicio de maestros.
  }

  public actualizar(): void {

  }
}
