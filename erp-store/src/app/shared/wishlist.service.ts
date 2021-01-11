import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

const api = "http://localhost:3000/wishlist";

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  constructor(private http:HttpClient) { }


  getWishlist(){
      return this.http.get(api).pipe(
        map((result:any[])=> {
          let productIds = []
          result.forEach(item => productIds.push(item.id))

          return productIds;
        })
      )

  }

  addToWishlist(productId){
    return this.http.post(api,{id:productId} )
  }

  removeFromWishlist(productId){
    return this.http.delete(api + '/' + productId)
  }
}
