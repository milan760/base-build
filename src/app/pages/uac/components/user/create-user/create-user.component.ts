import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrClientService } from '../../../../../services/toastr/toastr-client.service';
import { CommonService } from '../../../../../services/common/common.service';
import { UacService } from '../../../service/uac.service';
import { Observable, Subscriber } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss'
})
export class CreateUserComponent {
  public myform!: FormGroup;

  public dataForEdit: any;
  public roleList: any;

  public paginatioObj = {
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
    private fb: FormBuilder,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrClientService,
    public service: CommonService,
    private uacService: UacService
  ) {
    this.createFormInstance();
  }

  public createFormInstance() {
    this.myform = this.fb.group({
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

  ngOnInit() {
    this.getDataForEdit();
    this.getRoleList(this.paginatioObj);
  }

  public getDataForEdit() {
    this.dataForEdit = this.service.getStoredDetails();
    console.log('dataforedit', this.dataForEdit);
    if (this.dataForEdit != null) {
      this.myform.patchValue(this.dataForEdit);
      console.log(this.myform.value);
      this.myform.controls['contactNo'].disable();
      this.myform.controls['emailId'].disable();
    }
  }

  public getRoleList(pagination: any) {
    this.spinner.show();
    this.uacService.getRoleList(pagination).subscribe(
      (res) => {
        if (res.roleResponse) {
          this.roleList = res.roleResponse;
        } else {
          this.toastr.infoToastr("no district found");
        }
      },
      (error) => {
        this.toastr.warningToastr(error);
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  public submitForm() {
    this.myform.controls['contactNo'].enable();
    this.myform.controls['emailId'].enable();
    console.log('myform value', this.myform.value);
    this.spinner.show();
    this.uacService.createOrUpdateUser(this.myform.value).subscribe({
      next: (res: any) => {
        if (res) {
          if (res.status == 1) {
            this.toastr.successToastr(res.statusDesc);
            this.createFormInstance();
            this.dataForEdit = null;
            this.router.navigateByUrl('pages/uac/user/view');
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

  public resetForm() {
    this.createFormInstance();
  }

  public goToView() {
    history.back();
  }

  //convert image to byte array
  public onFileChange($event: Event) {
    const inputElement = $event.target as HTMLInputElement;

    if (inputElement && inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      console.log("file", file);
      this.convertImageToBase64(file);
    } else {
      console.log("No file selected");
    }
  }

  public convertImageToBase64(file: File) {
    const observable = new Observable((subscriber: Subscriber<any>) => {
      this.readFile(file, subscriber);
    });
    observable.subscribe((d) => {
      const profilePicControl = this.myform.get("profilePic");
      if (profilePicControl) {
        profilePicControl.patchValue(d);
        console.log("byte array", d);
      } else {
        console.error("Form control 'profilePic' is not found.");
      }
      // this.myform.get("profilePic").patchValue(d);
      // console.log("byte array", d);
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

  public ngOnDestroy() {
    this.service.storeDetails(null);
  }

}
