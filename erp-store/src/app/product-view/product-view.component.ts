import { SharedService } from './../shared/shared.service';
import { ProductviewService } from './productview.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss']
})
export class ProductViewComponent implements OnInit {

  productcode:any;
  Product: any;
  BaseUrl=environment.BASE_SERVICE_URL+'/';
  CartForm: FormGroup;
  productAttribute: any;

  constructor(private activatedRoute:ActivatedRoute, private Service:ProductviewService,private sharedService:SharedService) {
    this.activatedRoute.params.subscribe(paramsId => {
      this.productcode = paramsId.id;
  });
  this.GetProduct();
  }

  ngOnInit(): void {
  }


  GetProduct()
  {
    let data =
    {
      product_code:this.productcode
    }
    this.Service.GetProduct(data).subscribe((Product)=>
    {
      console.log(Product);
      this.Product = Product[0];
      this.productAttribute = JSON.parse(this.Product.product_attributes);
     // console.log(this.productAttribute);
    }
    );
  }


  AddToCart(form:NgForm,product:any)
  {
    if(form.valid)
    {

      let user_id = sessionStorage.getItem("user_id");
      let price = product.price.filter(t=>t.id ===form.controls['packingType'].value)[0].sell_price;
      let Cart=
      {
        product_id:product.id,
        user_id:user_id,
        qty:form.controls['Quantity'].value,
        pack_unit_id:form.controls['packingType'].value,
        unit_price:price
      }
      this.Service.AddToCart(Cart).subscribe((data)=>
      {
        this.sharedService.changeMessage(data.length.toString());
        console.log(data);
      });
    }
  }

}
