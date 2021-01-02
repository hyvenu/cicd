import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductlistService {

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  GetProducts(data:any): any {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/ecom/api/v1/get_products`,data);
  }

  AddToCart(data:any): any {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/ecom/api/v1/add_cart`,data);
  }

}
