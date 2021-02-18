import { Router } from '@angular/router';
import { CheckoutService } from './checkout.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-check-out-products',
  templateUrl: './check-out-products.component.html',
  styleUrls: ['./check-out-products.component.scss']
})
export class CheckOutProductsComponent implements OnInit {
  CarttList: any;
  Total = 0;
  NewAddress :boolean;
  AddressList: any;
  CartTotalItems =0;
  SelectedAddress: any;
  promo_code:any;
  discount_amt: any;
  Final_Total: any;
  promo_code_error: boolean;

  constructor(private Service:CheckoutService,private route:Router) { }

  ngOnInit(): void {
    this.NewAddress = false;
    this.GetCartDetails();
    this.GetAddress();
  }


  GetCartDetails()
  {

    this.Service.GetCartDetails().subscribe((CartList)=>
    {
      this.CarttList =CartList;
      this.CartTotalItems = CartList.length;
      for(let i=0;i<CartList.length;i++)
      {
        this.Total += Number(CartList[i].sub_total);
        this.Final_Total = this.Total;
      }
    }
    );
    
  }

  GetAddress()
  {

    this.Service.GetAddress().subscribe((AddressList)=>
    {
      this.AddressList = AddressList;
      console.log(AddressList);
    }
    );
  }


  ShowAddress()
  {
    if(this.NewAddress)
    {
      this.NewAddress = false;
    }
    else{
      this.NewAddress = true;
    }
  }

  AddressSelected(address)
  {
    this.SelectedAddress = address;
  }

  AddNewAddress(form:NgForm)
  {
    if(form.valid)
    {
    let data = {
        customer:sessionStorage.getItem('user_id'),
        address_line1:form.controls['address'].value,
        address_line2:form.controls['address2'].value,
        phone_number :form.controls['mobile'].value,
        city:form.controls['City'].value,
        state:form.controls['State'].value,
        pin_code:form.controls['zip'].value
       }

       console.log(data);
       this.Service.AddAddress(data).subscribe((AddressList)=>
    {
      this.NewAddress = false;
      this.GetAddress();
    }
    );
    }
  }

  CheckOut(form:NgForm)
  {
    let data = {
      shipping_address:this.SelectedAddress.id,
      billing_address:this.SelectedAddress.id,
      order_status:1,
      payment_method:form.controls["paymentMethod"].value,
      delivery_method:form.controls["DeliveryMethod"].value,
      promo_code: this.promo_code,
     }

     this.Service.CheckOut(data).subscribe((res)=>
      {
        if (data.payment_method == 1) {
          this.route.navigateByUrl('OrderSummary?error=false&order_number='+res.order_number);
        }else{
          this.route.navigateByUrl('payment?order_id='+res.payment_order_id + '&amount='+res.amount + '&order_number='+res.order_number);
        }
        

      });
   }

   verify_code():any {
     let data = { promo_code:this.promo_code,order_amount:this.Total  }
     console.log(data);
      this.Service.verify_cupan_code(data).subscribe(
        (res) => {
            console.log(res);
            this.Final_Total = res.order_amount;
            this.discount_amt = res.dis_amount;
            this.promo_code_error = false;
        },
        (error) => {
            this.promo_code = null;
            this.promo_code_error = true;
            this.discount_amt =0;
        }
      )
   }


}
