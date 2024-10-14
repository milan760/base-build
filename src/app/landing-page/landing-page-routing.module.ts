import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page.component';
import { SigninComponent } from '../components/signin/signin.component';
import { SignupComponent } from '../components/signup/signup.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  {
    path: '', component: LandingPageComponent,
    children: [
      // { path: '', component: HomeComponent },
      { path: '', component: SigninComponent },
      { path: 'signin', component: SigninComponent },
      { path: 'signup', component: SignupComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingPageRoutingModule { }
