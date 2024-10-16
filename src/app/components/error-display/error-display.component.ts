import { Component } from '@angular/core';
import { ActivatedRoute, Router, RoutesRecognized } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { filter, pairwise } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-error-display',
  standalone: true,
  imports: [],
  templateUrl: './error-display.component.html',
  styleUrl: './error-display.component.scss'
})
export class ErrorDisplayComponent {

  public errObj: any;
  public prevUrl: any;

  constructor(
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private router: Router,
    private location: Location,
  ) {
    console.log(this.constructor.name);
  }

  ngOnInit(): void {
    this.spinner.hide();
    // console.log(this.route.snapshot.paramMap.get("queryParams"));
    // this.route.paramMap.subscribe(params => {
    this.route.queryParams.subscribe(params => {
      console.log(params);
      this.errObj = params;
    });
    this.router.events.pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
      .subscribe((events: RoutesRecognized[]) => {
        console.log('previous url', events[0].urlAfterRedirects, 'current url', events[1].urlAfterRedirects);
      });
  }

  public goTo() {
    // this.router.navigate(['..'], { relativeTo: this.route });
    if (this.errObj && this.errObj.redirectLink) {
      this.router.navigateByUrl(this.errObj.redirectLink);
    } else if (this.prevUrl) {
      this.router.navigateByUrl(this.prevUrl);
    } else {
      this.location.back();
    }
  }
}
