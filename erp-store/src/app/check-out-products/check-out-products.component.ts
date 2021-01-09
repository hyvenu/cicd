import { CheckoutService } from './checkout.service';
import { Component, OnInit } from '@angular/core';

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

  constructor(private Service:CheckoutService) { }

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



}
