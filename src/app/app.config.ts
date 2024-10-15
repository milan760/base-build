import { ApplicationConfig, ErrorHandler, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { ErrorHandlerService } from './services/errorHandler/error-handler.service';
import { InterceptService } from './services/customInterceptor/intercept.service';

export const appConfig: ApplicationConfig = {
  providers: [
    // { provide: HTTP_INTERCEPTORS, useClass: InterceptService, multi: true },
    provideRouter(routes),
    // provideHttpClient(),
    provideHttpClient(
      withInterceptors([InterceptService])
    ),
    importProvidersFrom(
      ToastrModule.forRoot(),
      BrowserAnimationsModule,
    ),
    provideAnimations(),
    { provide: ErrorHandler, useClass: ErrorHandlerService },
  ]
};
