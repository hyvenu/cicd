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
import { SalesOrderComponent } from './sales-order/sales-order.component';
import { MainPipe } from '../pipe.module';

const routes: Routes = [
  { path: 'OrderList' , component: OrderListComponent,canActivate:[AuthGuard]},
  { path: 'OrderView' , component: OrderViewComponent,canActivate:[AuthGuard]},
  { path: 'SalesOrder' , component: SalesOrderComponent,canActivate:[AuthGuard]},
]

@NgModule({
  declarations: [OrderListComponent, OrderViewComponent, SalesOrderComponent],
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
  ],
  providers:[NbToastrService, NbDialogService],
})

export class SalesModule { }
