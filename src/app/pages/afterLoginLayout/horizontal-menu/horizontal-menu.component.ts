import { Component, ElementRef, HostListener, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MdmService } from '../../../services/mdm/mdm.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrClientService } from '../../../services/toastr/toastr-client.service';
import { StorageService } from '../../../services/storage/storage.service';
import { CommonService } from '../../../services/common/common.service';
import { CommonModule } from '@angular/common';


interface Resource {
  resourceId: number,
  name: string,
  description: string,
  parentResourceId: any,
  hasSubMenu: boolean,
  path: string,
  icon: string,
  level: number,
  status: statusobj
  createdBy: string,
  createdDt: string,
  updatedBy: string,
  updatedDt: string,
  mapped: boolean,
  orderIn: number,
  expanded: boolean,
  responseDTOs: any
}
interface statusobj {
  statusId: number,
  statusCode: string,
  statusDescription: string
}
@Component({
  selector: 'app-horizontal-menu',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './horizontal-menu.component.html',
  styleUrl: './horizontal-menu.component.scss'
})
export class HorizontalMenuComponent {

  @ViewChildren('menus') menus!: QueryList<ElementRef>;
  @ViewChild('sidebarBtn') sidebarBtn!: ElementRef;
  @ViewChild('sidebarMenu') sidebarMenu!: ElementRef;

  public activeIndex = 0;
  // public marginLeft = 0;
  // public scrollSize = 0;

  public viewResourcesList: Resource[] = [];
  public resources: Resource[] = [];

  public resourceStatus;
  public getRole: any;
  public innerWidth: any;
  public getResource: any;
  // public isShowSlideBtns;

  public isCallFirst = false;
  public showSideNavabar = false;
  // public enableScrollBtn = true;
  // public isDisableSlideBtns = false;

  public nta_url = '#/pages/exam-conducting-agency';
  public currentLocation = '';

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }

  // @HostListener('document:click', ['$event.target'])
  // public onClick(targetElement: any) {
  //   if (targetElement != this.sidebarBtn?.nativeElement) {
  //     const clickedInside = this.sidebarMenu?.nativeElement.contains(targetElement);
  //     if (!clickedInside) {
  //       this.showSideNavabar = false;
  //       if (this.getResource) {
  //         this.getResource.expanded = false;
  //       }
  //     }
  //   }
  // }

  constructor(
    private router: Router,
    public mdmService: MdmService,
    private elementRef: ElementRef,
    private spinner: NgxSpinnerService,
    private toaster: ToastrClientService,
    private storageService: StorageService,
    private commonService: CommonService
  ) {
    this.resourceStatus = 'pending';
  }

  ngDoCheck(): void {
    // if (this.scrollableContents?.nativeElement?.offsetWidth > this.scrollable?.nativeElement?.offsetWidth) {
    //     this.isShowSlideBtns = true;
    // }
  }

  ngOnInit() {
    this.getAllResourceByLogin();
    this.innerWidth = window.innerWidth;
    this.getRole = this.storageService.getAccessDetailsFromLocalStorage();
    if (['ROLE_INVIGILATOR', 'ROLE_OBSERVER', 'ROLE_CC', 'ROLE_SC', 'ROLE_NC'].includes(this.getRole?.roleCode)) {
      this.getResourceDetailsByRoleName();
    } else {
      if (this.storageService.getLocalStorageByAttribute('activeMenu')) {
        this.activeIndex = this.storageService.getLocalStorageByAttribute('activeMenu');
      } else {
        this.storageService.setLocalStorageByAttribute('activeMenu', 0);
        this.activeIndex = this.storageService.getLocalStorageByAttribute('activeMenu');
      }
    }
    this.commonService.activeIndex.subscribe((value) => {
      this.activeIndex = value;
    })
  }

  ngOnDestroy() {
    this.commonService.activeIndex.unsubscribe();
  }

  public getAllResourceByLogin() {
    this.spinner.show();
    this.mdmService.getAllResourceByAuthenticatingRole().subscribe({
      next: (res: Resource[]) => {  // Define the type of 'res'
        if (res.length) {
          this.resources = res;
          this.currentLocation = this.resources[0].path;

          for (let i = 0; i < Math.min(5, this.resources.length); i++) {
            this.viewResourcesList.push(this.resources[i]);  // Ensure correct type for push
          }
        } else {
          this.toaster.warningToastr('No resources received');
        }
      },
      error: (err) => {
        console.error('Error fetching captcha:', err);
        this.spinner.hide();
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }

  public getResourceDetailsByRoleName() {
    this.spinner.show();
    this.mdmService.getResourceDetailsByRoleName().subscribe(
      res => {
        if (res) {
          if (res.detailsStatus.statusId == 3) {
            this.resourceStatus = 'pending';
            this.storageService.setLocalStorageByAttribute('activeMenu', 1);
            this.activeIndex = this.storageService.getLocalStorageByAttribute('activeMenu');
            if (this.isCallFirst) {
              this.toaster.infoToastr('Fill and submit self details form for access all menus');
            }
            this.isCallFirst = true;
            this.router.navigateByUrl('pages/resources/self-details');
          } else if (res.detailsStatus.statusId == 2) {
            this.resourceStatus = 'completed';
            if (this.storageService.getLocalStorageByAttribute('activeMenu')) {
              this.activeIndex = this.storageService.getLocalStorageByAttribute('activeMenu');
            } else {
              this.storageService.setLocalStorageByAttribute('activeMenu', 0);
              this.activeIndex = this.storageService.getLocalStorageByAttribute('activeMenu');
            }
          }
        }
      },
      error => {
        this.spinner.hide();
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  public redirectToMenu(resource: any, index: any) {
    if (['ROLE_INVIGILATOR', 'ROLE_OBSERVER', 'ROLE_CC', 'ROLE_SC', 'ROLE_NC'].includes(this.getRole?.roleCode)) {
      if (this.resourceStatus == 'pending') {
        this.getResourceDetailsByRoleName();
        return;
      }
    }

    this.storageService.setLocalStorageByAttribute('activeMenu', index);
    this.activeIndex = index;
    if (!resource.path) {
      return;
    } else {
      // this.showSideNavabar = false;
      this.router.navigateByUrl(resource.path);
    }

    // if (menu.name === 'Dashboard') {
    // this.router.navigateByUrl('pages/admin');
    // } else if (menu.name === 'Feedback' || menu.name === 'Search') {
    //     this.activeIndex = null;
    //     this.router.navigateByUrl('pages/admin/' + menu.menuPath);
    // } else {
    //     this.activeIndex = index;
    // }
  }

  isMenuActive = false;
  public btnClick() {
    this.isMenuActive = !this.isMenuActive;

    this.commonService.toggleMainContentSize(this.isMenuActive);
    this.showSideNavabar = !this.showSideNavabar;
    if (!this.showSideNavabar && this.getResource !== undefined) {
      this.getResource.expanded = false;
    }
  }

  public handleClick(item: any) {
    this.getResource = item;
    for (let resource of this.resources) {
      if (item != resource && resource.expanded) {
        resource.expanded = false;
      } else if (item == resource) {
        item.expanded = !item.expanded;
      }
    }
  }

  public getActiveClass(item: any) {
    let curl = this.router.url.substring(1);
    for (let i = 0; i < item.responseDTOs.length; i++) {
      if (curl.includes(item.responseDTOs[i].path)) {
        return 'activeMenu';
      }
    }
    return '';
  }

  public getActiveClassforHorMenu(item: any) {
    let curl = this.router.url.substring(1);
    for (let i = 0; i < item.responseDTOs.length; i++) {
      if (curl.includes(item.responseDTOs[i].path)) {
        return 'active-menu';
      }
    }
    return '';
  }

  public onClickMenu() {
    // this.showSideNavabar = false;
    if (this.getResource !== undefined) {
      this.getResource.expanded = false;
    }
  }
}
