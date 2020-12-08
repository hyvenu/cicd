import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';



@NgModule({
  declarations: [LoginComponent, RegisterComponent, HeaderComponent, FooterComponent],
  imports: [
    CommonModule
  ],
  exports: [HeaderComponent,FooterComponent,LoginComponent,RegisterComponent]
})
export class SharedModule { }
