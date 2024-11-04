import { Component, ViewChild } from '@angular/core';
import { StorageService } from '../../../services/storage/storage.service';
import { ModalDirective, ModalModule } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MdmService } from '../../../services/mdm/mdm.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrClientService } from '../../../services/toastr/toastr-client.service';
import { Observable, Subscriber } from 'rxjs';
import { UacService } from '../../uac/service/uac.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [ModalModule, ReactiveFormsModule, CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {

  userData: any;
  roleList: any;
  profileData: any;
  profileImage: any;

  myForm!: FormGroup;

  @ViewChild('editProfileModal', { static: false }) editProfileModal!: ModalDirective;

  paginatioObj = {
    isPaginationRequired: false,
    isOrderRequired: false,
    isAscending: false,
    pageNumber: 1,
    pageSize: 10,
    orderField: "",
    isSearchRequired: false,
    key: "",
    value: "",
  };

  constructor(
    private storageService: StorageService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private mdmService: MdmService,
    private uacService: UacService,
    private toastr: ToastrClientService,
    private _sanitizer: DomSanitizer
  ) {
    this.createFormInstance();
  }

  createFormInstance() {
    this.myForm = this.fb.group({
      id: [0],
      userName: [''],
      title: [''],
      firstName: [''],
      lastName: [''],
      emailId: [''],
      contactNo: [''],
      lastLogin: [''],
      examManagementId: this.fb.group({
        id: [0],
        examManagementName: [''],
        status: this.fb.group({
          statusId: [0],
          statusCode: ['']
        }),
        flag: []
      }),
      profilePic: [''],
      status: this.fb.group({
        statusId: [],
        statusCode: ['']
      }),
      role: this.fb.group({
        roleId: [0],
        roleName: [''],
        roleCode: [''],
        status: this.fb.group({
          statusId: [0],
          statusCode: ['']
        })
      }),
      registrationId: ['']
    })
  }

  ngOnInit(): void {
    console.log("inside user-profile");
    // this.getUserDetails();
    this.getProfileDetails();
    this.getRoleList(this.paginatioObj);
  }

  getUserDetails() {
    this.userData = this.storageService.getLocalStorageByAttribute('accessTokenDetails');
    console.log('userData', this.userData.user);
    this.profileData = this.userData.user;
  }

  getRoleList(pagination: any) {
    this.spinner.show();
    this.uacService.getRoleList(pagination).subscribe(
      {
        next: (res: any) => {
          if (res.roleResponse) {
            this.roleList = res.roleResponse;
          } else {
            this.toastr.infoToastr("no district found");
          }
        },
        error: (err) => {
          console.error('Error fetching captcha:', err);
          this.spinner.hide();
        },
        complete: () => {
          this.spinner.hide();
        }
      }
    );
  }

  ViewModal() {
    console.log('inside viewModal');
    if (this.profileData) {
      console.log(this.profileData);
      this.myForm.patchValue({
        id: this.profileData?.id || '',
        userName: this.profileData?.userName || '',
        firstName: this.profileData?.firstName || '',
        lastName: this.profileData?.lastName || '',
        contactNo: this.profileData?.contactNo || '',
        emailId: this.profileData?.emailId || '',
        role: {
          roleId: this.profileData.role.roleId
        }
      });
    }
    console.log('form value', this.myForm.value);
    this.editProfileModal.show();
  }

  hideModal(): void {
    this.editProfileModal.hide();
  }

  submitForm() {
    this.myForm.controls['contactNo'].enable();
    this.myForm.controls['emailId'].enable();
    console.log('myForm value', this.myForm.value);
    this.spinner.show();
    this.mdmService.updateProfile(this.myForm.value).subscribe({
      next: (res: any) => {
        if (res) {
          if (res.status == 1) {
            this.getProfileDetails();
            this.toastr.successToastr(res.statusDesc);
            this.createFormInstance();
            this.hideModal();
          } else {
            this.toastr.infoToastr(res.statusDesc);
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
    });
  }

  resetForm() {
    this.createFormInstance();
  }

  onFileChange($event: Event) {
    const inputElement = $event.target as HTMLInputElement;

    if (inputElement && inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      console.log("file", file);
      this.convertImageToBase64(file);
    } else {
      console.log("No file selected");
    }
  }

  convertImageToBase64(file: File) {
    const observable = new Observable((subscriber: Subscriber<any>) => {
      this.readFile(file, subscriber);
    });
    observable.subscribe((d) => {
      const profilePicControl = this.myForm.get("profilePic");
      if (profilePicControl) {
        profilePicControl.patchValue(d);
        console.log("byte array", d);
      } else {
        console.error("Form control 'profilePic' is not found.");
      }
    });
  }

  readFile(file: File, subscriber: Subscriber<any>) {
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

  getProfileDetails() {
    this.spinner.show();
    this.mdmService.profileDetails().subscribe({
      next: (res: any) => {
        if (res) {
          console.log(res);
          this.profileData = res;
          console.log('profiledata', this.profileData);
          // this.profileImage = this.userData.user.profilePic;
          this.profileImage = this._sanitizer.bypassSecurityTrustResourceUrl(res.profilePic);
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
}
