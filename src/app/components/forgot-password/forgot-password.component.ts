import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/authentication/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {

  public userName = '';
  public password = '';
  public cnfPassword = '';
  public otp = '';
  public forgotPasswordFG!: FormGroup;
  public isOtpSend: boolean = false;

  constructor(
    private forgotPassword: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.createForgotpasswordForm();
  }

  submit() {
    // this.password = sha512Hash(this.password);
  }

  public createForgotpasswordForm() {
    // this.forgotPasswordFG = this.forgotPassword.group({
    //   userName: [this.userName],
    //   password: ['', Validators.compose([Validators.required])],
    //   cnfPassword: ['', Validators.compose([Validators.required])],
    //   otp: ['', Validators.compose([Validators.required])]
    // });
    // this.forgotPasswordFG.controls.username.setValue(this.userName);
  }

  sendOtp() {
    // this.authService.getSendOTP(this.userName).subscribe(res => {
    //   console.log(res);
    //   this.isOtpSend = true;
    // });
  }

  submitforgotPassword(data: any) {
    // data.userName = this.userName;
    // data.password = sha512Hash(data.password);
    // data.cnfPassword = sha512Hash(data.cnfPassword);
    // console.log("submitforgotPassword data::", data);
    // this.authService.submitforgotPassword(data).subscribe(result => {
    //   console.log(result);
    //   this.toastr.success(result.statusDesc);
    //   this.router.navigate(['/login']);
    // }, error => {
    //   this.toastr.error(error['statusDesc']);
    // });
  }
}
