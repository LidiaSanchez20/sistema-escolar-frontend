import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth-service';
import { ErrorsService } from './tools/errors-service';
import { ValidatorService } from './tools/validator-service';
import { DatosMaestro } from '../interfaces/usuarios.interfaces';

@Injectable({
  providedIn: 'root',
})
export class MaestrosService {
  // Inyectar los servicios para validaciones y errores
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private validatorService = inject(ValidatorService);
  private errorService = inject(ErrorsService);

  // Método para los headers de autenticación
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getSessionToken();
    return token
      ? new HttpHeaders({ 'Content-Type': 'application/json', Authorization: `Bearer ${token}` })
      : new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  // Método para definir el esquema inicial para los datos del maestro
  public esquemaMaestro(): DatosMaestro {
    return {
      id: 0,
      id_trabajador: 0,
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirmar_password: '',
      fecha_nacimiento: '',
      telefono: '',
      rfc: '',
      cubiculo: '',
      area_investigacion: '',
      materias: [],
    };
  }

  public validarMaestro(data: DatosMaestro, editar: boolean) {
    // Lógica de validación para los datos del maestro
    const error: any = {};

    // ID de trabajador
    if (!this.validatorService.required(data['id_trabajador'])) {
      error['id_trabajador'] = this.errorService.required;
    } else if (!this.validatorService.numeric(data['id_trabajador'])) {
      error['id_trabajador'] = this.errorService.numeric;
    }

    // Nombre y apellidos
    if (!this.validatorService.required(data['first_name'])) {
      error['first_name'] = this.errorService.required;
    }

    if (!this.validatorService.required(data['last_name'])) {
      error['last_name'] = this.errorService.required;
    }

    // Correo electrónico
    if (!this.validatorService.required(data['email'])) {
      error['email'] = this.errorService.required;
    } else if (!this.validatorService.max(data['email'], 40)) {
      error['email'] = this.errorService.max(40);
    } else if (!this.validatorService.email(data['email'])) {
      error['email'] = this.errorService.email;
    }

    // Contraseñas
    if (!editar) {
      if (!this.validatorService.required(data['password'])) {
        error['password'] = this.errorService.required;
      }

      if (!this.validatorService.required(data['confirmar_password'])) {
        error['confirmar_password'] = this.errorService.required;
      } else if (data['password'] !== data['confirmar_password']) {
        error['confirmar_password'] = 'Las contraseñas no coinciden';
      }
    }

    // Fecha de nacimiento
    if (!this.validatorService.required(data['fecha_nacimiento'])) {
      error['fecha_nacimiento'] = this.errorService.required;
    } else {
      const fechaNac = new Date(data['fecha_nacimiento']);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      const fechaMinima = new Date(1950, 0, 1);

      let edad = hoy.getFullYear() - fechaNac.getFullYear();
      const mes = hoy.getMonth() - fechaNac.getMonth();

      if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
        edad--;
      }

      if (isNaN(fechaNac.getTime()) || fechaNac < fechaMinima || fechaNac > hoy || edad < 18) {
        error['fecha_nacimiento'] = 'Fecha inválida';
      }
    }

    // Teléfono
    if (!this.validatorService.required(data['telefono'])) {
      error['telefono'] = this.errorService.required;
    } else if (!this.validatorService.numeric(data['telefono'])) {
      error['telefono'] = this.errorService.numeric;
    } else if (!this.validatorService.min(data['telefono'], 10)) {
      error['telefono'] = this.errorService.min(10);
    } else if (!this.validatorService.max(data['telefono'], 10)) {
      error['telefono'] = this.errorService.max(10);
    }

    // RFC
    if (!this.validatorService.required(data['rfc'])) {
      error['rfc'] = this.errorService.required;
    } else if (!this.validatorService.min(data['rfc'], 12)) {
      error['rfc'] = this.errorService.min(12);
    } else if (!this.validatorService.max(data['rfc'], 13)) {
      error['rfc'] = this.errorService.max(13);
    }

    // Cubículo
    if (!this.validatorService.required(data['cubiculo'])) {
      error['cubiculo'] = this.errorService.required;
    }

    // Área de investigación
    if (!this.validatorService.required(data['area_investigacion'])) {
      error['area_investigacion'] = this.errorService.required;
    }

    // Materias seleccionadas
    if (!data.materias || data.materias.length === 0) {
      error['materias'] = 'Debes seleccionar al menos una materia';
    }

    // errores encontrados
    return error;
  }
}
