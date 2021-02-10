import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductviewService {

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  GetProduct(data:any): any {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/ecom/api/v1/get_products`,data);
  }

  AddToCart(data:any): any {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/ecom/api/v1/add_cart`,data);
  }

  getRatings(id:any): any {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/ecom/api/v1/ProductRating/?product_id=`+id);
  }

  postRating(data:any): any {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/ecom/api/v1/ProductRating/`,data);
  }

  UpdateRating(data:any,id:any): any {
    return this.http.put<any>(`${environment.BASE_SERVICE_URL}/ecom/api/v1/ProductRating/`+id+"/",data);
  }

  GetAvgRating(id:any): any {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/ecom/api/v1/get_avg_rating?product_id=`+id);
  }

}
