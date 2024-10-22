import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DynamicFormComponent } from './dynamic-form.component';
import { CreateFormComponent } from './create-form/create-form.component';
import { FullScreenViewComponent } from './full-screen-view/full-screen-view.component';
import { PreviewComponent } from './preview/preview.component';

const routes: Routes = [
  {
    path: '', component: DynamicFormComponent,
    children: [
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
