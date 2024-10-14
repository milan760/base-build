import { Component, Input, ViewEncapsulation } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-captcha',
  standalone: true,
  imports: [],
  templateUrl: './captcha.component.html',
  styleUrl: './captcha.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CaptchaComponent {

  @Input() url!: SafeUrl;
  public cUrl!: SafeUrl;
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.cUrl = this.url;
  }

}
