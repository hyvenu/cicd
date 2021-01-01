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

  constructor(private Service:CheckoutService) { }

  ngOnInit(): void {
    this.GetCartDetails();
  }


  GetCartDetails()
  {

    this.Service.GetCartDetails().subscribe((CartList)=>
    {
      this.CarttList =CartList;
      for(let i=0;i<CartList.length;i++)
      {
        this.Total += Number(CartList[i].sub_total);
        console.log(CartList[i].sub_total);
      }
      console.log(this.Total);
    }
    );
  }

}
