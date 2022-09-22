import { SiteSettingsComponent } from './admin/site-settings/site-settings.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared/auth.gaurd';
import { DashboardComponent } from './shared/dashboard/dashboard.component';

const routes: Routes = [
  { path:'',component: DashboardComponent , canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
