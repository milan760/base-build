import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../services/authentication/auth.service';
import { MdmService } from '../../services/mdm/mdm.service';
import { ToastrClientService } from '../../services/toastr/toastr-client.service';
import { UtilsService } from '../../services/utils/utils.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CaptchaComponent } from '../captcha/captcha.component';
import { CommonModule } from '@angular/common';
import { EncryptionService } from '../../services/encryption/encryption.service';
import { StorageService } from '../../services/storage/storage.service';
import { AppConstants } from '../../app.constant';
import { Router, RouterLink } from '@angular/router';
import { Roles } from '../../model/roles.enum';

interface Agency {
  id: string;
  examManagementName: string;
}

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, CaptchaComponent, RouterLink],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent {

  public loginForm!: FormGroup;

  public captchaURL: any = '';
  public captchaKey: any = '';

  public getAllConductingAgency: Agency[] = [];

  public isSubmitClicked: boolean = false;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private mdmService: MdmService,
    private toastr: ToastrClientService,
    private encryptService: EncryptionService,
    private storageService: StorageService,
    private router: Router,
    public utilsService: UtilsService,
    public sanitizer: DomSanitizer
  ) {
    this.createLoginFormInstance();
  }

  public createLoginFormInstance() {
    this.loginForm = this.fb.group({
      // examManagementId: ['', Validators.compose([Validators.required])],
      username: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
      captcha: ['', Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {
    this.getCaptcha();
    // this.getAllExamConductingAgency();
  }

  public getCaptcha() {
    this.spinner.show();
    this.authService.getCaptchaWithCaptchaKeyHeader().subscribe({
      next: (response: any) => {

        const captchaKey = response.headers?.get('captchaKey');
        if (captchaKey) {
          this.captchaKey = captchaKey;
        }

        if (response.body) {
          this.createImageFromBlob(response.body);
        }
      },
      error: (err) => {
        console.error('Error fetching captcha:', err);
        this.spinner.hide();
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }

  public createImageFromBlob(image: Blob) {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.captchaURL = reader.result;
    }, false);
    if (image) {
      reader.readAsDataURL(image);
    }
    this.spinner.hide();
  }

  public getAllExamConductingAgency() {
    this.spinner.show();
    this.mdmService.getAllExamConductingAgency().subscribe({
      next: (response: any) => {
        if (response) {
          this.getAllConductingAgency = response;
        } else {
          this.toastr.infoToastr("no records found");
        }
      },
      error: (err) => {
        console.error('Error fetching captcha:', err);
        this.spinner.hide();
      },
      complete: () => {
        this.spinner.hide();
      }
    })
  }

  public getLoginData(data: any) {
    console.log('hgjfdk');
    this.isSubmitClicked = true;
    if (this.loginForm.invalid) {
      return;
    }
    if (data.captcha) {
      let encPassword = null;
      encPassword = this.encryptService.encryptPasswordWithSalt(data.password, data.captcha);
      const loginData: object = {
        // 'examManagementId': Number(data.examManagementId),
        'username': data.username,
        'password': encPassword,
        'captcha': data.captcha
      };
      this.spinner.show();
      this.authService.login(loginData, this.captchaKey).subscribe({
        next: (res: any) => {
          if (res) {
            console.log(res);
            this.storageService.setSessionAttribute('isLoggedIn', true);
            this.storageService.setLocalStorageByAttribute('accessTokenDetails', res);
            AppConstants.ACCESS_DETAILS = JSON.parse(localStorage.getItem('accessTokenDetails') || '{}');
            this.spinner.hide();
            if ([Roles.ROLE_ORGADMIN].includes(res?.roleCode)) {
              this.router.navigate(['/pages/uac/dashboard']);
            }
          }
        },
        error: (err) => {
          console.error('Error fetching captcha:', err);
          this.spinner.hide();
        },
        complete: () => {
          this.spinner.hide();
        }
      })
    }
  }

}
