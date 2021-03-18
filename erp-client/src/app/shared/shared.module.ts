import { AppRoutingModule } from './../app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NbThemeModule, NbLayoutModule,NbUserModule,NbButtonModule ,NbCardModule,NbListModule,NbContextMenuModule,NbMenuModule,NbMenuService, NbTabsetModule} from '@nebular/theme';
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


const routes: Routes = [
  { path: 'Login' , component: LoginComponent},
  { path: 'Register' , component: RegisterComponent},
  { path: 'StoreSelect' , component: StoreSelectComponent},
  { path: 'Profile' , component: UserProfileComponent},
  { path: 'resetpassword' , component: ResetPasswordComponent},
];

@NgModule({
  declarations: [LoginComponent, RegisterComponent, HeaderComponent, FooterComponent, StoreSelectComponent, DashboardComponent,AppLoaderComponent,UserProfileComponent, ResetPasswordComponent],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NbButtonModule,
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
  ],
  providers:[NbMenuService,
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }
  ],
  exports: [HeaderComponent,FooterComponent,LoginComponent,RegisterComponent,DashboardComponent,AppLoaderComponent]
})
export class SharedModule { }
