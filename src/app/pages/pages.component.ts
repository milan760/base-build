import { Component, ElementRef, ViewChild } from '@angular/core';
import { HeaderComponent } from './afterLoginLayout/header/header.component';
import { FooterComponent } from './afterLoginLayout/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { CommonService } from '../services/common/common.service';

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.scss'
})
export class PagesComponent {

  @ViewChild('mainContent') mainContent!: ElementRef;

  constructor(private commonService: CommonService) { }

  ngOnInit() {
    this.commonService.getMenuState().subscribe(isMenuActive => {
      if (isMenuActive) {
        this.mainContent.nativeElement.style.marginLeft = '300px';
      } else {
        if (this.mainContent !== undefined) {
          this.mainContent.nativeElement.style.marginLeft = '0';
        }
      }
    });
  }
}
