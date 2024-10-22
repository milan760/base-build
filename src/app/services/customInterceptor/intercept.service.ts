import { HttpErrorResponse, HttpEvent, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { catchError, concatMap, delay, map, of, retryWhen, tap, throwError } from "rxjs";
import { AuthService } from "../authentication/auth.service";

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
  const router = inject(Router);
  const authService = inject(AuthService);
  let token: any;

  try {
    token = localStorage.getItem('accessTokenDetails');
    console.log('token', token);
    console.log('isTokenExpired', jwtService.isTokenExpired(token.token));
  } catch (error) {
    console.warn(error);
    console.log('There is no access token');
  }
  // console.log('isTokenExpired', jwtService.isTokenExpired(token.token));

  // Check if the token is expired
  if (token && jwtService.isTokenExpired(token.token)) {
    // const data = { "userName": token.user.userName, "token": token.refreshToken }
    console.log('Token is expired. Logging out...');
    // authService.logout(data); // Logout the user
    // router.navigate(['/landing-page/signin']); // Redirect to login page
    // return throwError('Token expired'); // Stop the request
  }

  return next(req).pipe(
    retryWhen((error) =>
      error.pipe(
        concatMap((error, count) => {
          console.warn('interceptor concatMap');

          if (count < retryCount) { // Retry a maximum of 3 times
            if (error.status === 401) {
              console.warn('interceptor retry');
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

      // if (errorHandled) {
      //   return throwError(error); // Return the error to the subscriber
      // } else {
      //   return throwError(error); // Propagate the error to the subscriber
      // }
      // return throwError(error);
      return errorHandled ? throwError(error) : throwError(error);
    })
  );
};

// export const InterceptService: HttpInterceptorFn = (req, next) => {
//   // try {
//   //   const jwtService = inject(JwtHelperService);  // Attempt to inject JwtHelperService
//   //   console.log('after jwtservice');
//   //   console.log('jwtService', jwtService);
//   // } catch (error) {
//   //   console.error('Error injecting JwtHelperService:', error);  // Log any injection errors
//   // }
//   const jwtService = inject(JwtHelperService);
//   const router = inject(Router);
//   const authService = inject(AuthService);
//   let ifErrorHandled: boolean = false;


//   const token: any = localStorage.getItem('token');  // Or use a service to get token
//   // const data = { "userName": token.user.userName, "token": token.refreshToken }

//   // Check if the token is expired
//   // if (token && jwtService.isTokenExpired(token)) {
//   //   console.log('token', token);
//   //   console.log('isTokenExpired', jwtService.isTokenExpired(token));
//   //   const data = { "userName": token.user.userName, "token": token.refreshToken }
//   //   authService.logout(data);  // Logout the user
//   //   router.navigate(['/login']);  // Redirect to login page
//   //   return throwError('Token expired');
//   // }
//   setInterval(() => {
//     if (token && jwtService.isTokenExpired(token)) {
//       console.log('token', token);
//       console.log('isTokenExpired', jwtService.isTokenExpired(token));
//       const data = { "userName": token.user.userName, "token": token.refreshToken }
//       authService.logout(data);  // Logout the user
//       router.navigate(['/login']);  // Redirect to login page
//       // return throwError('Token expired');
//     }
//   }, 60000);
//   return next(req).pipe(
//     retryWhen(error =>
//       error.pipe(
//         concatMap((error, count) => {
//           console.warn('interceptor concatMap');

//           if (count < retryCount) {
//             if (error.status == 401) {
//               console.warn('interceptor retry');
//               return of(error); //  'returns back' from here and try again with out throwing error and continuing next line.
//               // can handel refresh token here.
//             }
//           }
//           return throwError(error); // throws error to the catchError
//         }),
//         delay(retryDelayMS),
//       )
//     ),
//     map((event: HttpEvent<any>) => {
//       return event;
//     }),
//     catchError((error: HttpErrorResponse) => {
//       console.error('Logging Interceptor Functional Error:', error);
//       if (error instanceof HttpErrorResponse) {
//         console.warn('catchError HttpErrorResponse', error.error, error.status, error.statusText, error.type);
//         if (error.error instanceof ErrorEvent) {
//           console.error("catchError Error Event");
//         } else {
//           switch (error.status) {
//             case 401:  // login
//               router.navigate(['/landing-page/login'], { queryParams: errorMsgs[error.status] });
//               ifErrorHandled = true;
//               break;
//             case 403: // forbidden
//               router.navigate(['/landing-page/login'], { queryParams: errorMsgs[error.status] }); // window.location.href = "index.html#/error";
//               ifErrorHandled = true;
//               break;
//             case 500: // internal server error
//               router.navigate(['/error'], { queryParams: errorMsgs[error.status] });
//               ifErrorHandled = true;
//               break;
//             case 404: // page not found
//               router.navigate(['/error'], { queryParams: errorMsgs[error.status] });
//               ifErrorHandled = true;
//               break;
//             case 400: // bad request
//               // this.router.navigate(['/error'], { queryParams: errorMsgs[error.status] });
//               // this.ifErrorHandled = true;
//               break;
//           }
//         }
//       } else {
//         console.error("Other Errors");
//       }

//       if (ifErrorHandled) {
//         console.log('return back');
//         // return of(error);
//         return throwError(error);
//       } else {
//         console.log('throw error back to the subscriber');
//         return throwError(error);
//         // this.clientErrorHandlerService.handleError(error);
//       }
//       // return throwError(error);
//     })
//   );

//   // return next(req);
// }


