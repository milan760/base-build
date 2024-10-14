import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonService } from '../../../../../services/common/common.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { UacService } from '../../../service/uac.service';
import { ToastrClientService } from '../../../../../services/toastr/toastr-client.service';

@Component({
  selector: 'app-create-role',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-role.component.html',
  styleUrl: './create-role.component.scss'
})
export class CreateRoleComponent {

  public myform!: FormGroup;
  public dataForEdit: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: CommonService,
    private spinner: NgxSpinnerService,
    private uacService: UacService,
    private toastr: ToastrClientService
  ) {
    this.createFormInstance();
  }

  public createFormInstance() {
    this.myform = this.fb.group({
      roleId: [],
      roleName: [''],
      roleCode: [''],
      status: this.fb.group({
        statusId: [],
        statusCode: ['']
      })
    });
  }

  ngOnInit(): void {
    this.getDataForEdit();
  }

  public getDataForEdit() {
    this.dataForEdit = this.service.getStoredDetails();
    if (this.dataForEdit) {
      this.myform.patchValue(this.dataForEdit);
    }
  }

  public submitForm(data: any) {
    // this.toastr.successToastr('Success');
    this.spinner.show();
    this.uacService.createOrUpdateRole(data).subscribe({
      next: (res: any) => {
        if (res) {
          if (res.status == 1) {
            this.toastr.successToastr(res.statusDesc);
            this.createFormInstance();
            this.dataForEdit = null;
            this.router.navigateByUrl('pages/uac/role/view');
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
    })
  }

  public resetForm() {
    this.createFormInstance();
  }

  public goToView() {
    console.log('----------')
    this.router.navigateByUrl('pages/uac/role/view');
  }

  ngOnDestroy() {
    console.log("inside ngOnDestroy")
    this.service.storeDetails(null);
    console.log(this.service.getStoredDetails());
  }

}
