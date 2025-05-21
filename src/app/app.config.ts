import  { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS} from '@angular/common/http';

import { routes } from './app.routes';
import {provideHttpClient, withFetch} from '@angular/common/http';




import { TokenInterceptor } from '../services/token-interceptor.service';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch())]
};
