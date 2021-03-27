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
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SideNavbarContentComponent } from './side-navbar-content/side-navbar-content.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatListModule} from '@angular/material/list';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSnackBarModule} from '@angular/material/snack-bar';

const routes: Routes = [
  { path: 'Login' , component: LoginComponent},
  { path: 'Register' , component: RegisterComponent},
];

@NgModule({
  declarations: [LoginComponent, RegisterComponent, HeaderComponent, FooterComponent, ToastComponent,ToastComponent, SideNavbarContentComponent],
  imports: [
    CommonModule,
    NbButtonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes,{scrollPositionRestoration: 'enabled'}),
    NgbModule,
    FlexLayoutModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatListModule,
    MatExpansionModule,
    MatSnackBarModule,
  ],
  exports: [HeaderComponent,FooterComponent,LoginComponent,RegisterComponent,ToastComponent, MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,SideNavbarContentComponent]
})
export class SharedModule { }
