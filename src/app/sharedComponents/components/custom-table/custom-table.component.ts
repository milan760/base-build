import { Component, EventEmitter, Input, KeyValueDiffers, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { DynamicTable } from '../../../model/dynamic-table.model';
import { Router } from '@angular/router';
import { CommonService } from '../../../services/common/common.service';
import { ToastrClientService } from '../../../services/toastr/toastr-client.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { ExtractValuePipe } from '../../pipes/extract-value.pipe';
import { FormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-custom-table',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, FormsModule, ExtractValuePipe, NgbTooltipModule],
  templateUrl: './custom-table.component.html',
  styleUrl: './custom-table.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CustomTableComponent {

  @Output() emitFromCommonTableToParent = new EventEmitter<Object>();
  // @Input('tableComponentObject') tableComponentObj: DynamicTable;
  private _tableComponentObj!: DynamicTable;
  @Input('tableComponentObject') set tableComponentObj(value: DynamicTable) {
    if (this._tableComponentObj && this._tableComponentObj.tBodyList) {
      console.log('not first time', value.tBodyList);
      // this._tableComponentObj.tBodyList = [];
      // this._tableComponentObj.tBodyList = value.tBodyList;
      // this._tableComponentObj = { ... this._tableComponentObj };
      this._tableComponentObj = value;
    } else {
      console.log('first time', value);
      this._tableComponentObj = value;
    }
  }
  get tableComponentObj(): DynamicTable {
    return this._tableComponentObj;
  }

  public customChanges: any;

  public searchKey = "";
  public searchKeyType = "";
  public searchValue: any;

  public sortByColumTDkey = "";
  public isAscending = false;
  // public ascOrDesc = 1; // 1 is for asc and -1 is for desc
  public isExpand = false;

  public paginationObject = {
    isPaginationRequired: true,
    pageSize: 10,
    pageNumber: 1,
    isOrderRequired: false,
    orderField: "",
    isAscending: false,
    isSearchRequired: false,
    key: "",
    value: "", // {}
    filter: {}
  }

  constructor(
    // private cd: ChangeDetectorRef, ////////
    private kvd: KeyValueDiffers, /////////
    private router: Router,
    // private spinner: NgxSpinnerService,
    public service: CommonService,
    // public mdmservice: MdmService,
    private toastr: ToastrClientService
  ) {
    // console.log('constructor called');
    // console.log('ChangeDetectorRef', cd);
    this.customChanges = this.kvd.find({}).create();
  }

  public async resetBtnClicked() {
    this.searchKey = "";
    this.searchKeyType = "";
    this.searchValue;
  }
  public async searchKeyChange(event: any) {
    console.warn('searchKeyChange', event.target.value);
    // this.searchKey = await event.target.value;
    this.paginationObject.key = await event.target.value;
  }
  public async filterBtnClicked() {
    if (this.searchKey === "") { // event.target.value === ""
      this.toastr.warningToastr('Select the field for search');
      return;
    } else if (!this.searchValue) {
      this.toastr.warningToastr('Enter value for search'); // this.searchKey?.toString().trim());
      return;
    } else {
      this.searchKeyType = this.tableComponentObj.headerAndBodyLoopers.filter((hObj) => hObj.TDkey === this.searchKey)[0]?.TDdataType;
      // console.log('searchKey ', this.searchKey, 'searchKeyType ', this.searchKeyType, 'searchValue', this.searchValue);
      this.paginationObject.isSearchRequired = true;
      this.paginationObject.value = await this.searchValue;
      this.emitToParent('filterWithPagination', this.paginationObject, 'pagination');
    }
  }
  public async showEntriesChange(event: any) {
    console.warn('showEntriesChange', event.target.value);
    // this.tableComponentObj.selectedPageSize = await event.target.value;
    this.paginationObject.pageSize = await event.target.value;
    this.emitToParent('entriesChange', this.paginationObject, 'pagination');
  }
  public async pageChange(event: any) {
    console.warn('paginationChange', event);
    // this.tableComponentObj.pageNumber = await event.target.value;
    this.paginationObject.pageNumber = await event;
    this.emitToParent('pageChange', this.paginationObject, 'pagination');
  }
  public async tHeadClicked(TDkey: any, hobj: any, isSortNeeded: any) {
    if (!isSortNeeded || TDkey === "") {
      this.toastr.warningToastr('sort not available on this column');
      return;
    }
    this.isAscending = this.sortByColumTDkey === TDkey ? (!this.isAscending) : false;
    this.sortByColumTDkey = TDkey;
    /////////////////////////
    this.paginationObject.isOrderRequired = true;
    this.paginationObject.isAscending = this.isAscending;
    this.paginationObject.orderField = TDkey;
    // console.log(JSON.stringify(this.paginationObject));
    this.emitToParent('thClicked', this.paginationObject, 'pagination');
  }

  public emitToParent(reference: string, dataValueObject: object, clickedRemark: string, index?: any) {
    let obj = {
      reference: reference,
      dataValueObject: dataValueObject,
      clickedRemark: clickedRemark,
      tableIndex: index
    }
    // console.log(obj);
    switch (clickedRemark) {
      case 'upperBtnClicked':
        if (reference === 'Create') {
          this.router.navigateByUrl(this.tableComponentObj.createNavigate);
        } else {
          this.emitFromCommonTableToParent.emit(obj);
        }
        break;
      case 'tdValueClicked':
        this.emitFromCommonTableToParent.emit(obj);
        break;
      case 'tdActionBtnClicked':
        if (reference === 'Edit') {
          this.service.storeDetails(dataValueObject);
          this.router.navigateByUrl(String(this.tableComponentObj.editNavigate));
        } else {
          this.emitFromCommonTableToParent.emit(obj);
        }
        break;
      case 'pagination':
        this.emitFromCommonTableToParent.emit(obj);
        break;
    }
  }

  public async localSortTableOnKey(key: string, TDdataType: string | number) {
    // this.spinner.show();
    // if (key === "") {
    //   this.toastr.warningToastr('sort not available on this column');
    //   return;
    // }
    // if (this.sortByColumTDkey === key) {
    //   this.ascOrDesc = this.ascOrDesc * (-1);
    // } else {
    //   this.ascOrDesc = 1;
    // }
    // if (TDdataType === "string") {
    //   // donot put async in sort -> this.tBodyList.sort( async (object1, object2)
    //   this.tableComponentObj.tBodyList.sort((object1: { [x: string]: { toUpperCase: () => number; }; }, object2: { [x: string]: { toUpperCase: () => number; }; }) => { //sort((a, b) => a.localeCompare(b));
    //     if (object1[key].toUpperCase() < object2[key].toUpperCase()) {
    //       return -1 * this.ascOrDesc;
    //     }
    //     if (object1[key].toUpperCase() > object2[key].toUpperCase()) {
    //       return 1 * this.ascOrDesc;
    //     }
    //     return 0;
    //   });
    // }
    // if (TDdataType === "number") {
    //   this.tableComponentObj.tBodyList.sort((object1, object2) => { // list.sort((a, b) => (a.color > b.color) ? 1 : (a.color === b.color) ? ((a.size > b.size) ? 1 : -1) : -1 )
    //     return (object1[key] - object2[key]) * this.ascOrDesc;
    //   });
    // }
    // this.sortByColumTDkey = key;
    // console.log('AFTER SORT', this.tableComponentObj.tBodyList);
    // this.spinner.hide();
  }

  public findValueByKeypath(object: any, key: any) {  // role.roleName
    let value = object;
    let array = key.split('.'); //['role', 'roleName']
    for (const ky of array) {
      if (value) {
        value = value[ky];
      }
    }
    return value;
  }

  // public findValueOfKeyf(object, key) { // object: { [x: string]: any; }, key: string) return new Array(Object.keys(obj).length);
  //   let value = new String();
  //   for (const ky of Object.keys(object)) {
  //     if (ky === key) {
  //       console.log('returning *****************', object[ky]);
  //       value = object[ky];
  //       // return this.value;
  //     } else if (object[ky] && typeof (object[ky]) == 'object') {
  //       // console.log(typeof (object[ky]), ky);
  //       // return this.findValueOfKeyf(object[ky], key);
  //       return this.findValueOfKeyf(object[ky], key);
  //     } else {
  //       value = "l"
  //     }
  //   }
  //   // return value;
  //   // this.doAsyncTask(object, key).then(
  //   //   (val) => console.log(val),
  //   //   (err) => console.log(err)
  //   // )
  // }
  // public doAsyncTask(object, key) {
  //   return new Promise((resolve, reject) => {
  //     resolve('done');
  //     //   reject('error');
  //   });
  // }

  // ngOnChanges gets called before ngOnInit and whenever a component's bound input is changed FROM THE PARENT COMPONENT.
  // Remember that ngOnChanges is specific to bound inputs on the component.
  // This means if you don't have any @Input properties on a child, ngOnChanges will never get called.
  ngOnChanges(OnChanges: SimpleChanges) {
    if (OnChanges) {
      console.log('ngOnChanges called', this.tableComponentObj);
    }
  }
  ngOnInit(): void {
    // this.spinner.show();
    // if (!(this.tableComponentObj.tBodyList === [] || this.tableComponentObj.tBodyList.length === 0)) {
    //   this.spinner.hide();
    // }
  }
  ngDoCheck() {
    // console.log('ngDoCheck');
    // const change = this.customChanges.diff(this.tableComponentObj);
    // console.log('change', change);
    // if (change) {
    //   change.forEachChangedItem(item => {
    //     console.log('item changed', item);
    //     // if (item.previousValue !== item.currentValue) {
    //     //   console.log(true);
    //     //   // this.spinner.hide();
    //     // }
    //   });
    //   change.forEachAddedItem(item => {
    //     console.log('item added', item);
    //     // if (item.previousValue !== item.currentValue) {
    //     //   console.log(true);
    //     //   // this.spinner.hide();
    //     // }
    //   });
    //   change.forEachRemovedItem(item => {
    //     console.log('item removed', item);
    //     // if (item.previousValue !== item.currentValue) {
    //     //   console.log(true);
    //     //   // this.spinner.hide();
    //     // }
    //   });
    // } else {
    //   console.log('nothing changed');
    // }
  }
  ngAfterContentInit() {    // console.log('ngAfterContentInit');
  }
  ngAfterContentChecked() {    // console.log('ngAfterContentChecked');
  }
  ngAfterViewInit() {    // console.log('ngAfterViewInit');
  }
  ngAfterViewChecked() {    // console.log('ngAfterViewChecked');
  }
  ngOnDestroy(): void { console.warn('ngOnDestroy called'); }

}
