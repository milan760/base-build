import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastrClientService {

  constructor(
    private toastr: ToastrService
) { }

public successToastr(message: string) {
    this.toastr.success(message);
}

public warningToastr(message: string) {
    this.toastr.warning(message);
}

public dangerToastr(message: string) {
    this.toastr.error(message);
}

public infoToastr(message: string) {
    this.toastr.info(message);
}
}
