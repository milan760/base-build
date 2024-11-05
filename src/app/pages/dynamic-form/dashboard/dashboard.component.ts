import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PreviewComponent } from '../preview/preview.component';
import { slideInOutAnimation } from '../../../services/animation/slide-in-out.animation';
import { MdmService } from '../../../services/mdm/mdm.service';
import { CommonService } from '../../../services/common/common.service';
import { ToastrClientService } from '../../../services/toastr/toastr-client.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PreviewComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  animations: [slideInOutAnimation]
})
export class DashboardComponent {

  // formStructureSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  public getAllFormData = []
  public myform!: FormGroup;
  public paginationObj = {
    "isPaginationRequired": true,
    "isOrderRequired": false,
    "isAscending": true,
    "pageNumber": 1,
    "pageSize": 10,
    "orderField": "",
    "isSearchRequired": false,
    "key": "",
    "value": "",
    "filter": {}
  }

  constructor(
    private mdmService: MdmService,
    private router: Router,
    private commonService: CommonService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private toaster: ToastrClientService,
    // private location: Location
  ) {
    this.createFormInstance()
  }

  private createFormInstance() {
    this.myform = this.fb.group({
      searchKey: ['']
    })
  }

  ngOnInit(): void {
    this.getAllDynamicFormDetails(this.paginationObj);
  }

  getAllDynamicFormDetails(pagObj: any) {
    this.mdmService.getAllDynamicFormDetails(pagObj).subscribe({
      next: (res: any) => {
        if (res) {
          this.getAllFormData = res.formListResponse;
        }
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => { }
    })
  }

  submit(data: any) {
    this.paginationObj.isSearchRequired = true;
    this.paginationObj.key = 'formName';
    this.paginationObj.value = data.searchKey;
    console.log(this.paginationObj)
    this.getAllDynamicFormDetails(this.paginationObj);
  }

  public navigateTo(path: any) {
    this.router.navigateByUrl(path)
  }

  public navigateToFullPreview(data: any) {
    this.commonService.storeDetails(data);
    this.router.navigateByUrl('/pages/dynamic-form/full-screen-view');
  }

  public editForm(data: any) {
    this.router.navigate(['/pages/dynamic-form/create-form'], { queryParams: { id: data.id } })
  }

  public deleteForm(data: any) {
    this.spinner.show();
    this.mdmService.deleteFormById(data).subscribe({
      next: (res: any) => {
        if (res.status == 1) {
          console.log(res)
          this.spinner.hide()
          this.toaster.successToastr("Record Deleted Successfully.")
          this.reset();
          this.getAllDynamicFormDetails(this.paginationObj)
        }
      },
      error: (err) => {
        console.log(err)
      },
      complete: () => { }
    })
  }

  public reset() {
    this.paginationObj = {
      "isPaginationRequired": true,
      "isOrderRequired": false,
      "isAscending": true,
      "pageNumber": 1,
      "pageSize": 10,
      "orderField": "",
      "isSearchRequired": false,
      "key": "",
      "value": "",
      "filter": {}
    }
  }
}
