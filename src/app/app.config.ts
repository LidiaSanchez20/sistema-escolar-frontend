import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';
import { provideNgxMask } from 'ngx-mask';
//import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getSpanishPaginatorIntl } from './shared/spanish-paginator-intl';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    // Realiza las peticiones http, esta es la nueva forma de declararlo
    // El interceptor agrega el token de sesión a cada petición
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideRouter(routes),
    // Esta es la nueva forma de injectar el mask para que no le de errores
    // al momento de crear los formularios
    provideNgxMask(),
    // Registramos globalmente los charts para las graficas
    //provideCharts(withDefaultRegisterables()),
    // Configuración para el paginator en idioma español
    { provide: MatPaginatorIntl, useValue: getSpanishPaginatorIntl() },
  ]
};


