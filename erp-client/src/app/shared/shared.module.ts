import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NbThemeModule, NbLayoutModule,NbUserModule,NbButtonModule ,NbCardModule,NbListModule,NbContextMenuModule,NbMenuModule,NbMenuService} from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { StoreSelectComponent } from './store-select/store-select.component';
import { AuthGuard } from './auth.gaurd';
import { DashboardComponent } from './dashboard/dashboard.component';



const routes: Routes = [
  { path: 'Login' , component: LoginComponent},
  { path: 'Register' , component: RegisterComponent},
  { path: 'StoreSelect' , component: StoreSelectComponent},
];

@NgModule({
  declarations: [LoginComponent, RegisterComponent, HeaderComponent, FooterComponent, StoreSelectComponent, DashboardComponent],
  imports: [
    CommonModule,
    NbButtonModule,
    NbCardModule,
    NbListModule,
    FormsModule,
    NbMenuModule.forRoot(),
    NbUserModule,
    NbContextMenuModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
  ],
  providers:[NbMenuService],
  exports: [HeaderComponent,FooterComponent,LoginComponent,RegisterComponent,DashboardComponent]
})
export class SharedModule { }
