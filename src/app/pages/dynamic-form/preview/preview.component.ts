import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.scss'
})
export class PreviewComponent {

  @Input() flag: any;
  @Input() dataFromDashboard: any;
  @Input() dataFromParent!: BehaviorSubject<any>;
  public type: any;
  public controls = [];
  public formName: any;
  public button: any;
  public currentURL: any;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const segments = this.route.snapshot.url.map(segment => segment.path);
    this.currentURL = segments[0]

    if (this.currentURL == 'dashboard') {
      this.type = this.flag
      if (this.type == 'sys-preview') {
        this.formName = this.dataFromDashboard.formName;
        this.controls = this.dataFromDashboard.controls;
      }
    } else {
      this.dataFromParent.subscribe(data => {
        this.formName = data.formName;
        this.controls = data.controls;
        //   // this.button = data.button;
      });
    }
  }
}
