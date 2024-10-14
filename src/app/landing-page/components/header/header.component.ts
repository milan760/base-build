import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {


  @Output() menuName: EventEmitter<any> = new EventEmitter();

  public activeMenu = 6; // 1
  public menusLandingPg = [
    { id: 1, menuPath: 'home', name: 'HOME', isActive: false, hasSubmenu: false },
    { id: 2, menuPath: 'aboutus', name: 'ABOUT US', isActive: false, hasSubmenu: false },
    { id: 3, menuPath: 'howitworks', name: 'GUIDELINES', isActive: false, hasSubmenu: false },
    { id: 4, menuPath: 'dashboard', name: 'FAQ', isActive: false, hasSubmenu: false },
    { id: 5, menuPath: 'Commonmaster', name: 'CONTACTS', isActive: false, hasSubmenu: false },
    { id: 6, menuPath: 'Search', name: 'Search', icon: 'fa fa-search', isActive: false, hasSubmenu: false },
  ];

  constructor(
    // private appSettings: AppSetting
    private router: Router
  ) {
    // this.settings = this.appSettings.setting;
  }

  ngOnInit() {
  }

  public navigateTo(Path: any) {
    this.router.navigateByUrl(Path);
  }

  public redirectToMenuLinks(menu: any) {
    this.activeMenu = menu.id;
    // this.menusLandingPg.filter(item => { item.isActive = false; });
    // this.menusLandingPg.filter(item => item.id === this.activeMenu)[0].isActive = true;
    //   this.menuName.emit(name);
    // console.log(menu.menuPath);
    this.router.navigateByUrl('/landing-page/' + menu.menuPath);
  }

}
