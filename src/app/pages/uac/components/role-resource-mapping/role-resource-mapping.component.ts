import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrClientService } from '../../../../services/toastr/toastr-client.service';
import { CommonService } from '../../../../services/common/common.service';
import { UacService } from '../../service/uac.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-role-resource-mapping',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './role-resource-mapping.component.html',
  styleUrl: './role-resource-mapping.component.scss'
})
export class RoleResourceMappingComponent {

  public myform!: FormGroup;
  public roleList: any;
  public resourceList: any;
  public paginatioObj = {
    "isPaginationRequired": false,
    "isOrderRequired": true,
    "isAscending": true,
    "pageNumber": 1,
    "pageSize": 10,
    "orderField": "roleCode",
    "isSearchRequired": false,
    "key": "",
    "value": ""
  }

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrClientService,
    public commonService: CommonService,
    private uacService: UacService
  ) {
    this.createFormInstance();
  }

  public createFormInstance() {
    this.myform = this.fb.group({
      role_id: [""],
      resource_info: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.getRoleList(this.paginatioObj);
  }

  public getRoleList(pagination: any) {
    this.spinner.show();
    this.uacService.getRoleList(pagination).subscribe({
      next: (res: any) => {
        if (res.roleResponse) {
          this.roleList = res.roleResponse;
        } else {
          this.toastr.infoToastr("no data found");
        }
      },
      error: (err) => {
        console.log(err);
        this.spinner.hide();
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }

  public getAllResourceWithMappedResourceByRoleId() {
    this.spinner.show();
    const roleId = this.myform.get('role_id');
    this.uacService.getAllResource({ "flatOrNested": "string", "roleId": roleId ? roleId.value : '', "mappedAndAll": true }).subscribe({
      next: (res: any) => {
        if (res) {
          this.resourceList = res;
          console.log("all res", this.resourceList);
          this.clearFromArray(this.myform.get('resource_info') as FormArray);
        } else {
          this.toastr.infoToastr("no data found");
        }
      },
      error: (err) => {
        this.spinner.hide();
        console.log('Error', err);
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }

  public recursionMap(resourceList: any) {
    const formArray: FormArray = this.myform.get('resource_info') as FormArray;
    resourceList.forEach((rObj: any) => {
      if (rObj.mapped) {
        formArray.push(new FormControl({ resource_id: rObj.resourceId }));
      }
      if (rObj.responseDTOs && rObj.responseDTOs.length) {
        this.recursionMap(rObj.responseDTOs);
      }
    });
  }

  public checkChilds(isChecked: any, childResources: any) {
    if (isChecked) {
      childResources.forEach((childR: any) => {
        childR.mapped = true;
        if (childR.responseDTOs && childR.responseDTOs.length) {
          this.checkChilds(isChecked, childR.responseDTOs);
        }
      });
    }
    if (!isChecked) {
      childResources.forEach((childR: any) => {
        childR.mapped = false;
        if (childR.responseDTOs && childR.responseDTOs.length) {
          this.checkChilds(isChecked, childR.responseDTOs);
        }
      });
    }
  }

  public checkUncheckChildResource(event: any, resourceId: any) {
    const isChecked = event?.target.checked;
    this.resourceList.forEach((rObj: any) => {
      if (rObj.resourceId === resourceId) {
        if (isChecked) {
          rObj.mapped = true;
          if (rObj.responseDTOs && rObj.responseDTOs.length) {
            this.checkChilds(isChecked, rObj.responseDTOs);
          }
        } else if (!isChecked) {
          rObj.mapped = false;
          if (rObj.responseDTOs && rObj.responseDTOs.length) {
            this.checkChilds(isChecked, rObj.responseDTOs);
          }
        }
      }
      if (rObj.responseDTOs && rObj.responseDTOs.length) {
        this.recursionMap(rObj.responseDTOs);
      }
    });
  }

  // isChecked: any;
  // public checkUncheckChildResource(event: any, resourceId: any) {

  //   const isChecked = event.target.checked;
  //   console.log("check",isChecked);
  //   console.log("id",resourceId);

  //   this.resourceList.forEach((rObj: any) => {
  //     if (rObj.resourceId === resourceId) {
  //       if (isChecked) {
  //         rObj.mapped = true;
  //         if (rObj.responseDTOs && rObj.responseDTOs.length) {
  //           this.checkChilds(isChecked, rObj.responseDTOs);
  //         }
  //       } else if (isChecked ==false) {
  //         rObj.mapped = false;
  //         if (rObj.responseDTOs && rObj.responseDTOs.length) {
  //           this.checkChilds(isChecked, rObj.responseDTOs);
  //         }
  //       }
  //     }
  //     if (rObj.responseDTOs && rObj.responseDTOs.length) {
  //       this.recursionMap(rObj.responseDTOs);
  //     }
  //   });
  //   // console.log('event', typeof (event));
  //   // if (typeof (event) === 'object') {
  //   //   this.isChecked = event?.target.checked;
  //   // } else {
  //   //   this.isChecked = event;
  //   // }

  //   // this.resourceList.forEach((rObj: any) => {
  //   //   console.log('rObj', rObj);
  //   //   if (rObj.resourceId === resourceId) {
  //   //     console.log('rObj', rObj);
  //   //     if (rObj.mapped) {
  //   //       rObj.mapped = false;
  //   //     } else {
  //   //       rObj.mapped = true;
  //   //     }
  //   //     if (rObj.responseDTOs && rObj.responseDTOs.length) {
  //   //       this.checkChilds(this.isChecked, rObj.responseDTOs);
  //   //     }
  //   //   } else if (rObj.responseDTOs && rObj.responseDTOs.length) {
  //   //     console.log('inside else block');
  //   //     this.checkUncheckChildResource(this.isChecked, this.resourceList.responseDTOs);
  //   //   }

  //   //   if (rObj.responseDTOs && rObj.responseDTOs.length) {
  //   //     this.recursionMap(rObj.responseDTOs);
  //   //   }
  //   // });
  // }

  public submitForm() {
    this.clearFromArray(this.myform.get('resource_info') as FormArray);
    this.recursionMap(this.resourceList);
    this.spinner.show();
    this.uacService.addRoleResource(this.myform.value).subscribe({
      next: (res: any) => {
        if (res) {
          this.toastr.successToastr(res.statusDesc);
          this.commonService.changeResourceList(true);
          // window.location.reload();
        } else {
          this.toastr.infoToastr(res.statusDesc);
        }
      },
      error: (err) => {
        console.log(err);
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

  public clearFromArray(formArray: FormArray) {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }
}
