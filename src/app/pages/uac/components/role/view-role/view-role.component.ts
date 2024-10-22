import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../../../../../services/common/common.service';
import { UacService } from '../../../service/uac.service';
import { ToastrClientService } from '../../../../../services/toastr/toastr-client.service';
import { DynamicTable } from '../../../../../model/dynamic-table.model';
import { CustomTableComponent } from '../../../../../sharedComponents/components/custom-table/custom-table.component';

@Component({
  selector: 'app-view-role',
  standalone: true,
  imports: [CustomTableComponent],
  templateUrl: './view-role.component.html',
  styleUrl: './view-role.component.scss'
})
export class ViewRoleComponent {

  public UserByRoleId: any;
  public sendDataToFieldsetLegendKeyValue: any;

  public RoleComponentObject: DynamicTable = {
    cardTitle: 'Role List',
    pgSizeOptions: [10, 25, 50],
    selectedPageSize: 10,
    pageNumber: 1,
    totalRecords: 0,
    totalPages: 0,
    headerAndBodyLoopers: [
      { thRowspan: 2, thColspan: 1, tdRowspan: 1, tdColspan: 1, isTHactive: 1, isTDactive: 1, THclass: 'text-center text-nowrap', TDclass: 'text-center text-nowrap', spanClass: "", isSortNeeded: 0, defaultIcon: 'fa fa-sort', descIcon: 'fa fa-sort-desc', ascIcon: 'fa fa-sort-asc', THname: 'Sl no.', TDkey: 'slno', TDdataType: 'slno', },
      { thRowspan: 2, thColspan: 1, tdRowspan: 2, tdColspan: 1, isTHactive: 1, isTDactive: 1, THclass: 'text-center text-nowrap', TDclass: 'text-center text-nowrap', spanClass: "", isSortNeeded: 0, defaultIcon: 'fa fa-sort', descIcon: 'fa fa-sort-desc', ascIcon: 'fa fa-sort-asc', THname: 'Role Id', TDkey: 'roleId', TDdataType: 'number' },
      { thRowspan: 2, thColspan: 1, tdRowspan: 2, tdColspan: 1, isTHactive: 1, isTDactive: 1, THclass: 'text-center text-nowrap', TDclass: 'text-center text-nowrap', spanClass: "", isSortNeeded: 0, defaultIcon: 'fa fa-sort', descIcon: 'fa fa-sort-desc', ascIcon: 'fa fa-sort-asc', THname: 'Role Name', TDkey: 'roleName', TDdataType: 'string' },
      { thRowspan: 2, thColspan: 1, tdRowspan: 2, tdColspan: 1, isTHactive: 1, isTDactive: 1, THclass: 'text-center text-nowrap', TDclass: 'text-center text-nowrap', spanClass: "", isSortNeeded: 0, defaultIcon: 'fa fa-sort', descIcon: 'fa fa-sort-desc', ascIcon: 'fa fa-sort-asc', THname: 'Role Code', TDkey: 'roleCode', TDdataType: 'string' },
      { thRowspan: 2, thColspan: 1, tdRowspan: 2, tdColspan: 1, isTHactive: 1, isTDactive: 1, THclass: 'text-center text-nowrap', TDclass: 'text-center text-nowrap', spanClass: "", isSortNeeded: 0, defaultIcon: 'fa fa-sort', descIcon: 'fa fa-sort-desc', ascIcon: 'fa fa-sort-asc', THname: 'Status', TDkey: 'status.statusCode', TDdataType: 'object' },
      { thRowspan: 1, thColspan: 1, tdRowspan: 1, tdColspan: 1, isTHactive: 1, isTDactive: 0, THclass: 'text-center text-nowrap', TDclass: 'text-center text-nowrap', spanClass: "", isSortNeeded: 0, defaultIcon: 'fa fa-sort', descIcon: 'fa fa-sort-desc', ascIcon: 'fa fa-sort-asc', THname: 'Action', TDkey: 'action', TDdataType: 'string', },
    ],
    secondHeaderRow: [],
    isActive: { searchDropdown: 0, searchfield: 0, showEntries: 1, upperButtons: 1, pagination: 1, totalRecords: 1, pageDescription: 1 },
    upperButtons: [
      { isActive: 1, class: 'btn btn-sm btn-custom-action', placement: 'top', title: 'Create', icon: 'fa fa-plus', btnName: 'Create' },
    ],
    ActionButtons: [
      { thRowspan: 1, thColspan: 1, tdRowspan: 1, tdColspan: 1, isTDactive: 1, class: 'edit-btn', placement: 'top', title: 'Edit', icon: 'fa fa-pencil-square-o', btnName: '' },
    ],
    tBodyList: [],
    createNavigate: 'pages/uac/role/create',
    editNavigate: 'pages/uac/role/edit'
  }

  constructor(
    public spinner: NgxSpinnerService,
    public service: CommonService,
    public uacService: UacService,
    private toastr: ToastrClientService,
  ) { }

  public paginatioObj = {
    "isPaginationRequired": true,
    "isOrderRequired": true,
    "isAscending": true,
    "pageNumber": 1,
    "pageSize": 10,
    "orderField": "roleId",
    "isSearchRequired": false,
    "key": "",
    "value": ""
  }

  ngOnInit(): void {
    this.getRoleList(this.paginatioObj);
  }

  public receiveEmittedDataFromCommonTbl(eventObj: any) {
    console.log(eventObj);

    switch (eventObj.clickedRemark) {
      case 'upperBtnClicked':
        break;
      case 'tdValueClicked':
        break;
      case 'tdActionBtnClicked':
        break;
      case 'pagination':
        console.log('pagination', eventObj.dataValueObject);
        this.RoleComponentObject.pageNumber = eventObj.dataValueObject.pageNumber;
        eventObj.dataValueObject.isOrderRequired = this.paginatioObj.isOrderRequired;
        eventObj.dataValueObject.isAscending = this.paginatioObj.isAscending;
        eventObj.dataValueObject.orderField = this.paginatioObj.orderField;
        this.getRoleList(eventObj.dataValueObject);
        break;
    }
  }

  public getRoleList(pagination: any) {
    this.spinner.show();
    this.uacService.getRoleList(pagination).subscribe({
      next: (res: any) => {
        if (res.roleResponse) {
          console.log(res.roleResponse);
          this.RoleComponentObject = { ...this.RoleComponentObject };
          this.RoleComponentObject.tBodyList = res.roleResponse;
          this.RoleComponentObject.totalRecords = res.totalElement;
          this.RoleComponentObject.totalPages = res.totalPages;
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
