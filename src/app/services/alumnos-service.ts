import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ErrorsService } from './tools/errors-service';
import { ValidatorService } from './tools/validator-service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { AlumnoApi, ErroresFormulario, RegistroAlumno } from '../interfaces/usuarios.interfaces';


@Injectable({
  providedIn: 'root',
})
export class AlumnosService {
  // Inyectar los servicios para validaciones y errores
  private http = inject(HttpClient);
  private validatorService = inject(ValidatorService);
  private errorService = inject(ErrorsService);

  // Método para definir el esquema de validación para los datos del alumno
  public esquemaAlumno(): RegistroAlumno {
    return {
      rol: '',
      matricula: '',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirmar_password: '',
      fecha_nacimiento: null,
      curp: '',
      rfc: '',
      edad: null,
      telefono: '',
      ocupacion: ''
    };
  }

  public validarAlumno(data: RegistroAlumno, editar: boolean): ErroresFormulario {
    // Lógica de validación para los datos del alumno
    const error: ErroresFormulario = {};

    // Validaciones
    if (!this.validatorService.required(data['matricula'])) {
      error['matricula'] = this.errorService.required;
    }

    // Nombre
    if (!this.validatorService.required(data['first_name'])) {
      error['first_name'] = this.errorService.required;
    }

    // Apellido
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

    // Contraseñas (requeridas; la coincidencia se valida en el componente para mostrar el snackbar)
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
      const fechaNac = new Date(data['fecha_nacimiento']!);
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

    // CURP
    if (!this.validatorService.required(data['curp'])) {
      error['curp'] = this.errorService.required;
    } else if (!this.validatorService.min(data['curp'], 18)) {
      error['curp'] = this.errorService.min(18);
    } else if (!this.validatorService.max(data['curp'], 18)) {
      error['curp'] = this.errorService.max(18);
    }

    // RFC
    if (!this.validatorService.required(data['rfc'])) {
      error['rfc'] = this.errorService.required;
    } else if (!this.validatorService.min(data['rfc'], 12)) {
      error['rfc'] = this.errorService.min(12);
    } else if (!this.validatorService.max(data['rfc'], 13)) {
      error['rfc'] = this.errorService.max(13);
    }

    // Edad
    if (!this.validatorService.required(data['edad'])) {
      error['edad'] = this.errorService.required;
    } else if (!this.validatorService.numeric(data['edad'])) {
      error['edad'] = 'El formato es solo números';
    } else if (Number(data['edad']) < 18) {
      error['edad'] = 'La edad debe ser mayor o igual a 18';
    }

    // teléfono
    if (!this.validatorService.required(data['telefono'])) {
      error['telefono'] = this.errorService.required;
    } else if (!this.validatorService.numeric(data['telefono'])) {
      error['telefono'] = this.errorService.numeric;
    } else if (!this.validatorService.min(data['telefono'], 10)) {
      error['telefono'] = this.errorService.min(10);
    } else if (!this.validatorService.max(data['telefono'], 10)) {
      error['telefono'] = this.errorService.max(10);
    }

    // Ocupación
    if (!this.validatorService.required(data['ocupacion'])) {
      error['ocupacion'] = this.errorService.required;
    }

    // Return JSON con los errores encontrados, si no hay errores el JSON estará vacío
    return error;
  }

  // El backend recibe la fecha de nacimiento como texto (YYYY-MM-DD) y no como Date
  public registrarAlumno(data: Omit<RegistroAlumno, 'fecha_nacimiento'> & { fecha_nacimiento: string }): Observable<unknown> {
    return this.http.post<unknown>(`${environment.url_api}/alumnos/`, data);
  }

  // Método para obtener la lista de alumnos desde la base de datos
  public obtenerListaAlumnos(): Observable<AlumnoApi[]> {
    return this.http.get<AlumnoApi[]>(`${environment.url_api}/lista-alumnos/`);
  }
}
