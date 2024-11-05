import { HttpErrorResponse, HttpEvent, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { catchError, concatMap, delay, map, of, retryWhen, tap, throwError } from "rxjs";
import { AuthService } from "../authentication/auth.service";
import { StorageService } from "../storage/storage.service";

export const retryCount = 1;
export const retryDelayMS = 2000;
export const errorMsgs = {
  '0': {
    errCode: 0,
    errName: 'Failed To Load Response',
    errDesc: 'Sorry, server is not responding at this movement, Pleasse try after sometime',
    buttonMsg: 'Back',
    redirectLink: ''
  },
  '401': {
    errCode: 401,
    errName: 'Access Denied',
    errDesc: 'Sorry, You are not authorized! , Your requested couldn\'t be authenticated',
    buttonMsg: 'Login',
    redirectLink: '/landing-page/login'
  },
  '403': {
    errCode: 403,
    errName: 'Access forbidden',
    errDesc: 'Sorry, Access to the requested resource is forbidden!, You don\'t have permission to access this page',
    buttonMsg: 'Back',
    redirectLink: ''
  },
  '404': {
    errCode: 404,
    errName: 'Page Not Found',
    errDesc: 'Sorry, We can\'t find that page! , Either something went wrong or page doesn\'t exist anymore',
    buttonMsg: 'Back',
    redirectLink: ''
  },
  '500': {
    errCode: 500,
    errName: 'Internal Server Error',
    errDesc: 'Sorry, We had some technical problem! , Either something went wrong or some problem occured during last operation',
    buttonMsg: 'Back',
    redirectLink: ''
  },
  'default': {
    errCode: 'Error',
    errName: 'Unknown Error',
    errDesc: 'Something went wrong',
    buttonMsg: 'Login',
    redirectLink: ''
  }
};

export const InterceptService: HttpInterceptorFn = (req, next) => {
  const jwtService = inject(JwtHelperService);
  const storageService = inject(StorageService);
  const router = inject(Router);
  const authService = inject(AuthService);
  let token: any;

  try {
    token = storageService.getLocalStorageByAttribute('accessTokenDetails');
  } catch (error) {
    console.warn(error);
  }

  // Check if the token is expired
  if (token && jwtService.isTokenExpired(token.token)) {
    // const accessTokenDetails = storageService.getLocalStorageByAttribute('accessTokenDetails');
    const data = { "userName": token.user.userName, "token": token.refreshToken }
    authService.logout(data); // Logout the user
    router.navigate(['/landing-page/signin']); // Redirect to login page
    // return throwError('Token expired'); // Stop the request
  }

  return next(req).pipe(
    retryWhen((error) =>
      error.pipe(
        concatMap((error, count) => {

          if (count < retryCount) { // Retry a maximum of 3 times
            if (error.status === 401) {
              // Handle refresh token logic here if needed
              return of(error); // Retry the request
            }
          }
          return throwError(error); // Throw error to the catchError
        }),
        delay(retryDelayMS) // Delay before retrying
      )
    ),
    map((event: HttpEvent<any>) => {
      return event; // Pass the event along
    }),
    catchError((error: HttpErrorResponse) => {
      console.error('Logging Interceptor Functional Error:', error);
      let errorHandled = false;

      if (error instanceof HttpErrorResponse) {
        console.warn('catchError HttpErrorResponse', error.error, error.status, error.statusText, error.type);

        switch (error.status) {
          case 401:
            router.navigate(['/landing-page/signin'], { queryParams: { queryParams: errorMsgs[error.status] } });
            errorHandled = true;
            break;
          case 403:
            router.navigate(['/landing-page/signin'], { queryParams: { queryParams: errorMsgs[error.status] } });
            errorHandled = true;
            break;
          case 500:
            router.navigate(['/error'], { queryParams: { queryParams: errorMsgs[error.status] } });
            errorHandled = true;
            break;
          case 404:
            router.navigate(['/error'], { queryParams: { queryParams: errorMsgs[error.status] } });
            errorHandled = true;
            break;
          // Handle other statuses as needed
        }
      }

      return errorHandled ? throwError(error) : throwError(error);
    })
  );
};

