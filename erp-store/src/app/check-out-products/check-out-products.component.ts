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
     }

     this.Service.CheckOut(data).subscribe((data:any)=>
  {
    this.route.navigate(['thankyou/'+data]);

  });
}


}
