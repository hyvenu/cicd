import { ProductlistService } from './productlist.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  BaseUrl = environment.BASE_SERVICE_URL+'/';
  ProductList:any[]=[];
  categoryName:any;
  CartForm:FormGroup;

  constructor(private route:Router, private Service:ProductlistService, private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {

    this.CartForm = new FormGroup(
      {
        'Quantity' :new FormControl(null,Validators.required),
        'packingType' : new FormControl(null,Validators.required)
      }
    );

    this.activatedRoute.params.subscribe(paramsId => {
      this.categoryName = paramsId.id;
  });
  this.GetCategories();
  }

  GotoProductview(data:any)
  {
    let routeTo = "productview/"+data;
    this.route.navigate([routeTo]);
  }

  GetCategories()
  {
    let data =
    {
      category_name:this.categoryName
    }
    this.Service.GetProducts(data).subscribe((Products)=>
    {
      console.log(Products);
      this.ProductList =Products;
    }
    );
  }


  AddToCart(form:NgForm,product:any)
  {
    console.log(form);
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
        console.log(data);
      });
    }
  }


}
