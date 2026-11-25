import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ErrorsService } from './tools/errors-service';
import { ValidatorService } from './tools/validator-service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

//Estas son variables para las cookies
const session_cookie_name = 'sistema-escolar-token';
const user_email_cookie_name = 'sistema-escolar-email';
const user_id_cookie_name = 'sistema-escolar-user_id';
const user_complete_name_cookie_name = 'sistema-escolar-user_complete_name';
const role_name_cookie_name = 'sistema-escolar-role_name';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private cookieService = inject(CookieService)
  private http = inject(HttpClient);
  private router = inject(Router);
  private validatorService = inject(ValidatorService);
  private errorService =  inject(ErrorsService);

  // Función para validar el usuario y la contraseña
  public validarLogin (username: string, password: string) {
    const data = {
      "username": username,
      "password": password
    };
    const error: any = {};

    if (!this.validatorService.required(data['username'])) {
      error['username'] = this.errorService.required;
    } else if (!this.validatorService.max(data['username'], 40)) {
      error['username'] = this.errorService.max(40);
    }else if (!this.validatorService.email(data['username'])) {
      error['username'] = this.errorService.email;
    }

    if (!this.validatorService.required(data['password'])) {
      error['password'] = this.errorService.required;
    }

    return error;
  }

  //Definir la función para enviar la solicitud de login al servidor y manejar la respuesta
  public login(username: string, password: string) {
    const data = {
      "username": username,
      "password": password
    };
    const jsonHeaders = {headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return this.http.post<any>(`${environment.url_api}/login/`, data, jsonHeaders);
  }

  //Función para cerrar la sesión
  public logout(): Observable<any> {
    const token = this.getSessionToken();
    const headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': 'Bearer '+token});
    return this.http.get<any>(`${environment.url_api}/logout/`, { headers });
  }

  // Funciones para manejar las cookies de sesión y autenticación del usuario


  // Esta funcion es para verificar si el usuario está autenticado
  public retrieveSignedUser(){
    const token = this.getSessionToken();
    const headers = new HttpHeaders({'Authorization': 'Bearer '+token});
    return this.http.get<any>(`${environment.url_api}/me/`, { headers });
  }

  // Esta funcion es para obtener el valor de una cookie por su clave
  public getCookieValue(key:string){
    return this.cookieService.get(key);
  }

  // Funcion para guardar el valor de una cookie con su clave y valor, y establecer las opciones de seguridad según el protocolo (HTTP o HTTPS)
  public saveCookieValue(key:string, value:string){
    const secure = environment.url_api.indexOf("https")!==-1;
    this.cookieService.set(key, value, undefined, undefined, undefined, secure, secure?"None":"Lax");
  }

  // Funcion para obtener el token de sesión del usuario desde la cookie correspondiente
  public getSessionToken(){
    return this.cookieService.get(session_cookie_name);
  }

  // Función para guardar los datos del usuario en cookies, incluyendo su id, email, nombre completo, token de sesión y rol.
  // Se verifica si la respuesta del servidor es plana o anidada en 'user' y se establecen las opciones de seguridad según el protocolo (HTTP o HTTPS).
  public saveUserData(user_data: any) {
    const secure = environment.url_api.indexOf("https") !== -1;
    // Soporta respuesta plana o anidada en 'user'
    const id = user_data.id || user_data.user?.id;
    const email = user_data.email || user_data.user?.email;
    const first_name = user_data.first_name || user_data.user?.first_name || '';
    const last_name = user_data.last_name || user_data.user?.last_name || '';
    const name = (first_name + " " + last_name).trim();
    this.cookieService.set(user_id_cookie_name, id, undefined, undefined, undefined, secure, secure ? "None" : "Lax");
    this.cookieService.set(user_email_cookie_name, email, undefined, undefined, undefined, secure, secure ? "None" : "Lax");
    this.cookieService.set(user_complete_name_cookie_name, name, undefined, undefined, undefined, secure, secure ? "None" : "Lax");
    this.cookieService.set(session_cookie_name, user_data.token, undefined, undefined, undefined, secure, secure ? "None" : "Lax");
    this.cookieService.set(role_name_cookie_name, user_data.rol, undefined, undefined, undefined, secure, secure ? "None" : "Lax");
  }

  // Función para eliminar todas las cookies del usuario
  public destroyUser(){
    this.cookieService.deleteAll();
  }

  // Función para obtener el email del usuario
  public getUserEmail(){
    return this.cookieService.get(user_email_cookie_name);
  }

  // Funcion para obtener el nombre completo del usuario
  public getUserCompleteName(){
    return this.cookieService.get(user_complete_name_cookie_name);
  }

  // Funcion para obtener el id del usuario
  public getUserId(){
    return this.cookieService.get(user_id_cookie_name);
  }

  // Funcion para obtener el rol del usuario
  public getUserRole(){
    return this.cookieService.get(role_name_cookie_name);
  }

  // ---- Role helpers (fuente única de verdad para toda la app) ----

  isAdmin(): boolean {
    return this.getUserRole() === 'administrador';
  }

  isTeacher(): boolean {
    return this.getUserRole() === 'maestro';
  }

  isStudent(): boolean {
    return this.getUserRole() === 'alumno';
  }

  canSeeAdminItems(): boolean {
    return this.isAdmin();
  }

  canSeeTeacherItems(): boolean {
    return this.isAdmin() || this.isTeacher();
  }

  canSeeStudentItems(): boolean {
    return this.isAdmin() || this.isTeacher() || this.isStudent();
  }

  canSeeHomeItem(): boolean {
    return this.isAdmin() || this.isTeacher();
  }

  canSeeRegisterItem(): boolean {
    return this.isAdmin() || this.isTeacher();
  }
}
