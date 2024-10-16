import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewStateComponent } from './components/state/view-state/view-state.component';
import { CreateStateComponent } from './components/state/create-state/create-state.component';
import { ViewDistrictComponent } from './components/district/view-district/view-district.component';
import { CreateDistrictComponent } from './components/district/create-district/create-district.component';
import { ViewIconComponent } from './components/icon-setup/view-icon/view-icon.component';
import { CreateIconComponent } from './components/icon-setup/create-icon/create-icon.component';

const routes: Routes = [
  {
    path: 'state', children: [
      { path: '', redirectTo: 'view', pathMatch: 'full' },
      { path: 'view', component: ViewStateComponent },
      { path: 'create', component: CreateStateComponent },
      { path: 'edit', component: CreateStateComponent }
    ]
  },
  {
    path: 'district', children: [
      { path: '', redirectTo: 'view', pathMatch: 'full' },
      { path: 'view', component: ViewDistrictComponent },
      { path: 'create', component: CreateDistrictComponent },
      { path: 'edit', component: CreateDistrictComponent }
    ]
  },
  {
    path: 'icon-setup', children: [
      { path: '', redirectTo: 'view', pathMatch: 'full' },
      { path: 'view', component: ViewIconComponent },
      { path: 'create', component: CreateIconComponent },
      { path: 'edit', component: CreateIconComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MdmRoutingModule { }
