// Creamos estas interfaces para mantener más limpio el codigo
// Tambien para dividirlo por tipo de usuario
// La ventaja es que se pueden importar y ya no se ven tan largas las clases de los servicios
//No se saturan de código y se pueden mantener más organizadas las clases de los servicios

// Campos de los formularios que pueden mostrar un mensaje de error
export type CampoFormulario =
  | 'username' | 'general'
  | 'clave_admin' | 'id_trabajador'
  | 'first_name' | 'last_name' | 'email' | 'password' | 'confirmar_password'
  | 'fecha_nacimiento' | 'telefono' | 'rfc' | 'edad' | 'ocupacion'
  | 'cubiculo' | 'area_investigacion' | 'materias_array'
  | 'matricula' | 'curp';

// Errores de validación de un formulario: cada campo apunta al mensaje que se muestra
export type ErroresFormulario = Partial<Record<CampoFormulario, string>>;

// Datos de la cuenta de acceso (tabla de usuarios del backend) que vienen anidados en "user"
export interface UsuarioApi {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

// Respuesta del backend al iniciar sesión
export interface RespuestaLogin {
  id?: number;
  email?: string;
  first_name?: string;
  last_name?: string;
  user?: UsuarioApi;
  token: string;
  rol: string;
}

// Registro de administrador tal como lo devuelve /lista-admins/
export interface AdministradorApi {
  id: number;
  user: UsuarioApi;
  clave_admin: string;
  telefono: string;
  rfc: string;
  edad: number;
  ocupacion: string;
}

// Registro de maestro tal como lo devuelve /lista-maestros/
export interface MaestroApi {
  id: number;
  user: UsuarioApi;
  id_trabajador: string;
  fecha_nacimiento: string;
  telefono: string;
  rfc: string;
  cubiculo: string;
  area_investigacion: string;
  materias_array: string[];
}

// Registro de alumno tal como lo devuelve /lista-alumnos/
export interface AlumnoApi {
  id: number;
  user: UsuarioApi;
  matricula: string;
  curp: string;
  rfc: string;
  fecha_nacimiento: string;
  edad: number;
  telefono: string;
  ocupacion: string;
}

// Modelo del formulario de registro de alumnos
export interface RegistroAlumno {
  rol: string;
  matricula: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmar_password: string;
  fecha_nacimiento: Date | null;
  curp: string;
  rfc: string;
  edad: number | null;
  telefono: string;
  ocupacion: string;
}

// Modelo del formulario de registro de maestros
export interface RegistroMaestro {
  rol: string;
  id_trabajador: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmar_password: string;
  fecha_nacimiento: Date | null;
  telefono: string;
  rfc: string;
  cubiculo: string;
  area_investigacion: string;
  materias: string[];
}

//Interfaz datos de usuario de administrador
export interface DatosAdministrador {
  rol: string;
  clave_admin: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmar_password: string;
  telefono: string;
  rfc: string;
  edad: number;
  ocupacion: string;
}
// Interfaz datos de usuario de maestro
export interface DatosMaestro {
  id: number;
  id_trabajador: number;
  first_name: string;
  last_name: string;
  email: string;
  fecha_nacimiento: string;
  telefono: string;
  rfc: string;
  cubiculo: string;
  area_investigacion: string;
}

// Interfaz datos de usuario de alumno
export interface DatosAlumno {
  id: number;
  matricula: number;
  first_name: string;
  last_name: string;
  email: string;
  fecha_nacimiento: string;
  curp: string;
  rfc: string;
  edad: number;
  telefono: string;
  ocupacion: string;
}
