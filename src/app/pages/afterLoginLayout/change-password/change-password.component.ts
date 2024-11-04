import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { matchingPasswords, passwordValidator } from '../../../validators/custom.validator';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrClientService } from '../../../services/toastr/toastr-client.service';
import { EncryptionService } from '../../../services/encryption/encryption.service';
import { MdmService } from '../../../services/mdm/mdm.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {

  myForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrClientService,
    private encryptionService: EncryptionService,
    private mdmservice: MdmService,
    private router: Router
  ) {
    this.createFormInstance();
  }

  createFormInstance() {
    this.myForm = this.fb.group({
      oldPassword: ['', Validators.compose([Validators.required])],
      newPassword: ['', Validators.compose([passwordValidator, Validators.required])],
      confirmPassword: ['', Validators.compose([Validators.required])],
    }, {
      validator: matchingPasswords('newPassword', 'confirmPassword')
    })
  }

  public submitForm(data: any) {
    console.log('data', data);
    if (data.oldPassword === '' || data.newPassword === '' || data.confirmPassword === '') {
      this.toastr.warningToastr('Fill all the field');
      return;
    }
    if (data.newPassword !== data.confirmPassword) {
      this.toastr.warningToastr('password mismatch');
      return;
    }
    let oldPassword = this.encryptionService.encodePassword(data.oldPassword, 2);
    let newPassword = this.encryptionService.encodePassword(data.newPassword, 2);
    let confirmPassword = this.encryptionService.encodePassword(data.confirmPassword, 2);
    let changePswd = {
      oldPassword: oldPassword,
      newPassword: newPassword,
      confirmPassword: confirmPassword
    }
    this.spinner.show();
    this.mdmservice.createPassword(changePswd).subscribe({
      next: (res: any) => {
        if (res) {
          if (res.status === 1) {
            this.toastr.successToastr(res.statusDesc);
            this.router.navigateByUrl('landing-page/signin');
          } else {
            this.toastr.infoToastr(res.statusDesc);
          }
        } else {
          this.toastr.infoToastr(res.statusDesc);
        }
      },
      error: (err) => {
        console.error(err);
        this.spinner.hide();
      },
      complete: () => {
        this.spinner.hide();
      }
    })
  }
}
