import { ProductListComponent } from './product-list/product-list.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbThemeModule, NbLayoutModule,NbButtonModule, NbToastrModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { SharedModule } from './shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card'
import { ProductViewComponent } from './product-view/product-view.component';
import { CheckOutProductsComponent } from './check-out-products/check-out-products.component';
import { JwtInterceptor } from './shared/jwt.interceptor';
import { CartComponent } from './cart/cart.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ThankYouPageComponent } from './thank-you-page/thank-you-page.component';
import { PaymentsComponent } from './check-out-products/payments/payments.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { OrdersComponent } from './orders/orders.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import {MatSliderModule} from '@angular/material/slider';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { OrderModule } from 'ngx-order-pipe';
import { CarouselImageDirective } from './Directives/carousel-image.directive';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProductViewComponent,
    ProductListComponent,
    CheckOutProductsComponent,
    CartComponent,
    ThankYouPageComponent,
    PaymentsComponent,
    UserProfileComponent,
    OrdersComponent,
    WishlistComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    CarouselImageDirective,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbLayoutModule,
    NbEvaIconsModule,
    SharedModule,
    NbButtonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FlexLayoutModule,
    MatCardModule,
    MatCheckboxModule,
    MatSliderModule,
    NgbModule,
    OrderModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
  }],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ,
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule { }
