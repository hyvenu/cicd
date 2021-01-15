import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  constructor(
    private http: HttpClient
  ) { }

  GetWishlist(): any {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/ecom/api/v1/get_wish_list`);
  }
}
