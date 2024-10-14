import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { ViewUserComponent } from './components/user/view-user/view-user.component';
import { CreateUserComponent } from './components/user/create-user/create-user.component';
import { ViewRoleComponent } from './components/role/view-role/view-role.component';
import { CreateRoleComponent } from './components/role/create-role/create-role.component';
import { ViewResourceComponent } from './components/resource/view-resource/view-resource.component';
import { CreateResourceComponent } from './components/resource/create-resource/create-resource.component';
import { RoleResourceMappingComponent } from './components/role-resource-mapping/role-resource-mapping.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: AdminDashboardComponent },
  {
    path: 'user', children: [
      { path: '', redirectTo: 'view', pathMatch: 'full' },
      { path: 'view', component: ViewUserComponent },
      { path: 'create', component: CreateUserComponent },
      { path: 'edit', component: CreateUserComponent }
    ]
  },
  {
    path: 'role', children: [
      { path: '', redirectTo: 'view', pathMatch: 'full' },
      { path: 'view', component: ViewRoleComponent },
      { path: 'create', component: CreateRoleComponent },
      { path: 'edit', component: CreateRoleComponent }
    ]
  },
  {
    path: 'resource', children: [
      { path: '', redirectTo: 'view', pathMatch: 'full' },
      { path: 'view', component: ViewResourceComponent },
      { path: 'create', component: CreateResourceComponent },
      { path: 'edit', component: CreateResourceComponent }
    ]
  },
  { path: 'role-resource-mapping', component: RoleResourceMappingComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UacRoutingModule { }
