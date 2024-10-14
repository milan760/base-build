import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrClientService } from '../../../../../services/toastr/toastr-client.service';
import { CommonService } from '../../../../../services/common/common.service';
import { UacService } from '../../../service/uac.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-resource',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-resource.component.html',
  styleUrl: './create-resource.component.scss'
})
export class CreateResourceComponent {

  public myform!: FormGroup;
  public dataForEdit: any;
  public ResourceList: any;
  public iconList: any;

  public paginatioObj = {
    isPaginationRequired: false,
    isOrderRequired: false,
    isAscending: false,
    // "pageNumber": this.pageNumber,
    // "pageSize": this.selectedPageSize,
    pageNumber: 1,
    pageSize: 10,
    orderField: "",
    isSearchRequired: false,
    key: "",
    value: null,
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrClientService,
    public service: CommonService,
    public uacService: UacService
  ) {
    this.createFormInstance();
  }

  public createFormInstance() {
    this.myform = this.fb.group({
      resourceId: [],
      name: [''],
      description: [''],
      path: [''],
      parentResourceId: [],
      level: [0],
      icon: [],
      status: this.fb.group({
        statusId: [],
        statusCode: ['']
      }),
      hasSubMenu: [],
      // createdDt: [""],
      // createdBy: [""],
      // updatedDt: [""],
      // updatedBy: [""],
      // responseDTOs: [""],
      // mapped: [],
      orderIn: []
    });
  }

  ngOnInit(): void {
    this.getAllIcon(this.paginatioObj);
    this.getDataForEdit();
    this.getAllResource();
  }

  public getDataForEdit() {
    this.dataForEdit = this.service.getStoredDetails();
    if (this.dataForEdit) {
      this.myform.patchValue(this.dataForEdit);
    }
  }

  public submitForm(data: any) {
    console.log(data);
    // return
    this.spinner.show();
    this.uacService.createOrUpdateResource(data).subscribe({
      next: (res: any) => {
        if (res) {
          this.toastr.successToastr(res.statusDesc);
          this.createFormInstance();
          this.dataForEdit = null;
          this.router.navigateByUrl('pages/uac/resource/view');
        } else {
          this.toastr.infoToastr(res.statusDesc);
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
    this.myform.reset();
  }

  public goToView() {
    this.router.navigateByUrl("pages/uac/resource/view");
  }

  ngOnDestroy() {
    console.log("inside ngOnDestroy");
    this.service.storeDetails(null);
  }

  public getAllResource() {
    this.spinner.show();
    this.uacService.getAllResource({ "flatOrNested": "flat", "roleId": 0, "mappedAndAll": true }).subscribe({
      next: (res: any) => {
        if (res) {
          this.ResourceList = res;
        } else {
          this.toastr.infoToastr("no data found");
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
      // (res) => {
      //   if (res) {
      //     this.ResourceList = res;
      //   } else {
      //     this.toastr.infoToastr("no data found");
      //   }
      // },
      // (error) => {
      //   this.toastr.warningToastr(error);
      // },
      // () => {
      //   this.spinner.hide();
      // }
    );
  }

  public getAllIcon(paginatioObj: any) {
    this.spinner.show();
    this.uacService.getAllIcons(paginatioObj).subscribe({
      next: (res: any) => {
        if (res) {
          if (res.iconDetailsDTOList) {
            this.iconList = res.iconDetailsDTOList;
          } else {
            this.toastr.infoToastr("no data found");
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

}
