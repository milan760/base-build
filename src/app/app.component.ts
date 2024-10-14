import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  title = 'base-build';
  public auth: boolean = false;

  constructor() {
    if (window.location !== window.parent.location) {
      this.auth = false;
    } else {
      this.auth = true;
    }
  }

  ngOnInit() {
    document.documentElement.style.setProperty('--darkTheme-color', '#033454');
    document.documentElement.style.setProperty('--lightTheme-color', '#1642dbc2');
    document.documentElement.style.setProperty('--lighterTheme-color', '#1642dbc2');
    document.documentElement.style.setProperty('--header-color', '#033454');
    document.documentElement.style.setProperty('--menu-color', '#033454');
  }
}
