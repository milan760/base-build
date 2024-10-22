import { Component, ViewChild } from '@angular/core';
import { DynamicTable } from '../../../../../model/dynamic-table.model';
import { ModalDirective, ModalModule } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { UacService } from '../../../service/uac.service';
import { ToastrClientService } from '../../../../../services/toastr/toastr-client.service';
import { CommonService } from '../../../../../services/common/common.service';
import { CustomTableComponent } from '../../../../../sharedComponents/components/custom-table/custom-table.component';
import { ViewModalComponent } from '../../../../../sharedComponents/components/view-modal/view-modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-resource',
  standalone: true,
  imports: [ModalModule, CommonModule, CustomTableComponent, ViewModalComponent],
  templateUrl: './view-resource.component.html',
  styleUrl: './view-resource.component.scss'
})
export class ViewResourceComponent {

  public sendDataToFieldsetLegendKeyValue: any;

  public ResourceComponentObject: DynamicTable = {
    cardTitle: 'Resource List',
    pgSizeOptions: [10, 25, 50],
    selectedPageSize: 10,
    pageNumber: 1,
    totalRecords: 0,
    totalPages: 0,
    headerAndBodyLoopers: [
      { thRowspan: 2, thColspan: 1, tdRowspan: 1, tdColspan: 1, isTHactive: 1, isTDactive: 1, THclass: 'text-center text-nowrap', TDclass: 'text-center text-nowrap', spanClass: "", isSortNeeded: 0, defaultIcon: 'fa fa-sort', descIcon: 'fa fa-sort-desc', ascIcon: 'fa fa-sort-asc', THname: 'Sl no.', TDkey: 'slno', TDdataType: 'slno', },
      { thRowspan: 2, thColspan: 1, tdRowspan: 1, tdColspan: 1, isTHactive: 1, isTDactive: 1, THclass: 'text-center text-nowrap', TDclass: 'text-center text-nowrap', spanClass: "", isSortNeeded: 0, defaultIcon: 'fa fa-sort', descIcon: 'fa fa-sort-desc', ascIcon: 'fa fa-sort-asc', THname: 'Resource Name', TDkey: 'name', TDdataType: 'string', },
      { thRowspan: 2, thColspan: 1, tdRowspan: 1, tdColspan: 1, isTHactive: 1, isTDactive: 1, THclass: 'text-center text-nowrap', TDclass: 'text-center text-nowrap', spanClass: "", isSortNeeded: 0, defaultIcon: 'fa fa-sort', descIcon: 'fa fa-sort-desc', ascIcon: 'fa fa-sort-asc', THname: 'Resource Description', TDkey: 'description', TDdataType: 'string', },
      { thRowspan: 2, thColspan: 1, tdRowspan: 1, tdColspan: 1, isTHactive: 1, isTDactive: 1, THclass: 'text-center text-nowrap', TDclass: 'text-center text-nowrap', spanClass: "", isSortNeeded: 0, defaultIcon: 'fa fa-sort', descIcon: 'fa fa-sort-desc', ascIcon: 'fa fa-sort-asc', THname: 'Status', TDkey: 'status.statusId', TDdataType: 'object', },
      { thRowspan: 1, thColspan: 2, tdRowspan: 1, tdColspan: 1, isTHactive: 1, isTDactive: 0, THclass: 'text-center text-nowrap', TDclass: 'text-center text-nowrap', spanClass: "", isSortNeeded: 0, defaultIcon: 'fa fa-sort', descIcon: 'fa fa-sort-desc', ascIcon: 'fa fa-sort-asc', THname: 'Action', TDkey: 'action', TDdataType: 'string', }
    ],
    secondHeaderRow: [],
    isActive: { searchDropdown: 0, searchfield: 0, showEntries: 1, upperButtons: 1, pagination: 1, totalRecords: 1, pageDescription: 0 },
    upperButtons: [
      { isActive: 1, class: 'btn btn-sm btn-custom-action', placement: 'top', title: 'Create', icon: 'fa fa-plus', btnName: 'Create' },
    ],
    ActionButtons: [
      { thRowspan: 2, thColspan: 1, tdRowspan: 1, tdColspan: 1, isTDactive: 1, class: 'view-btn btn-custom-action', placement: 'top', title: 'View', icon: 'fa fa-eye', btnName: '' },
      { thRowspan: 2, thColspan: 1, tdRowspan: 1, tdColspan: 1, isTDactive: 1, class: 'edit-btn btn-custom-action', placement: 'top', title: 'Edit', icon: 'fa fa-pencil-square-o', btnName: '' },
    ],

    tBodyList: [],
    createNavigate: 'pages/uac/resource/create',
    editNavigate: 'pages/uac/resource/edit'
  }

  @ViewChild('resourceModal', { static: false }) resourceModal!: ModalDirective;

  constructor(
    public spinner: NgxSpinnerService,
    public service: CommonService,
    public uacService: UacService,
    private toastr: ToastrClientService
  ) { }

  ngOnInit(): void {
    this.getResourceList();
  }

  public receiveEmittedDataFromCommonTbl(eventObj: any) {

    switch (eventObj.clickedRemark) {
      case 'upperBtnClicked':
        break;
      case 'tdValueClicked':
        break;
      case 'tdActionBtnClicked':
        if (eventObj.reference === "View") {
          this.ViewResourceModal(eventObj.dataValueObject);
        }
        break;
      case 'pagination':
        this.getResourceList();
        break;
    }
  }

  public ViewResourceModal(item?: any) {
    if (item) {
      this.sendDataToFieldsetLegendKeyValue = {
        whichArrayToLoop: 'Resource',
        dataRowObj: item
      };
    }
    this.resourceModal.show();
  }

  public hideTrackingModal(): void {
    this.resourceModal.hide();
  }

  public getResourceList() {
    this.spinner.show();
    this.uacService.getAllResource({ "flatOrNested": "flat", "roleId": 0, "mappedAndAll": true }).subscribe({
      next: (res: any) => {
        if (res) {
          this.ResourceComponentObject = { ... this.ResourceComponentObject };
          this.ResourceComponentObject.tBodyList = res;
        } else {
          this.toastr.infoToastr("no data found");
        }
      },
      error: (err) => {
        this.spinner.hide();
        this.toastr.dangerToastr('Something went wrong');
      },
      complete: () => {
        this.spinner.hide();
      }
    })
  }
}

