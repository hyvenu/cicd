import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbThemeModule, NbLayoutModule,NbButtonModule ,NbCardModule,NbListModule,NbInputModule, NbToastrModule, NbDialogModule, NbDialogService, NbUserModule, NbTabsetModule, NbSelectModule} from '@nebular/theme';
import {NbDatepickerModule} from '@nebular/theme';
import { NbToastrService } from '@nebular/theme';

import { AuthGuard } from '../shared/auth.gaurd';

import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ImageUploadModule } from 'angular2-image-upload';
import { SearchPipe } from '../search.pipe';


import { ManageVendorComponent } from './manage-vendor/manage-vendor.component';
import { VendorListComponent } from './vendor-list/vendor-list.component';
import { PurchaseRequisitionComponent } from './purchase-requisition/purchase-requisition.component';
import { PurchaseRequisitionListComponent } from './purchase-requisition-list/purchase-requisition-list.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { PurchaseOrderListComponent } from './purchase-order-list/purchase-order-list.component';
import { MainPipe } from '../pipe.module';
import { NbMomentDateModule } from '@nebular/moment';


const routes: Routes = [
   { path: 'ManageVendor' , component: ManageVendorComponent,canActivate:[AuthGuard]},
   { path: 'ManageVendortMaster' , component: VendorListComponent,canActivate:[AuthGuard]},
   { path: 'PurchaseRequisition' , component: PurchaseRequisitionComponent,canActivate:[AuthGuard]},
   { path: 'PurchaseRequisitionList' , component: PurchaseRequisitionListComponent,canActivate:[AuthGuard]},
   { path: 'PurchaseOrder' , component: PurchaseOrderComponent,canActivate:[AuthGuard]},
];

@NgModule({
  declarations: [ManageVendorComponent,VendorListComponent, PurchaseRequisitionComponent, PurchaseRequisitionListComponent, PurchaseOrderComponent, PurchaseOrderListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot(routes),
    MainPipe.forRoot(),
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
    NbDatepickerModule,
    NbMomentDateModule,
    ImageUploadModule.forRoot(),
  ]
})
export class PurchaseModule { }
