import { AppRoutingModule } from './../app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2SmartTableModule } from 'ng2-smart-table';

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
import { ManageEmployeeComponent } from './manage-employee/manage-employee.component';
import { DepartmentComponent } from './department/department.component';
import { DepartmentListComponent } from './department-list/department-list.component';
import { DesignationComponent } from './designation/designation.component';
import { DesignationListComponent } from './designation-list/designation-list.component';
import { ManageEnquiryComponent } from './manage-enquiry/manage-enquiry.component';
import { ManageEnquiryListComponent } from './manage-enquiry-list/manage-enquiry-list.component';
import { ManageMembersComponent } from './manage-members/manage-members.component';
import { ManageMembersListComponent } from './manage-members-list/manage-members-list.component';

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
  { path: 'ManageEmployee' , component:ManageEmployeeComponent},
  { path: 'Department', component:DepartmentComponent},
  { path: 'DepartmentList', component:DepartmentListComponent},
  { path: 'Designation', component:DesignationComponent},
  { path: 'DesignationList', component:DesignationListComponent},
  { path: 'Enquiry', component:ManageEnquiryComponent},
  { path: 'EnquiryList', component:ManageEnquiryListComponent},
  { path: 'Members', component:ManageMembersComponent},
  { path: 'MembersList', component:ManageMembersListComponent},
];

@NgModule({
  declarations: [LoginComponent, RegisterComponent, HeaderComponent, FooterComponent, StoreSelectComponent, DashboardComponent,AppLoaderComponent,UserProfileComponent, ResetPasswordComponent, AppointmentBookComponent, ManageCustomerComponent, ViewBookingComponent, CalenderComponent, ManageEmployeeComponent, DepartmentComponent, DepartmentListComponent, DesignationComponent, DesignationListComponent, ManageEnquiryComponent, ManageEnquiryListComponent, ManageMembersComponent, ManageMembersListComponent],
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
    Ng2SmartTableModule,
    
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers:[NbMenuService,
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }
  ],
  exports: [HeaderComponent,FooterComponent,LoginComponent,RegisterComponent,DashboardComponent,AppLoaderComponent]
})
export class SharedModule { }
