import { Component, ElementRef, HostListener, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { StorageService } from '../../../services/storage/storage.service';
import { ModalDirective, ModalModule } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../../services/authentication/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrClientService } from '../../../services/toastr/toastr-client.service';
import { MdmService } from '../../../services/mdm/mdm.service';
import { CommonService } from '../../../services/common/common.service';
import { UtilsService } from '../../../services/utils/utils.service';
import { Observable, Subscriber } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HorizontalMenuComponent } from '../horizontal-menu/horizontal-menu.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ModalModule, HorizontalMenuComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  @ViewChild('userDiv') userDiv!: ElementRef;
  @ViewChild('settingDiv') settingDiv!: ElementRef;
  @ViewChild('themeDiv') themeDiv!: ElementRef;
  @ViewChildren('colors') colors!: QueryList<ElementRef>;
  @ViewChild('ddd') ddd!: ElementRef;
  @ViewChild('ProfileModal', { static: false }) ProfileModal!: ModalDirective;
  @ViewChild('viewImageModal', { static: false }) viewImageModal!: ModalDirective;

  public myform!: FormGroup;
  public isUserIconVisible = false;
  public isSettingVisible = false;
  public isThemeVisible = false;
  public isSubmitClicked = false;
  public userData: any;
  public profileData: any;
  public profileImage: any;
  public url = "assets/UserImageProfile.png";
  public edit = false;
  public disable = true;
  public fileTypeflag: any;
  public fileSizeflag: any;

  public userProfile = {
    uName: 'ADMIN',
    email: 'admin@gmail.com',
    phone: '8249899566',
    firstname: '',
    LastName: '',
    profilePic: '',
    userType: ''
  }

  @HostListener('window:click', ['$event'])
  public openCloseDrop(event: any): void {
    // console.log(event.target, this.ddd.nativeElement, this.elementRef);
    // console.log(this.settingDiv.nativeElement);
    // console.log(this.elementRef.nativeElement.querySelectorAll("settingDiv"));
    if (event.target === this.settingDiv?.nativeElement) { // !this.elementRef.nativeElement.contains(event.target)
      console.log('true settingDiv');
      this.isUserIconVisible = false;
      this.isSettingVisible = true;
    } else if (event.target === this.userDiv.nativeElement) { // !this.elementRef.nativeElement.contains(event.target)
      console.log('true userDiv');
      this.isUserIconVisible = true;
      this.isSettingVisible = false;
    } else if (this.isSettingVisible && event.target === this.themeDiv.nativeElement) { // !this.elementRef.nativeElement.contains(event.target)
      console.log('true themeDiv');
      this.isThemeVisible = true;
    } else if (this.isThemeVisible = true && this.colors.some(color => color.nativeElement === event.target)) {
      console.log('true colors');
      // (this.child.find( (item , index) => index === 0 ).nativeElement as HTMLElement).click();
      // console.log(typeof (event.target), typeof (event.target as HTMLElement), typeof (this.ddd.nativeElement.children));
      console.log(Object.keys(this.ddd.nativeElement.children), event.target, this.ddd.nativeElement.children);
      let element = this.ddd.nativeElement;
      Object.keys(element.children).forEach(key => {
        // console.log(element.children[key], event.target);
        if (element.children[key].nativeElement == event.target) {
          console.log('yes');
        }
        if (element.children[key].children) {

        }
      });
      // console.log(this.ddd.nativeElement.forEach((ele: { nativeElement: any; }) => ele === event.target));
      // this.isSettingVisible = true;
      this.isThemeVisible = true;
    } else {
      // console.log('all false');
      this.isUserIconVisible = false;
      this.isSettingVisible = false;
      this.isThemeVisible = false;
    }
  }

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrClientService,
    private mdmservice: MdmService,
    public utilsService: UtilsService,
    public service: CommonService,
    public activeRoute: ActivatedRoute,
    public renderer: Renderer2,
    private elementRef: ElementRef,
    private storageService: StorageService,
  ) {
    this.createFormInstance();
    // this.renderer.listen('window', 'click', (e: Event) => {
    //   if (e.target !== this.settingDiv.nativeElement) {
    //     this.isSettingVisible = !this.isSettingVisible;
    //   } else {
    //     this.isSettingVisible = false;
    //   }
    // });
  }

  ngOnInit() {
    this.userData = this.storageService.getAccessDetailsFromLocalStorage();
  }

  private createFormInstance() {
    this.myform = this.fb.group({
      id: [0],
      userName: [''],
      title: [''],
      firstName: ['', Validators.pattern('^[a-zA-Z]+$')],
      lastName: ['', Validators.pattern('^[a-zA-Z]+$')],
      emailId: [''],
      contactNo: [''],
      lastlogin: [''],
      testingAgency: [0],
      profilePic: [''],
      password: [''],
      isEnabled: [],
      status: this.fb.group({
        statusId: [0],
        statusCode: ['']
      }),
      role: this.fb.group({
        roleId: [0],
        roleCode: [''],
        roleName: [''],
        status: this.fb.group({
          statusId: [0],
          statusCode: ['']
        })
      }),
    })
  }

  public getProfileDetails() {
    this.spinner.show();
    this.mdmservice.profileDetails().subscribe({
      next: (res: any) => {
        if (res) {
          this.profileData = res;
          this.profileImage = this.userData.user.profilePic;
        } else {
          this.toastr.infoToastr("No Profile Details Found !");
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

  public setTheme(themeName: any, event?: any) {
    console.log('themeName', themeName, 'themeName', event.target.value);
    switch (themeName) {
      case 'header': document.documentElement.style.setProperty('--header-color', event.target.value); break;
      case 'menu': document.documentElement.style.setProperty('--menu-color', event.target.value); break;
      case 'card': document.documentElement.style.setProperty('--darkTheme-color', event.target.value); break;
      case 'table': document.documentElement.style.setProperty('--lightTheme-color', event.target.value); break;
      case 'datacard': document.documentElement.style.setProperty('--lighterTheme-color', event.target.value); break;
      // default: return ''; break;
    }
  }

  public renderImage(profilePic: any) {
    if (profilePic != null) {
      profilePic = profilePic.replace("\\", "/").replace("\\", "/");
      return this.service.getMediaById(profilePic);
    } else {
      return '';
    }
  }

  public logout() {
    const token = this.storageService.getAccessDetailsFromLocalStorage();
    if (token) {
      const data = { "userName": token.user.userName, "token": token.refreshToken }
      console.log(data);
      this.spinner.show();
      this.authService.logout(data).subscribe({
        next: (res: any) => {
          if (res) {
            this.toastr.successToastr("Logout Succesfully");
          }
          // localStorage.removeItem('accessTokenDetails');
          this.storageService.clearAllLocalStorage();
          this.router.navigateByUrl('/landing-page/signin');
        },
        error: (err) => {
          this.spinner.hide();
          console.log(err);
        },
        complete: () => {
          this.spinner.hide();
        }
      });
    } else {
      this.storageService.clearAllLocalStorage();
    }
  }

  //convert image to byte array
  public OnselectNewFile($event: Event) {
    const inputElement = $event.target as HTMLInputElement;
    let file: any;

    if (inputElement && inputElement.files && inputElement.files.length > 0) {
      file = inputElement.files[0];
      console.log("file", file);
    } else {
      console.log("No file selected");
    }
    // const file = ($event.target as HTMLInputElement).files[0];

    console.log("file", file);
    if (!file.name.match(new RegExp(/\.(jpeg|png|JPEG|PNG|jpg|JPG)$/))) {
      this.toastr.infoToastr('Only .jpeg, .jpg or .png image format are allowed.');
      this.fileTypeflag = true;
      return;
    } else {
      this.fileTypeflag = false;
    }
    if (file.size > 1024 * 1024 * 1) {
      this.toastr.infoToastr('Maximum size of file should be 1mb');
      this.fileSizeflag = true
      return;
    } else {
      this.fileSizeflag = false
    }

    if (file) {
      this.convertImageToBase64(file);
    }
  }

  public convertImageToBase64(file: File) {
    const observable = new Observable((subscriber: Subscriber<any>) => {
      this.readFile(file, subscriber);
    });
    observable.subscribe((d) => {
      // var strImage = d.replace(/^data:image\/[a-z]+;base64,/, "");
      this.myform.get("profilePic")?.patchValue(d);
      // this.profileImage = d;
      console.log("byte array", d);
    });
  }

  public readFile(file: File, subscriber: Subscriber<any>) {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    console.log("filereader", fileReader);
    fileReader.onload = () => {
      subscriber.next(fileReader.result);
      console.log("filereader result", fileReader.result);
      subscriber.complete();
    };
    fileReader.onerror = (error) => {
      subscriber.error(error);
      subscriber.complete();
    };
  }

  public updateProfileData(data: any) {
    console.log("data", data)
    this.isSubmitClicked = true;
    if (this.myform.invalid) {
      return;
    }
    if (this.fileTypeflag) {
      this.toastr.infoToastr('Only .jpeg, .jpg or .png image format are allowed.');
      return;
    }
    if (this.fileSizeflag) {
      this.toastr.infoToastr('Maximum size of file should be 1mb');
      return;
    }
    this.spinner.show();
    this.mdmservice.updateProfile(data).subscribe(
      res => {
        console.log("on submit", res);
        if (res) {
          if (res.status == 1) {
            this.toastr.successToastr(res.statusDesc);
            // console.log('Uploaded Data', data);
            this.getProfileDetails();
            this.edit = false;
          }
        } else {
          this.toastr.infoToastr(res.statusDesc);
        }
      },
      error => {
        this.spinner.hide();
        this.toastr.dangerToastr('Something Went Wrong');
        // this.toastr.dangerToastr(error.status);
        console.log(error);
      },
      () => {
        this.spinner.hide();
      });
  }

  public hideTrackingModal(): void {
    this.ProfileModal.hide();
    this.edit = false;
  }

  public closeEditForm() {
    this.edit = false;
  }

  public goToChangePassword() {
    this.router.navigateByUrl('/pages/change-password');
  }

  public goToProfile() {
    // this.ProfileModal.show();
    this.getProfileDetails();
    this.router.navigateByUrl('/pages/user-profile');
  }

  public goToEdit() {
    this.edit = true;
  }

  public viewFileModal() {
    this.viewImageModal.show();
  }
  
  public hideFileModal() {
    this.viewImageModal.hide();
  }

}
