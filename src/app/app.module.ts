import { provideRouter } from '@angular/router';
import { ApplicationConfig } from '@angular/core';
import { routes } from './app.routes'; // Asegúrate de que la ruta sea correcta

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes)
    // Otros providers según sea necesario
  ]
};
