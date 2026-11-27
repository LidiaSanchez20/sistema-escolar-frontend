import { HttpErrorResponse } from '@angular/common/http';

// Obtiene el mensaje que envía el backend en una respuesta de error.
// Django REST Framework responde con "message", "details", "detail" o con
// un objeto de errores por campo, por ejemplo { "email": ["..."] }.
export function mensajeError(error: unknown, porDefecto: string): string {
  if (!(error instanceof HttpErrorResponse)) {
    return porDefecto;
  }

  // Estado 0: el servidor no respondió (backend apagado o error de CORS)
  if (error.status === 0) {
    return 'No hay conexión con el servidor. Verifique que el backend esté en ejecución.';
  }

  const cuerpo = error.error;

  if (typeof cuerpo === 'string' && cuerpo.trim() !== '' && cuerpo.length < 200) {
    return cuerpo;
  }

  if (cuerpo && typeof cuerpo === 'object') {
    for (const clave of ['message', 'details', 'detail']) {
      if (typeof cuerpo[clave] === 'string') {
        return cuerpo[clave];
      }
    }

    // Errores por campo: se toma el primero que llegue
    const primero = Object.values(cuerpo)[0];
    if (Array.isArray(primero) && typeof primero[0] === 'string') {
      return primero[0];
    }
  }

  return porDefecto;
}
