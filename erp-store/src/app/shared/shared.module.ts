import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NbThemeModule, NbLayoutModule,NbButtonModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: 'Login' , component: LoginComponent},
  { path: 'Register' , component: RegisterComponent},
];

@NgModule({
  declarations: [LoginComponent, RegisterComponent, HeaderComponent, FooterComponent],
  imports: [
    CommonModule,
    NbButtonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
  ],
  exports: [HeaderComponent,FooterComponent,LoginComponent,RegisterComponent]
})
export class SharedModule { }
