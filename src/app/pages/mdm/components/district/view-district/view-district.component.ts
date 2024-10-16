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
  selector: 'app-view-district',
  standalone: true,
  imports: [ModalModule, CommonModule, CustomTableComponent, ViewModalComponent],
  templateUrl: './view-district.component.html',
  styleUrl: './view-district.component.scss'
})
export class ViewDistrictComponent {

  public sendDataToFieldsetLegendKeyValue: any;

  public DistrictComponentObject: DynamicTable = {
    cardTitle: 'District List',
    pgSizeOptions: [10, 25, 50],
    selectedPageSize: 10,
    pageNumber: 1,
    totalRecords: 0,
    totalPages: 0,
    headerAndBodyLoopers: [
      { thRowspan: 2, thColspan: 1, tdRowspan: 1, tdColspan: 1, isTHactive: 1, isTDactive: 1, THclass: 'text-center text-nowrap', TDclass: 'text-center text-nowrap', spanClass: "", isSortNeeded: 0, defaultIcon: 'fa fa-sort', descIcon: 'fa fa-sort-desc', ascIcon: 'fa fa-sort-asc', THname: 'Sl no.', TDkey: 'slno', TDdataType: 'slno', },
      { thRowspan: 2, thColspan: 1, tdRowspan: 1, tdColspan: 1, isTHactive: 1, isTDactive: 1, THclass: 'text-center text-nowrap', TDclass: 'text-center text-nowrap', spanClass: "", isSortNeeded: 0, defaultIcon: 'fa fa-sort', descIcon: 'fa fa-sort-desc', ascIcon: 'fa fa-sort-asc', THname: 'District Name', TDkey: 'districtName', TDdataType: 'string', },
      { thRowspan: 2, thColspan: 1, tdRowspan: 1, tdColspan: 1, isTHactive: 1, isTDactive: 1, THclass: 'text-center text-nowrap', TDclass: 'text-center text-nowrap', spanClass: "", isSortNeeded: 0, defaultIcon: 'fa fa-sort', descIcon: 'fa fa-sort-desc', ascIcon: 'fa fa-sort-asc', THname: 'District Code', TDkey: 'districtCode', TDdataType: 'string', },
    ],
    secondHeaderRow: [],
    isActive: { searchDropdown: 0, searchfield: 0, showEntries: 0, upperButtons: 0, pagination: 0, totalRecords: 0, pageDescription: 0 },
    upperButtons: [
      { isActive: 1, class: 'btn btn-sm btn-custom-action', placement: 'top', title: 'Create', icon: 'fa fa-plus', btnName: 'Create' },
    ],
    ActionButtons: [],

    tBodyList: [],
    createNavigate: '',
    editNavigate: ''
  }

  constructor(
    private spinner: NgxSpinnerService,
    private mdmService: MdmService,
    private toastr: ToastrClientService
  ) { }

  ngOnInit(): void {
    this.getDistrctList();
  }

  receiveEmittedDataFromCommonTbl(eventObj: any) {

    switch (eventObj.clickedRemark) {
      case 'upperBtnClicked':
        break;
      case 'tdValueClicked':
        break;
      case 'tdActionBtnClicked':
        if (eventObj.reference === "View") { }
        break;
      case 'pagination':
        this.getDistrctList();
        break;
    }
  }

  getDistrctList() {
    this.spinner.show();
    this.mdmService.getAllDistrict().subscribe({
      next: (res: any) => {
        if (res) {
          this.DistrictComponentObject = { ... this.DistrictComponentObject };
          this.DistrictComponentObject.tBodyList = res;
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
