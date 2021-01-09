import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }


  GetCartDetails(): any {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/ecom/api/v1/get_cart`);
  }

  GetAddress(): any {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/authentication/api/customer/address/`);
  }

}
