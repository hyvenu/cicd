import { ProductviewService } from './productview.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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

  constructor(private activatedRoute:ActivatedRoute, private Service:ProductviewService) {

    this.CartForm = new FormGroup(
      {
        'Quantity' :new FormControl(null,Validators.required),
        'packingType' : new FormControl(null,Validators.required)
      }
    );

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

    }
    );
  }


  AddToCart(product:any)
  {
    let user_id = sessionStorage.getItem("user_id");
    let Cart=
    {
      product_id:product.id,
      user_id:user_id,
      qty:1,
      sub_total:80
    }
    
    if(this.CartForm.valid)
    {
      console.log(Cart);
      this.Service.AddToCart(Cart).subscribe((data)=>
      {
        console.log(data);
      });
    }
  }


}
