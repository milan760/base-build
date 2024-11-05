import { Component } from '@angular/core';
import { CommonService } from '../../../services/common/common.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-full-screen-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './full-screen-view.component.html',
  styleUrl: './full-screen-view.component.scss'
})
export class FullScreenViewComponent {

  public dataToCreateForm: any;
  public formName: any;
  public controls = []
  constructor(
    private commonService: CommonService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.dataToCreateForm = this.commonService.getStoredDetails();
    console.log("Received Data:: ", this.dataToCreateForm)
    this.formName = this.dataToCreateForm.formName;
    this.controls = this.dataToCreateForm.controls;
  }

  public closePreview() {
    this.router.navigateByUrl('/pages/dynamic-form/dashboard');
  }
}
