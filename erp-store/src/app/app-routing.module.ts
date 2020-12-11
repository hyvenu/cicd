import { AuthGuard } from './shared/auth.gaurd';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  { path:'', component:HomeComponent,
  canActivate:[AuthGuard]
},
{ path:'Home', component:HomeComponent,
canActivate:[AuthGuard]
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
