import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderViewComponent } from './order-view/order-view.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/auth.gaurd';
import { NbThemeModule, NbLayoutModule,NbButtonModule ,NbCardModule,NbListModule,NbInputModule, NbToastrModule, NbDialogModule, NbDialogService, NbUserModule, NbTabsetModule, NbSelectModule, NbToastrService, NbDatepickerModule} from '@nebular/theme';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxPermissionsModule } from 'ngx-permissions';
import {NgxPrintModule} from 'ngx-print';
import { SalesOrderComponent } from './sales-order/sales-order.component';
import { MainPipe } from '../pipe.module';
import { SalesBillComponent } from './sales-bill/sales-bill.component';
import { InvoicePageComponent } from './invoice-page/invoice-page.component';
import { SalesDetailsComponent } from './sales-details/sales-details.component';
import { AmountToWordPipe } from './amount-to-word.pipe';
import { RefundComponent } from './refund/refund.component';
import { ExchangeComponent } from './exchange/exchange.component';

const routes: Routes = [
  { path: 'OrderList' , component: OrderListComponent,canActivate:[AuthGuard]},
  { path: 'OrderView' , component: OrderViewComponent,canActivate:[AuthGuard]},
  { path: 'SalesOrder' , component: SalesOrderComponent,canActivate:[AuthGuard]},
  { path: 'InvoicePage' , component:InvoicePageComponent ,canActivate:[AuthGuard]},
  { path: 'SalesDetails', component:SalesDetailsComponent, canActivate:[AuthGuard]},
  { path: 'Refund', component:RefundComponent, canActivate:[AuthGuard]},
  { path: 'Exchange', component:ExchangeComponent, canActivate:[AuthGuard]},
]

@NgModule({
  declarations: [OrderListComponent, OrderViewComponent, SalesOrderComponent, SalesBillComponent, InvoicePageComponent, SalesDetailsComponent,AmountToWordPipe, RefundComponent, ExchangeComponent],
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
    NgxPermissionsModule.forRoot(),
    NbDatepickerModule,
    NgxPrintModule,
  ],
  providers:[NbToastrService, NbDialogService],
})

export class SalesModule { }
