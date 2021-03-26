import { OrderService } from './order.service';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { ToastService } from '../shared/toast/toast.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  User_id:any;
  Orders: any;
  BaseUrl=environment.BASE_SERVICE_URL+'/';

  constructor(private Service:OrderService,private toastService: ToastService,private spinner: NgxSpinnerService,) {

   }

  ngOnInit(): void {
    this.GetOrders();
  }

GetOrders()
{
  let data={
    customer_id:sessionStorage.getItem("user_id")
  };
  this.Service.GetOrders(data).subscribe((orders)=>
   {
     this.Orders = orders;
     console.log(orders);
    });
}


GetOrderdetail(order:any)
{
  this.Service.GetOrderDetail(order.id).subscribe((response)=>
   {

     for(let i=0;i<this.Orders.length;i++)
     {
       if (this.Orders[i].id == order.id)
       {
         this.Orders[i].shipment_details = response[0].order_details;
         break;
       }
     }
     console.log(response);
    });
}

getimage(data:any)
{
  return data[0].image;
}

get_invoice(data_order_number):void {
  this.Service.GetOrderPDF(data_order_number).subscribe(
    (data) => {
      saveAs(data, data_order_number + '.pdf')
    }
  );
}

CancelRequest(id)
{
  this.spinner.show();
  id= id.split("-").join("");
  let data={
    id:id,
    order_status:'10'
  };
  this.Service.CancelRequest(data).subscribe((response)=>
   {
    this.spinner.hide();
     if(response == "Success")
     {
      this.toastService.show('Requested for Cancel', {
        classname: 'bg-danger text-light',
        delay: 2000,
        autohide: true,
        headertext: 'Successfull'
      });
     }
     else
     {
      this.toastService.show('Something went Wrong!!', {
        classname: 'bg-danger text-light',
        delay: 2000,
        autohide: true,
        headertext: 'Successfull'
      });
     }
    });
}

}
