import { AppRoutingModule } from './../app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NbThemeModule, NbLayoutModule,NbUserModule,NbButtonModule ,NbCardModule,NbListModule,NbContextMenuModule,NbMenuModule,NbMenuService, NbTabsetModule, NbInputModule, NbSelectModule, NbDatepickerModule} from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { StoreSelectComponent } from './store-select/store-select.component';
import { AuthGuard } from './auth.gaurd';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SearchPipe } from '../search.pipe';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AppLoaderComponent } from './app-loader/app-loader.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoaderService } from '../loader.service';
import { LoaderInterceptor } from '../loader-interceptor.service';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AppointmentBookComponent } from './appointment-book/appointment-book.component';
import { ManageCustomerComponent } from './manage-customer/manage-customer.component';
import { ViewBookingComponent } from './view-booking/view-booking.component';
import { MainPipe } from '../pipe.module';
import { CalenderComponent } from './calender/calender.component';
import { CalendarModule } from 'angular-calendar';
import { SchedulerModule } from 'angular-calendar-scheduler';
import { DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { ChartsModule } from 'ng2-charts';

const routes: Routes = [
  { path: 'Login' , component: LoginComponent},
  { path: 'Register' , component: RegisterComponent},
  { path: 'StoreSelect' , component: StoreSelectComponent},
  { path: 'Profile' , component: UserProfileComponent},
  { path: 'resetpassword' , component: ResetPasswordComponent},
  { path: 'ManageCustomer' , component: ManageCustomerComponent},
  { path: 'ManageBooking' , component: AppointmentBookComponent},
  { path: 'ViewBooking' , component: ViewBookingComponent},
  { path: 'Calendar' , component: CalenderComponent},
];

@NgModule({
  declarations: [LoginComponent, RegisterComponent, HeaderComponent, FooterComponent, StoreSelectComponent, DashboardComponent,AppLoaderComponent,UserProfileComponent, ResetPasswordComponent, AppointmentBookComponent, ManageCustomerComponent, ViewBookingComponent, CalenderComponent],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NbInputModule,
    NbButtonModule,
    NbSelectModule,
    NbDatepickerModule,
    NbCardModule,
    NbListModule,
    NbTabsetModule,
    FormsModule,
    NbLayoutModule,
    NbEvaIconsModule,
    NbMenuModule.forRoot(),
    NbUserModule,
    NbContextMenuModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    MainPipe.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    SchedulerModule.forRoot({ locale: 'en', headerDateFormat: 'daysRange' }),
    ChartsModule,
    
  ],
  providers:[NbMenuService,
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }
  ],
  exports: [HeaderComponent,FooterComponent,LoginComponent,RegisterComponent,DashboardComponent,AppLoaderComponent]
})
export class SharedModule { }
