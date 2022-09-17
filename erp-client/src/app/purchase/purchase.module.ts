import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbThemeModule, NbLayoutModule,NbButtonModule ,NbCardModule,NbListModule,NbInputModule, NbToastrModule, NbDialogModule, NbDialogService, NbUserModule,NbTooltipModule, NbTabsetModule, NbSelectModule} from '@nebular/theme';
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
import { ManageGrnComponent } from './manage-grn/manage-grn.component';
import { GrnListComponent } from './grn-list/grn-list.component';

import { NgxPermissionsModule } from 'ngx-permissions';
import { PurchaseInvoicePageComponent } from './purchase-invoice-page/purchase-invoice-page.component';
import { AmountToWordPipe } from './amount-to-word.pipe';
import { PrInvoiceComponent } from './pr-invoice/pr-invoice.component';
import { AgGridModule } from 'ag-grid-angular';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { VendorPaymentComponent } from './vendor-payment/vendor-payment.component';
import { VendorPaymentListComponent } from './vendor-payment-list/vendor-payment-list.component';
import { VendorPageComponent } from './vendor-page/vendor-page.component';

const routes: Routes = [
   { path: 'ManageVendor' , component: ManageVendorComponent,canActivate:[AuthGuard]},
   { path: 'ManageVendortMaster' , component: VendorListComponent,canActivate:[AuthGuard]},
   { path: 'PurchaseRequisition' , component: PurchaseRequisitionComponent,canActivate:[AuthGuard]},
   { path: 'PurchaseRequisitionList' , component: PurchaseRequisitionListComponent,canActivate:[AuthGuard]},
   { path: 'PurchaseOrder' , component: PurchaseOrderComponent,canActivate:[AuthGuard]},
   { path: 'PurchaseOrderList' , component: PurchaseOrderListComponent,canActivate:[AuthGuard]},
   { path: 'ManageGrn', component:ManageGrnComponent, canActivate:[AuthGuard]},
   { path: 'GrnList', component:GrnListComponent, canActivate:[AuthGuard]},
   { path: 'PurchaseInvoicePage', component:PurchaseInvoicePageComponent, canActivate:[AuthGuard]},
   { path: 'PrInvoice' , component:PrInvoiceComponent, canActivate:[AuthGuard]},
   { path: 'VendorPayment' , component:VendorPaymentComponent, canActivate:[AuthGuard]},
   { path: 'VendorPaymentList' , component:VendorPaymentListComponent, canActivate:[AuthGuard]},
   { path: 'VendorPage' , component:VendorPageComponent, canActivate:[AuthGuard]},
];

@NgModule({
  declarations: [ManageVendorComponent,VendorListComponent, PurchaseRequisitionComponent, PurchaseRequisitionListComponent, ManageGrnComponent, PurchaseOrderComponent, PurchaseOrderListComponent, GrnListComponent, PurchaseInvoicePageComponent,AmountToWordPipe, PrInvoiceComponent, DatepickerComponent, VendorPaymentComponent, VendorPaymentListComponent, VendorPageComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
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
    NgxPermissionsModule.forRoot(),
    NbTooltipModule,
    AgGridModule.withComponents([])
  ]
})
export class PurchaseModule { }
