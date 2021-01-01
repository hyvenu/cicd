import { CheckOutProductsComponent } from './check-out-products/check-out-products.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductViewComponent } from './product-view/product-view.component';
import { AuthGuard } from './shared/auth.gaurd';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path:'', component:HomeComponent
},
{ path:'Home', component:HomeComponent
},
{path:"category/:id",component:ProductListComponent,  canActivate:[AuthGuard]},
{path:"productview/:id",component:ProductViewComponent, canActivate:[AuthGuard]},
{path:"checkout",component:CheckOutProductsComponent, canActivate:[AuthGuard]}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
