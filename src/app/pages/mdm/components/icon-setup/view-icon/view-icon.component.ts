import { Component } from '@angular/core';
import { DynamicTable } from '../../../../../model/dynamic-table.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { MdmService } from '../../../service/mdm.service';
import { ToastrClientService } from '../../../../../services/toastr/toastr-client.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { CustomTableComponent } from '../../../../../sharedComponents/components/custom-table/custom-table.component';
import { ViewModalComponent } from '../../../../../sharedComponents/components/view-modal/view-modal.component';

@Component({
  selector: 'app-view-icon',
  standalone: true,
  imports: [ModalModule, CommonModule, CustomTableComponent, ViewModalComponent],
  templateUrl: './view-icon.component.html',
  styleUrl: './view-icon.component.scss'
})
export class ViewIconComponent {

  public IconComponentObject: DynamicTable = {
    cardTitle: 'Icon List',
    pgSizeOptions: [10, 25, 50],
    selectedPageSize: 10,
    pageNumber: 1,
    totalRecords: 0,
    totalPages: 0,
    headerAndBodyLoopers: [
      { thRowspan: 2, thColspan: 1, tdRowspan: 1, tdColspan: 1, isTHactive: 1, isTDactive: 1, THclass: 'text-center text-nowrap', TDclass: 'text-center text-nowrap', spanClass: "", isSortNeeded: 1, defaultIcon: 'fa fa-sort', descIcon: 'fa fa-sort-desc', ascIcon: 'fa fa-sort-asc', THname: 'Sl no.', TDkey: 'slno', TDdataType: 'slno', },
      { thRowspan: 2, thColspan: 1, tdRowspan: 1, tdColspan: 1, isTHactive: 1, isTDactive: 1, THclass: 'text-center text-nowrap', TDclass: 'text-center text-nowrap', spanClass: "", isSortNeeded: 1, defaultIcon: 'fa fa-sort', descIcon: 'fa fa-sort-desc', ascIcon: 'fa fa-sort-asc', THname: 'Id', TDkey: 'id', TDdataType: 'number', },
      { thRowspan: 2, thColspan: 1, tdRowspan: 1, tdColspan: 1, isTHactive: 1, isTDactive: 1, THclass: 'text-center text-nowrap', TDclass: 'text-center text-nowrap', spanClass: "", isSortNeeded: 1, defaultIcon: 'fa fa-sort', descIcon: 'fa fa-sort-desc', ascIcon: 'fa fa-sort-asc', THname: 'Icon Type', TDkey: 'iconType', TDdataType: 'string', },
      { thRowspan: 2, thColspan: 1, tdRowspan: 1, tdColspan: 1, isTHactive: 1, isTDactive: 1, THclass: 'text-center text-nowrap', TDclass: 'text-center text-nowrap', spanClass: "", isSortNeeded: 1, defaultIcon: 'fa fa-sort', descIcon: 'fa fa-sort-desc', ascIcon: 'fa fa-sort-asc', THname: 'Icon Name', TDkey: 'faText', TDdataType: 'string', },
      { thRowspan: 2, thColspan: 1, tdRowspan: 1, tdColspan: 1, isTHactive: 1, isTDactive: 1, THclass: 'text-center text-nowrap', TDclass: 'text-center text-nowrap', spanClass: "", isSortNeeded: 1, defaultIcon: 'fa fa-sort', descIcon: 'fa fa-sort-desc', ascIcon: 'fa fa-sort-asc', THname: 'Image Name', TDkey: 'imageName', TDdataType: 'string', },
      { thRowspan: 2, thColspan: 1, tdRowspan: 1, tdColspan: 1, isTHactive: 1, isTDactive: 1, THclass: 'text-center text-nowrap', TDclass: 'text-center text-nowrap', spanClass: "", isSortNeeded: 1, defaultIcon: 'fa fa-sort', descIcon: 'fa fa-sort-desc', ascIcon: 'fa fa-sort-asc', THname: 'Status', TDkey: 'statusId', TDdataType: 'number', },
      { thRowspan: 1, thColspan: 1, tdRowspan: 1, tdColspan: 1, isTHactive: 1, isTDactive: 0, THclass: 'text-center text-nowrap', TDclass: 'text-center text-nowrap', spanClass: "", isSortNeeded: 1, defaultIcon: 'fa fa-sort', descIcon: 'fa fa-sort-desc', ascIcon: 'fa fa-sort-asc', THname: 'Action', TDkey: 'action', TDdataType: 'string', },
    ],
    secondHeaderRow: [],
    isActive: { searchDropdown: 0, searchfield: 0, showEntries: 1, upperButtons: 1, pagination: 1, totalRecords: 1, pageDescription: 0 },
    upperButtons: [
      { isActive: 1, class: 'btn btn-sm btn-custom-action', placement: 'top', title: 'Create', icon: 'fa fa-plus', btnName: 'Create' },
    ],
    ActionButtons: [
      { thRowspan: 2, thColspan: 1, tdRowspan: 1, tdColspan: 1, isTDactive: 1, class: 'edit-btn btn-custom-action', placement: 'top', title: 'Edit', icon: 'fa fa-pencil-square-o', btnName: '' },
    ],
    tBodyList: [],
    createNavigate: 'pages/mdm/icon-setup/create',
    editNavigate: 'pages/mdm/icon-setup/edit'
  }

  paginatioObj = {
    "isPaginationRequired": true,
    "isOrderRequired": true,
    "isAscending": false,
    "pageNumber": 1,
    "pageSize": 10,
    "orderField": "id",
    "isSearchRequired": false,
    "key": "",
    "value": ""
  }

  constructor(
    private spinner: NgxSpinnerService,
    private mdmService: MdmService,
    private toastr: ToastrClientService
  ) { }

  ngOnInit(): void {
    this.getIconList(this.paginatioObj);
  }

  receiveEmittedDataFromCommonTbl(eventObj: any) {

    switch (eventObj.clickedRemark) {
      case 'upperBtnClicked':
        break;
      case 'tdValueClicked':
        break;
      case 'tdActionBtnClicked':
        break;
      case 'pagination':
        eventObj.isOrderRequired = this.paginatioObj.isOrderRequired;
        eventObj.isAscending = this.paginatioObj.isAscending;
        eventObj.orderField = this.paginatioObj.orderField;
        this.getIconList(eventObj);
        break;
    }
  }

  getIconList(pagination: any) {
    this.spinner.show();
    this.mdmService.getAllIcons(pagination).subscribe({
      next: (res: any) => {
        if (res) {
          this.IconComponentObject = { ... this.IconComponentObject };
          this.IconComponentObject.tBodyList = res.iconDetailsDTOList;
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
