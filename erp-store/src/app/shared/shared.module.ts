import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NbThemeModule, NbLayoutModule,NbButtonModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ToastComponent } from './toast/toast.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


const routes: Routes = [
  { path: 'Login' , component: LoginComponent},
  { path: 'Register' , component: RegisterComponent},
];

@NgModule({
  declarations: [LoginComponent, RegisterComponent, HeaderComponent, FooterComponent, ToastComponent,ToastComponent],
  imports: [
    CommonModule,
    NbButtonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    NgbModule
  ],
  exports: [HeaderComponent,FooterComponent,LoginComponent,RegisterComponent,ToastComponent]
})
export class SharedModule { }
