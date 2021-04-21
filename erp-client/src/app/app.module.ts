import { UserProfileComponent } from './shared/user-profile/user-profile.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbThemeModule, NbLayoutModule, NbToastrModule, NbToastrService, NbSidebarModule, NbMenuModule, NbSelectModule, NbSpinnerModule } from '@nebular/theme';
import {NbDatepickerModule} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { SharedModule } from './shared/shared.module';
import { AdminModule } from './admin/admin.module';
import { InventoryModule } from './inventory/inventory.module';
import { SalesModule } from './sales/sales.module';
import { PurchaseModule } from './purchase/purchase.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './shared/jwt.interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainPipe } from './pipe.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgxEditorModule } from 'ngx-editor';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot({ name: 'default' }),
    MainPipe.forRoot(),
    NbLayoutModule,
    NbEvaIconsModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    InventoryModule,
    SalesModule,
    PurchaseModule,
    HttpClientModule,
    NbToastrModule.forRoot(),
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbSelectModule,
    NbDatepickerModule.forRoot(),
    NgxPermissionsModule.forRoot(),
    AdminModule,
    NgxEditorModule,
    NbSpinnerModule,
    ChartsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
  },NbToastrService,

],
  bootstrap: [AppComponent]
})
export class AppModule { }
