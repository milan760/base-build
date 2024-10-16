import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  BsDatepickerConfig,
  BsDatepickerModule,
} from 'ngx-bootstrap/datepicker';
import { ToastrClientService } from '../../../../services/toastr/toastr-client.service';
import { MdmService } from '../../../../services/mdm/mdm.service';
import { ChartsService } from '../../../../services/charts/charts.service';
import { barData, barDataTwo, doughnutData } from './data';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {

  activePath: number = 0;
  todayDate = new Date();

  public datacard = [
    { cardTitle: 'Complaints Registered', value: 152 },
    { cardTitle: 'Complaints Closed', value: 80 },
    { cardTitle: 'Complaints Pending', value: 72 },
  ];
  profileData: any;

  // colorScheme = {
  //   domain: ['#6396db', '#654fbc', '#ec4887'],
  // };
  // barTwoColorScheme = {
  //   domain: ['#6396db', '#654fbc', '#ec4887'],
  // };

  schoolBar = [
    {
      name: 'Primary School',
      value: 30,
    },
    {
      name: 'High School',
      value: 60,
    },
    {
      name: 'Primary with Upper Primary',
      value: 10,
    },
  ];
  resultBarTwo = [
    {
      name: 'Class 1 to 8',
      value: 45,
    },
    {
      name: 'Class 9 to 12',
      value: 65,
    },
  ];

  barData = barData;
  barDataTwo = barDataTwo;
  pieData = doughnutData
  // minWidth = 200;
  // view = [600, 200];
  // barView = [1000, 300];
  // pieView = [300, 300];
  // barPadding = 10;

  colorTheme = 'theme-green';

  bsConfig?: Partial<BsDatepickerConfig>;
  bsConfigMonth: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  todayMonth: any;

  constructor(
    private toastr: ToastrClientService,
    private mdmservice: MdmService,
    private spinner: NgxSpinnerService,
    private chartService: ChartsService
  ) {
    // this.getMonth()
  }
  ngAfterViewInit(): void {
    this.chartService.doughnutChart('doughnutOne', this.pieData);
    this.chartService.doughnutChart('doughnutTwo', this.pieData);
    this.chartService.doughnutChart('doughnutThree', this.pieData);
    this.chartService.pieChart('pie-chart', this.pieData);
    this.chartService.pieChart('pie-chart-two', this.pieData);
    this.chartService.stackedBarChart('stackedBarChart', this.pieData);
    this.chartService.groupedBarChart('groupedBarChart', this.pieData);

  }

  ngOnInit() {
    // this.userData = this.storageService.getAccessDetailsFromLocalStorage();
    this.getProfileDetails();

    this.bsConfig = Object.assign(
      { isAnimated: true, adaptivePosition: true },
      {
        containerClass: 'theme-blue', // Replace 'themeName' with the desired theme for date
      }
    );


  }

  // getMonth() {

  //   this.bsConfigMonth.dateInputFormat = 'YYYY-MM';

  // }
  tooltipFormatter(data: any): string {
    let text;

    text = `<h6>${data.data.name}:<br> ${data.data.value}%</h6>`;

    return text;
  }

  setActivePath(pathNumber: number): void {
    this.activePath = pathNumber;
  }

  isActivePath(pathNumber: number): boolean {
    return this.activePath === pathNumber;
  }

  public getProfileDetails() {
    // this.spinner.show();
    // this.mdmservice.profileDetails().subscribe(
    //   res => {
    //     if (res) {
    //       this.profileData = res;
    //       // this.profileImage = this.userData.user.profilePic;
    //       console.log("profile Data", res)
    //       // console.log("inside goToEdit()", res)

    //     } else {
    //       this.toastr.infoToastr("No Profile Details Found !");
    //     }
    //   },
    //   error => {
    //     this.spinner.hide();
    //     this.toastr.dangerToastr('Something Went Wrong');
    //     // this.toastr.dangerToastr(error.status);
    //     console.log(error);
    //   },
    //   () => {
    //     this.spinner.hide();
    //   });
  }




}
