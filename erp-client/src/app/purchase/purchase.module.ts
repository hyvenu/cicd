import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbThemeModule, NbLayoutModule,NbButtonModule ,NbCardModule,NbListModule,NbInputModule, NbToastrModule, NbDialogModule, NbDialogService, NbUserModule, NbTabsetModule, NbSelectModule} from '@nebular/theme';
import { NbToastrService } from '@nebular/theme';

import { AuthGuard } from '../shared/auth.gaurd';

import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ImageUploadModule } from 'angular2-image-upload';
import { SearchPipe } from '../search.pipe';


import { ManageVendorComponent } from './manage-vendor/manage-vendor.component';
import { VendorListComponent } from './vendor-list/vendor-list.component';

const routes: Routes = [
   { path: 'ManageVendor' , component: ManageVendorComponent,canActivate:[AuthGuard]},
   { path: 'ManageVendortMaster' , component: VendorListComponent,canActivate:[AuthGuard]},

];

@NgModule({
  declarations: [ManageVendorComponent,VendorListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot(routes),
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
  ]
})
export class PurchaseModule { }
