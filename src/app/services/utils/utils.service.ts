import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  public checkFormControlValidity(isSubmitBtnClicked: boolean, formGroup: any, formControlName: string) {
    if (
      (isSubmitBtnClicked && formGroup.controls[formControlName].invalid) || (formGroup.controls[formControlName].invalid && (formGroup.controls[formControlName].dirty))
    ) {
      return true;
    } else {
      return false;
    }
  }
}
