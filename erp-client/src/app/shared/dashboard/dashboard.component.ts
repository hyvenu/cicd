import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { OrderService } from 'src/app/sales/order.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  orders_data: [];

  constructor(
    private orderService: OrderService,
    private nbtoastService: NbToastrService,
    private dialogService: NbDialogService,
    private routes: Router
  ) { }

  ngOnInit(): void {
    this.get_orders_data();
  }

  get_orders_data(){
    const order_data  = { 'store_id': sessionStorage.getItem('store_id')}
    this.orderService.getOrderList(order_data).subscribe(
      (data) => {
          if(data.length > 0){
          this.orders_data = data;
          }else{
            this.orders_data = []
          }
      },
      (error) => {
          this.nbtoastService.danger(error.error.detail);
      }
    )
  }
}
