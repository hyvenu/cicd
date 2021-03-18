import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-order-view',
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.scss']
})
export class OrderViewComponent implements OnInit {
  orderFrom: FormGroup;
  order_data: any;
  order_id: any;
  
  constructor(
    private formBuilder: FormBuilder,
    private orderService: OrderService,
    private nbtoastService: NbToastrService,
    private dialogService: NbDialogService,
    private routes: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    let param1 = this.route.snapshot.queryParams["id"];   
    this.order_id = param1; 

    this.orderFrom = this.formBuilder.group(
      {
        orderNumberFormControl: [''],
        orderDateFormControl:[''],
        customerFormControl:[''],
        shipAddressFormControl:[''],
        billAddressFormControl:['']
      }
    )

    if (param1){
        this.orderService.getOrderDetail(param1).subscribe(
          (data) => {
              this.order_data = data[0];
              this.orderFrom.controls['orderNumberFormControl'].setValue(this.order_data['order_number']);
              this.orderFrom.controls['orderDateFormControl'].setValue(this.order_data['order_raised_date']);
              this.orderFrom.controls['customerFormControl'].setValue(this.order_data['customer__first_name']);
              let shipp_add = this.order_data['shipping_address']
              shipp_add = shipp_add['address_line1'] + ' ' + shipp_add['address_line2'] + ' ' +  shipp_add['state'] + ' ' + shipp_add['pin_code']
              this.orderFrom.controls['shipAddressFormControl'].setValue(shipp_add);
              let bill_add = this.order_data['billing_address']
              bill_add = bill_add['address_line1'] + ' ' + bill_add['address_line2'] + ' ' +  bill_add['state'] + ' ' + bill_add['pin_code']
              this.orderFrom.controls['billAddressFormControl'].setValue(bill_add);

          },
          (error) =>{
              this.nbtoastService.danger("Failed to load order information");
          }
        );
    }
  }

  updateOrderStatus(order_status): void{
    this.orderService.updateOrderStatus(this.order_id, order_status).subscribe(
      (data) => {
          this.nbtoastService.success("Order Status Changed")
          this.ngOnInit();
      },
      (error) => {
          this.nbtoastService.danger("Order Status Update Failed" + "ERROR MSG :" + error)
      }
    )
  }
  

}
