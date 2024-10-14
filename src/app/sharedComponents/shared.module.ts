import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomTableComponent } from './components/custom-table/custom-table.component';
import { ExtractValuePipe } from './pipes/extract-value.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CustomTableComponent,
    ExtractValuePipe,
    NgbModule
  ]
})
export class SharedModule { }
