import { Component, inject, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { NotificationService } from '../../services/tools/notification-service';

@Component({
  selector: 'app-login-screen',
  imports: [...SHARED_IMPORTS],
  templateUrl: './login-screen.html',
  styleUrl: './login-screen.scss',
})
export class LoginScreen implements OnInit {
  //Se definen las variables globales que se utilizarán en el componente
  public username: string = '';
  public password: string = '';
  public load: boolean = false;
  public errors: any = {};

  // Tipo de campo para la contraseña
  public typeInput: 'password' | 'text' = 'password';

  //Definir el router para la navegación entre pantallas
  private router: Router = inject(Router);

  //Definir el servicio de autenticación para validar el login
  private authService = inject(AuthService);

  //Definir el servicio de notificaciones para mostrar mensajes al usuario
  private notificationService = inject(NotificationService);

  constructor() {}

  ngOnInit(): void {}

  public login() {
    //validar los campos de usuario y contraseña
    this.errors = {};

    this.errors = this.authService.validarLogin(this.username, this.password);

    //Verificamos si errors está vacío, si es así, procedemos a enviar la solicitud de login
    if (Object.keys(this.errors).length > 0) {
      return;
    }

    // En caso de que no haya errores, se procede a enviar la solicitud de login al servidor
    this.load = true;

    //Llamar al servicio de login
    // Subscribe: this.NombreServicio.función a la que se accederá, puede tener o no parámetros la función. subscribe() {}
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        //Si la respuesta es exitosa, se guarda el token de sesión y los datos del usuario en las cookies
        this.authService.saveUserData(response);
        this.router.navigate(['home']);

        this.load = false;
      }, (error) => {
        //Si la respuesta es un error, se muestra un mensaje de error al usuario
        this.load = false;
        this.notificationService.error('Error en el login: ' + error.message);
        this.errors.general = "Credenciales inválidas. Por favor, inténtelo de nuevo."
      }
    );
  }

  // Función para mostrar y ocultar la contraseña
  showPassword(): void {
    this.typeInput = this.typeInput === 'password' ? 'text' : 'password';
  }

  public registrar() {
    this.router.navigate(['/registro-usuarios']);
  }

  public olvideContrasena() {}
}
