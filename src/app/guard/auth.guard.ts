import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../services/storage/storage.service';
import { of } from 'rxjs';
import { ToastrClientService } from '../services/toastr/toastr-client.service';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const storageService = inject(StorageService);
  const toastrClientService = inject(ToastrClientService);

  let loggedInRole = storageService.getRoleFromLocalStorage();

  if (!loggedInRole) {
    toastrClientService.dangerToastr('Please Login');
    router.navigateByUrl('/landing-page/signin');
    return of(false);
  }
  if (route.data['roles'] && route.data['roles'].indexOf(loggedInRole) === -1) {
    toastrClientService.dangerToastr('YOU ARE NOT AUTHARIZED TO ACCESS THIS LINK');
    return of(false);
  }
  return of(true);
};
