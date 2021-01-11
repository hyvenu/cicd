import { ProductlistService } from './productlist.service';
import { WishlistService } from '../shared/wishlist.service'; 
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { from } from 'rxjs';
import { Product } from '../models';

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
  product : Product;
  addedToWishlist: boolean = false;
  wishlist:any[]=[]

  

  constructor(private route:Router, private Service:ProductlistService, private activatedRoute:ActivatedRoute,private wishlistservice:WishlistService ) { }

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
  this.loadWishlist();
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

  loadWishlist(){
    this.wishlistservice.getWishlist().subscribe(productIds =>{
      this.wishlist = productIds
    })
  }

  AddToCart(form:NgForm,product:any)
  {
    console.log(form);
    if(form.valid)
    {

      let user_id = sessionStorage.getItem("user_id");
      let price = product.price.filter(t=>t.id ===form.controls['packingType'].value)[0].sell_price;
      var Cart=
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

  AddToWishlist(Product){
    this.wishlistservice.addToWishlist(Product.id).subscribe(() =>{
      this.ngOnInit();
    })
  }

  RemoveFromWishlist(Product){
    this.wishlistservice.removeFromWishlist(Product.id).subscribe(() =>{
      this.ngOnInit();
    })
  }

  check_wishlist(product_id){
     let data = this.wishlist.filter(id => id == product_id)
     if (data.length){
       return true;
     }else{
       return false;
     }
     
  }


}
