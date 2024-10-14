import { Routes } from '@angular/router';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ErrorDisplayComponent } from './components/error-display/error-display.component';

export const routes: Routes = [
    { path: '', redirectTo: 'landing-page', pathMatch: 'full' },
    { path: 'landing-page', loadChildren: () => import('./landing-page/landing-page.module').then(m => m.LandingPageModule) },
    { path: 'pages', loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule) },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'error', component: ErrorDisplayComponent },
    { path: '**', component: ErrorDisplayComponent },
];
