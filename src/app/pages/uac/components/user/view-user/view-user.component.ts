import { Component, ViewChild } from '@angular/core';
import { DynamicTable } from '../../../../../model/dynamic-table.model';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { UacService } from '../../../service/uac.service';
import { ToastrClientService } from '../../../../../services/toastr/toastr-client.service';
import { CustomTableComponent } from '../../../../../sharedComponents/components/custom-table/custom-table.component';

@Component({
  selector: 'app-view-user',
  standalone: true,
  imports: [CustomTableComponent],
  templateUrl: './view-user.component.html',
  styleUrl: './view-user.component.scss'
})
export class ViewUserComponent {

  public sendDataToFieldsetLegendKeyValue: any;

  public UserComponentObject: DynamicTable = {
    cardTitle: 'User List',
    pgSizeOptions: [10, 25, 50],
    selectedPageSize: 10,
    pageNumber: 1,
    totalRecords: 0,
    totalPages: 0,
    headerAndBodyLoopers: [
      { thRowspan: 2, thColspan: 1, tdRowspan: 1, tdColspan: 1, isTHactive: 1, isTDactive: 1, THclass: 'text-center text-nowrap', TDclass: 'text-center text-nowrap', spanClass: "", isSortNeeded: 0, defaultIcon: 'fa fa-sort', descIcon: 'fa fa-sort-desc', ascIcon: 'fa fa-sort-asc', THname: 'Sl no.', TDkey: 'slno', TDdataType: 'slno', },
      { thRowspan: 2, thColspan: 1, tdRowspan: 2, tdColspan: 1, isTHactive: 1, isTDactive: 1, THclass: 'text-center text-nowrap', TDclass: 'text-center text-nowrap', spanClass: "", isSortNeeded: 0, defaultIcon: 'fa fa-sort', descIcon: 'fa fa-sort-desc', ascIcon: 'fa fa-sort-asc', THname: 'First Name', TDkey: 'firstName', TDdataType: 'string' },
      { thRowspan: 2, thColspan: 1, tdRowspan: 2, tdColspan: 1, isTHactive: 1, isTDactive: 1, THclass: 'text-center text-nowrap', TDclass: 'text-center text-nowrap', spanClass: "", isSortNeeded: 0, defaultIcon: 'fa fa-sort', descIcon: 'fa fa-sort-desc', ascIcon: 'fa fa-sort-asc', THname: 'Last Name', TDkey: 'lastName', TDdataType: 'string' },
      { thRowspan: 2, thColspan: 1, tdRowspan: 2, tdColspan: 1, isTHactive: 1, isTDactive: 1, THclass: 'text-center text-nowrap', TDclass: 'text-center text-nowrap', spanClass: "", isSortNeeded: 0, defaultIcon: 'fa fa-sort', descIcon: 'fa fa-sort-desc', ascIcon: 'fa fa-sort-asc', THname: 'Mobile No.', TDkey: 'contactNo', TDdataType: 'string' },
      { thRowspan: 2, thColspan: 1, tdRowspan: 2, tdColspan: 1, isTHactive: 1, isTDactive: 1, THclass: 'text-center text-nowrap', TDclass: 'text-center text-nowrap', spanClass: "", isSortNeeded: 0, defaultIcon: 'fa fa-sort', descIcon: 'fa fa-sort-desc', ascIcon: 'fa fa-sort-asc', THname: 'Email ID', TDkey: 'emailId', TDdataType: 'string' },
      { thRowspan: 2, thColspan: 1, tdRowspan: 2, tdColspan: 1, isTHactive: 1, isTDactive: 1, THclass: 'text-center text-nowrap', TDclass: 'text-center text-nowrap', spanClass: "", isSortNeeded: 0, defaultIcon: 'fa fa-sort', descIcon: 'fa fa-sort-desc', ascIcon: 'fa fa-sort-asc', THname: 'Role', TDkey: 'role.roleName', TDdataType: 'String' },
      { thRowspan: 2, thColspan: 1, tdRowspan: 2, tdColspan: 1, isTHactive: 1, isTDactive: 1, THclass: 'text-center text-nowrap', TDclass: 'text-center text-nowrap', spanClass: "", isSortNeeded: 0, defaultIcon: 'fa fa-sort', descIcon: 'fa fa-sort-desc', ascIcon: 'fa fa-sort-asc', THname: 'Status', TDkey: 'status.statusCode', TDdataType: 'String' },
      { thRowspan: 2, thColspan: 1, tdRowspan: 2, tdColspan: 1, isTHactive: 1, isTDactive: 1, THclass: 'text-center text-nowrap', TDclass: 'text-center text-nowrap', spanClass: "", isSortNeeded: 0, defaultIcon: 'fa fa-sort', descIcon: 'fa fa-sort-desc', ascIcon: 'fa fa-sort-asc', THname: 'Profile Pic', TDkey: 'profilePic', TDdataType: 'image' },
      { thRowspan: 1, thColspan: 2, tdRowspan: 1, tdColspan: 1, isTHactive: 1, isTDactive: 0, THclass: 'text-center text-nowrap', TDclass: 'text-center text-nowrap', spanClass: "", isSortNeeded: 0, defaultIcon: 'fa fa-sort', descIcon: 'fa fa-sort-desc', ascIcon: 'fa fa-sort-asc', THname: 'Action', TDkey: 'action', TDdataType: 'string', },
    ],
    secondHeaderRow: [],
    isActive: { searchDropdown: 0, searchfield: 0, showEntries: 1, upperButtons: 1, pagination: 1, totalRecords: 1, pageDescription: 1 },
    upperButtons: [
      { isActive: 1, class: 'btn btn-sm btn-custom-action', placement: 'top', title: 'Create', icon: 'fa fa-plus', btnName: 'Create' },
    ],
    ActionButtons: [
      // { thRowspan: 2, thColspan: 1, tdRowspan: 1, tdColspan: 1, isTDactive: 1, class: 'view-btn btn-custom-action', placement: 'top', title: 'View', icon: 'fa fa-eye', btnName: '' },
      { thRowspan: 2, thColspan: 1, tdRowspan: 1, tdColspan: 1, isTDactive: 1, class: 'edit-btn btn-custom-action', placement: 'top', title: 'Edit', icon: 'fa fa-pencil-square-o', btnName: '' },
    ],
    tBodyList: [],
    createNavigate: 'pages/uac/user/create',
    editNavigate: 'pages/uac/user/edit'
  }

  @ViewChild('userViewModal', { static: false }) userViewModal!: ModalDirective;

  public paginatioObj = {
    "isPaginationRequired": true,
    "isOrderRequired": true,
    "isAscending": true,
    // "pageNumber": this.pageNumber,
    // "pageSize": this.selectedPageSize,
    "pageNumber": 1,
    "pageSize": 10,
    "orderField": "firstName",
    "isSearchRequired": false,
    "key": "",
    "value": ""
  }

  constructor(
    public spinner: NgxSpinnerService,
    public uacService: UacService,
    private toastr: ToastrClientService
  ) { }

  ngOnInit(): void {
    this.getUserList(this.paginatioObj);
  }

  public ViewUserModal(item?: any) {
    if (item) {
      this.sendDataToFieldsetLegendKeyValue = {
        whichArrayToLoop: 'User',
        dataRowObj: item
      };
    }
    this.userViewModal.show();
  }

  public hideTrackingModal(): void {
    this.userViewModal.hide();
  }

  public receiveEmittedDataFromCommonTbl(eventObj: any) {
    console.log(eventObj);

    switch (eventObj.clickedRemark) {
      case 'upperBtnClicked':
        break;
      case 'tdValueClicked':
        break;
      case 'tdActionBtnClicked':
        if (eventObj.reference === "View") {
          this.ViewUserModal(eventObj.dataValueObject);
        }
        break;
      case 'pagination':
        console.log('pagination', eventObj.dataValueObject);
        this.UserComponentObject.pageNumber = eventObj.dataValueObject.pageNumber;
        eventObj.dataValueObject.isOrderRequired = this.paginatioObj.isOrderRequired;
        eventObj.dataValueObject.isAscending = this.paginatioObj.isAscending;
        eventObj.dataValueObject.orderField = this.paginatioObj.orderField;
        this.getUserList(eventObj.dataValueObject);
        break;
    }
  }

  public getUserList(pagination: any) {
    this.spinner.show();
    this.uacService.getUsersList(pagination).subscribe({
      next: (res: any) => {
        if (res.userListResponse.length) {
          this.UserComponentObject = { ... this.UserComponentObject };
          this.UserComponentObject.tBodyList = res.userListResponse;
          this.UserComponentObject.totalRecords = res.totalElement;
          this.UserComponentObject.totalPages = res.totalPages;
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
