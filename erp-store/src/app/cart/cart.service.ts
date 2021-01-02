import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CartItem } from '../models/cart-item';
import { Product } from '../models/product';

const apiUrl='http://127.0.0.1:8000/ecom/api/v1/get_cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http:HttpClient) { }

  getcartItem():Observable< CartItem[]>{
    //TODO: Mapping the obtained result to our CartItem props.(pipe and map)
    return this.http.get<CartItem[]>(apiUrl)    
  }

  addProductToCart(product:Product):Observable<any>{
    return this.http.post(apiUrl, {product});
  }

  removeFromCart(productId){
    return this.http.delete(apiUrl +'/'+productId);
  }

  getItem(id:string): number{
    const cartCount = this.http.get('cartItem') ;
    return cartCount[id]?.qty;
  }

  addCartitemToCart(cartItem : CartItem): Observable<any> {
    return this.http.post(apiUrl, {cartItem})

  }
}