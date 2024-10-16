import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../../../../services/common/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrClientService } from '../../../../../services/toastr/toastr-client.service';
import { MdmService } from '../../../service/mdm.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-icon',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-icon.component.html',
  styleUrl: './create-icon.component.scss'
})
export class CreateIconComponent {

  myform!: FormGroup;
  dataForEdit: any;
  createOrEdit = "Create";

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: CommonService,
    private spinner: NgxSpinnerService,
    private mdmService: MdmService,
    private toastr: ToastrClientService
  ) {
    this.createFormInstance();
  }

  createFormInstance() {
    this.myform = this.fb.group({
      id: [],
      iconType: [""],
      faText: [""],
      image: [""],
      imageName: [""],
      statusId: [],
    });
  }

  ngOnInit(): void {
    this.getDataForEdit();
  }

  getDataForEdit() {
    this.dataForEdit = this.service.getStoredDetails();
    if (this.dataForEdit) {
      this.myform.patchValue(this.dataForEdit);
    }
  }

  submitForm(value: any) {
    if (value.iconType == "Image") {
      value.faText = "";
    }
    if (value.iconType == "FontAwesome") {
      value.image = "";
      value.imageName = "";
    }
    this.spinner.show();
    this.mdmService.createOrUpdateIcon(value).subscribe({
      next: (res: any) => {
        if (res.status == 0) {
          this.toastr.successToastr(res.statusDesc);
          this.router.navigateByUrl('pages/mdm/icon-setup/view');
        } else if (res.status == 409) {
          this.toastr.warningToastr(res.statusDesc);
        } else {
          this.toastr.infoToastr(res.statusDesc);
        }
      },
      error: (err) => {
        this.toastr.dangerToastr(err.statusDesc);
        this.spinner.hide();
      },
      complete: () => {
        this.spinner.hide();
      }
    })
  }

  onselectNewFile(event:any, controlName:any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      console.log(event.target.files[0].name);
      reader.onload = () => {
        const image = this.myform.get('image');
        if (image) {
          image.patchValue(reader.result)
        }
        // this.myform.get('image').patchValue( reader.result) ;
        console.log(reader.result)
      }
      reader.readAsDataURL(event.target.files[0]);

    }
  }

  resetForm() {
    this.createFormInstance();
  }

  goToView() {
    console.log('----------')
    this.router.navigateByUrl('pages/mdm/icon-setup/view');
  }

  ngOnDestroy() {
    console.log("inside ngOnDestroy")
    this.service.storeDetails(null);
    console.log(this.service.getStoredDetails());
  }
}
