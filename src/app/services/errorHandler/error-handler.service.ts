import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  // Error handling is important and needs to be loaded first, Because of this we should manually inject the services with help of Injector. i.e, this.injector.get(ActivatedRoute)
  // I've made some research and here is the reason why it behaves this way:
  // Since you're throwing an error in your service, the component which is using the service cannot be destroyed, thus the router is not able to release it. Thanks @TetraDev for pointing this out.
  // While someone might think it's an Angular bug I cannot confirm because I haven't found an open issue regarding it (feel free to update the answer if you have the link).
  // In order to resolve your problem I suggest not to use Router in this case and perform a browser redirect window.location.href = '/error'; instead.

  // public navigationServiceV: NavigationService;

  // If the control comes inside the HandleError Function, we can't able to navigate because instance in the constructor like Router, ActivateRoute
  // will not work resulting undefined.

  constructor() { }

  handleError(error: Error | HttpErrorResponse) {
    if (!navigator.onLine) {
      console.warn('BROWSER OFFLINE ERROR!'); // Handle offline error
      return throwError(error); // throw error back to to the subscriber
    } else if (error instanceof HttpErrorResponse) { // HttpErrorResponse // Server or connection error
      console.warn('HttpErrorResponse', error.status, error.error);
      return throwError(error); // throw error back to to the subscriber
    }
    else if (error instanceof Error) { // Handle Client Error (Angular Error, ReferenceError etc...)
      console.warn('CLIENT OR ANGULAR ERROR!', error, error.message, error.name, error.stack);
      return throwError(error); // throw error back to to the subscriber
    }
    else {
      console.warn('UNKNOWN ERROR', error);
      return throwError(error); // throw error back to to the subscriber
    }
  }
}
