import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreComponent } from './store/store.component';
import { StoreListComponent } from './store-list/store-list.component';
import { AuthGuard } from '../shared/auth.gaurd';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NbInputModule, NbLayoutModule, NbListModule, NbButtonModule, NbCardModule, NbToastrModule, NbDialogModule, NbUserModule, NbTabsetModule, NbSelectModule, NbDialogService, NbToastrService } from '@nebular/theme';
import { SharedModule } from '../shared/shared.module';
import { MainPipe } from '../pipe.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ImageUploadModule } from 'angular2-image-upload';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { NgxPermissionsModule } from 'ngx-permissions';

const routes: Routes = [
  { path: 'ManageStore' , component: StoreComponent,canActivate:[AuthGuard]},
  { path: 'ManageStoreList' , component: StoreListComponent,canActivate:[AuthGuard]},
  { path: 'AdminSite' , component: AdminDashboardComponent,canActivate:[AuthGuard]},
   
];

@NgModule({
  declarations: [StoreComponent, StoreListComponent, AdminDashboardComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot(routes),
    SharedModule,
    NbInputModule,
    NbLayoutModule,
    NbListModule,
    NbButtonModule,
    NbCardModule,
    NbToastrModule.forRoot(),
    NbDialogModule.forRoot(),
    NbUserModule,
    NbTabsetModule,
    Ng2SmartTableModule,
    NbSelectModule,
    ImageUploadModule.forRoot(),
    MainPipe.forRoot(),
    NgxPermissionsModule.forRoot(),
  ],
  providers:[NbToastrService, NbDialogService],
  exports: []
})
export class AdminModule { }
