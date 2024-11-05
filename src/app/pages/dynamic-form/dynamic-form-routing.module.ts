import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateFormComponent } from './create-form/create-form.component';
import { FullScreenViewComponent } from './full-screen-view/full-screen-view.component';
import { PreviewComponent } from './preview/preview.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DynamicFormComponent } from './dynamic-form.component';

const routes: Routes = [
  {
    path: '', component: DynamicFormComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'create-form', component: CreateFormComponent },
      { path: 'full-screen-view', component: FullScreenViewComponent },
      { path: 'preview', component: PreviewComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DynamicFormRoutingModule { }
