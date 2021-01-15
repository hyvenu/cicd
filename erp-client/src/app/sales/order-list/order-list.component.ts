import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { InventoryService } from 'src/app/inventory/inventory.service';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {

  settings = {
    // selectMode: 'multi',
    actions: {
      add: false,
      edit: false,
      delete: false,      
      },
    columns: {
      id: {
        title: 'id',
        hide:true
      },
      product_code: {
        title: 'Order Number',        
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          return `<a href="OrderView?id=${row.id}">${row.order_number}</a>`;
        }
      },
      order_raised_date:{
        title:'Order Raised Date'
      },
      order_status_text: {
        title:'Order Status'
      },
      customer__first_name: {
        title:'Customer Name'
      },
      customer__email: {
        title:'Customer Email'
      },
      order_amount: {
        title:'Order Amount'
      },
      tax_amount: {
        title:'Tax Amount'
      }    
       
      
    },
  };

  data:[];

  constructor(
    private formBuilder: FormBuilder,
    private orderService: OrderService,
    private nbtoastService: NbToastrService,
    private dialogService: NbDialogService,
    private routes: Router
  ) { }

  ngOnInit(): void {
    const order_data  = { 'order_status': '1'}
    this.orderService.getOrderList(order_data).subscribe(
      (data) => {
          this.data = data;
      },
      (error) => {
          this.nbtoastService.danger(error.error.detail);
      }
    )
  }
  

}
