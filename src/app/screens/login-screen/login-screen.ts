import { Component, inject, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { NotificationService } from '../../services/tools/notification-service';
import { mensajeError } from '../../shared/mensaje-error';
import { ErroresFormulario } from '../../interfaces/usuarios.interfaces';

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
  public errors: ErroresFormulario = {};

  // Tipo de campo para la contraseña
  public typeInput: 'password' | 'text' = 'password';

  //Definir el router para la navegación entre pantallas
  private router: Router = inject(Router);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  constructor() {}

  ngOnInit(): void {}

  public login() {
    //Validar los campos de usuario y contraseña
    this.errors = {};

    this.errors = this.authService.validarLogin(this.username, this.password);

    //Verificamos si errors está vacío, si es así, procedemos a enviar la solicitud de login al servidor
    if(Object.keys(this.errors).length > 0){
      return;
    }

    //En caso de que no haya errores, se procede a enviar la solicitud de login al servidor
    this.load = true;

    // Llamar al servicio de login
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        // Si la respuesta es exitosa, se guardan los datos del usuario en cookies y se redirige a la página principal
        this.authService.saveUserData(response);
        console.log('Login exitoso. Datos del usuario guardados en cookies.');
        this.router.navigate(['home']);

        this.load = false;
      }, (error) => {
         this.load = false;
        // Mostrar mensaje de error
        // El backend explica el motivo: credenciales incorrectas, usuario sin rol o sin perfil
        const mensaje = mensajeError(error, 'Credenciales inválidas. Por favor, inténtalo de nuevo.');
        this.notificationService.error(mensaje);
        this.errors.general = mensaje;
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
