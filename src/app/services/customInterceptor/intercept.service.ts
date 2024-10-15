import { HttpErrorResponse, HttpEvent, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, concatMap, delay, map, of, retryWhen, tap, throwError } from "rxjs";

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
  const router = inject(Router);
  let ifErrorHandled: boolean = false;
  console.log('Request URL: ' + req.url);
  return next(req).pipe(
    retryWhen(error =>
      error.pipe(
        concatMap((error, count) => {
          console.warn('interceptor concatMap');

          if (count < retryCount) {
            if (error.status == 401) {
              console.warn('interceptor retry');
              return of(error); //  'returns back' from here and try again with out throwing error and continuing next line.
              // can handel refresh token here.
            }
          }
          return throwError(error); // throws error to the catchError
        }),
        delay(retryDelayMS),
      )
    ),
    map((event: HttpEvent<any>) => {
      console.log('Event:', event);
      return event;
    }),
    catchError((error: HttpErrorResponse) => {
      console.error('Logging Interceptor Functional Error:', error);
      if (error instanceof HttpErrorResponse) {
        console.warn('catchError HttpErrorResponse', error.error, error.status, error.statusText, error.type);
        if (error.error instanceof ErrorEvent) {
          console.error("catchError Error Event");
        } else {
          switch (error.status) {
            case 401:  // login
              router.navigate(['/landing-page/login'], { queryParams: errorMsgs[error.status] });
              ifErrorHandled = true;
              break;
            case 403: // forbidden
              router.navigate(['/landing-page/login'], { queryParams: errorMsgs[error.status] }); // window.location.href = "index.html#/error";
              ifErrorHandled = true;
              break;
            case 500: // internal server error
              router.navigate(['/error'], { queryParams: errorMsgs[error.status] });
              ifErrorHandled = true;
              break;
            case 404: // page not found
              router.navigate(['/error'], { queryParams: errorMsgs[error.status] });
              ifErrorHandled = true;
              break;
            case 400: // bad request
              // this.router.navigate(['/error'], { queryParams: errorMsgs[error.status] });
              // this.ifErrorHandled = true;
              break;
          }
        }
      } else {
        console.error("Other Errors");
      }

      if (ifErrorHandled) {
        console.log('return back');
        // return of(error);
        return throwError(error);
      } else {
        console.log('throw error back to the subscriber');
        return throwError(error);
        // this.clientErrorHandlerService.handleError(error);    
      }
      // return throwError(error);
    })
  );
}








// import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
// import { Observable, retryWhen, concatMap, of, throwError, delay, map, catchError } from 'rxjs';

// export const retryCount = 1;
// export const retryDelayMS = 2000;
// export const errorMsgs = {
//   '0': {
//     errCode: 0,
//     errName: 'Failed To Load Response',
//     errDesc: 'Sorry, server is not responding at this movement, Pleasse try after sometime',
//     buttonMsg: 'Back',
//     redirectLink: ''
//   },
//   '401': {
//     errCode: 401,
//     errName: 'Access Denied',
//     errDesc: 'Sorry, You are not authorized! , Your requested couldn\'t be authenticated',
//     buttonMsg: 'Login',
//     redirectLink: '/landing-page/login'
//   },
//   '403': {
//     errCode: 403,
//     errName: 'Access forbidden',
//     errDesc: 'Sorry, Access to the requested resource is forbidden!, You don\'t have permission to access this page',
//     buttonMsg: 'Back',
//     redirectLink: ''
//   },
//   '404': {
//     errCode: 404,
//     errName: 'Page Not Found',
//     errDesc: 'Sorry, We can\'t find that page! , Either something went wrong or page doesn\'t exist anymore',
//     buttonMsg: 'Back',
//     redirectLink: ''
//   },
//   '500': {
//     errCode: 500,
//     errName: 'Internal Server Error',
//     errDesc: 'Sorry, We had some technical problem! , Either something went wrong or some problem occured during last operation',
//     buttonMsg: 'Back',
//     redirectLink: ''
//   },
//   'default': {
//     errCode: 'Error',
//     errName: 'Unknown Error',
//     errDesc: 'Something went wrong',
//     buttonMsg: 'Login',
//     redirectLink: ''
//   }
// };

// @Injectable({
//   providedIn: 'root'
// })
// export class InterceptService implements HttpInterceptor {

//   public ifErrorHandled: boolean = false;

//   constructor(private router: Router) {
//     console.log('constructor : HttpInterceptor');
//   }

//   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     console.log('intercept INVOKED');

//     if (1) { //check url startsWith word (for intercept).
//       return next.handle(request).pipe(
//         retryWhen(error =>
//           error.pipe(
//             concatMap((error, count) => {
//               console.warn('interceptor concatMap');

//               if (count < retryCount) {
//                 if (error.status == 401) {
//                   console.warn('interceptor retry');
//                   return of(error); //  'returns back' from here and try again with out throwing error and continuing next line.
//                   // can handel refresh token here.
//                 }
//               }
//               return throwError(error); // throws error to the catchError
//             }),
//             delay(retryDelayMS),
//           )
//         ),
//         map((event: HttpEvent<any>) => { // if no error
//           if (event instanceof HttpResponse) {
//             console.warn('interceptor success map');
//             return event;
//           } else {
//             return;
//           }
//         }),
//         catchError((error) => {
//           if (error instanceof HttpErrorResponse) {
//             console.warn('catchError HttpErrorResponse', error.error, error.status, error.statusText, error.type);
//             if (error.error instanceof ErrorEvent) {
//               console.error("catchError Error Event");
//             } else {
//               switch (error.status) {
//                 case 401:  // login
//                   this.router.navigate(['/landing-page/login'], { queryParams: errorMsgs[error.status] });
//                   this.ifErrorHandled = true;
//                   break;
//                 case 403: // forbidden
//                   this.router.navigate(['/landing-page/login'], { queryParams: errorMsgs[error.status] }); // window.location.href = "index.html#/error";
//                   this.ifErrorHandled = true;
//                   break;
//                 case 500: // internal server error
//                   this.router.navigate(['/error'], { queryParams: errorMsgs[error.status] });
//                   this.ifErrorHandled = true;
//                   break;
//                 case 404: // page not found
//                   this.router.navigate(['/error'], { queryParams: errorMsgs[error.status] });
//                   this.ifErrorHandled = true;
//                   break;
//                 case 400: // bad request
//                   // this.router.navigate(['/error'], { queryParams: errorMsgs[error.status] });
//                   // this.ifErrorHandled = true;
//                   break;
//               }
//             }
//           } else {
//             console.error("Other Errors");
//           }

//           if (this.ifErrorHandled) {
//             console.log('return back');
//             return of(error);
//           } else {
//             console.log('throw error back to the subscriber');
//             return throwError(error);
//             // this.clientErrorHandlerService.handleError(error);
//           }

//         })
//       );
//     } else {
//       return next.handle(request);
//     }

//     // tap(evt => { // can use tap operator if we use return next.handle(request).do(
//     //   if (evt instanceof HttpResponse) {
//     // }),
//     // .catch((response) => {
//     //   return Observable.throw("some error");
//     // });
//   }
// }
