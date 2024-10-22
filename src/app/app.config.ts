import { ApplicationConfig, ErrorHandler, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { ErrorHandlerService } from './services/errorHandler/error-handler.service';
import { InterceptService } from './services/customInterceptor/intercept.service';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';

export const appConfig: ApplicationConfig = {
  providers: [
    JwtHelperService,
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(
      ToastrModule.forRoot(),
      BrowserAnimationsModule,
    ),
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    {
      provide: JWT_OPTIONS,
      useValue: {
        tokenGetter: () => localStorage.getItem('token')
      }
    },
    provideHttpClient(
      withInterceptors([InterceptService])
    ),
  ]
};
