import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { ChangePasswordComponent } from './afterLoginLayout/change-password/change-password.component';
import { UserProfileComponent } from './afterLoginLayout/user-profile/user-profile.component';

const routes: Routes = [
  {
    path: '', component: PagesComponent,
    children: [
      {
        path: 'uac',
        loadChildren: () => import('./uac/uac.module').then(m => m.UacModule)
      },
      {
        path: 'mdm',
        loadChildren: () => import('./mdm/mdm.module').then(m => m.MdmModule)
      }
    ]
  },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'user-profile', component: UserProfileComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
