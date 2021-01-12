import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CartItem } from '../models/cart-item';
import { Product } from '../models/product';

const apiUrl=environment.BASE_SERVICE_URL+'/ecom/api/v1/get_cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  sharedCart: [];

  constructor(private http:HttpClient) { }

  getcartItem():Observable< CartItem[]>{
    //TODO: Mapping the obtained result to our CartItem props.(pipe and map)
    return this.http.get<CartItem[]>(`${environment.BASE_SERVICE_URL}/ecom/api/v1/get_cart`)
  }

  addProductToCart(product:Product):Observable<any>{
    return this.http.post(`${environment.BASE_SERVICE_URL}/ecom/api/v1/add_cart`, {product});
  }

  removeFromCart(data){
    return this.http.post(`${environment.BASE_SERVICE_URL}/ecom/api/v1/delete_cart`, data);
  }

  getItem(id:string): number{
    const cartCount = this.http.get('cartItem') ;
    return cartCount[id]?.qty;
  }

  addToCart(cartItem): Observable<any> {
    return this.http.post(`${environment.BASE_SERVICE_URL}/ecom/api/v1/add_cart`, cartItem)

  }
}
