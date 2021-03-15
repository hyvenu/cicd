import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { OrdersComponent } from './orders/orders.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { CheckOutProductsComponent } from './check-out-products/check-out-products.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductViewComponent } from './product-view/product-view.component';
import { AuthGuard } from './shared/auth.gaurd';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CartComponent } from './cart/cart.component';
import { ThankYouPageComponent } from './thank-you-page/thank-you-page.component';
import { PaymentsComponent } from './check-out-products/payments/payments.component';

const routes: Routes = [
  { path:'', component:HomeComponent
},
{ path:'Home', component:HomeComponent
},
{path:"category",component:ProductListComponent},
{path:"productview",component:ProductViewComponent},
{path:"checkout",component:CheckOutProductsComponent, canActivate:[AuthGuard]},
{path:"cart",component:CartComponent, canActivate:[AuthGuard]},
{path:"OrderSummary",component:ThankYouPageComponent, canActivate:[AuthGuard]},
{path:"payment",component:PaymentsComponent, canActivate:[AuthGuard]},
{path:"profile",component:UserProfileComponent, canActivate:[AuthGuard]},
{path:"myorders",component:OrdersComponent, canActivate:[AuthGuard]},
{path:"wishlist",component:WishlistComponent, canActivate:[AuthGuard]},
{path:"forgotpassword",component:ForgotPasswordComponent},
{path:"resetpassword",component:ResetPasswordComponent, canActivate:[AuthGuard]},



];

@NgModule({
  imports: [RouterModule.forRoot(routes,{scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
