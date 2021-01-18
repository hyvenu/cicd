import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private http: HttpClient
  ) { }

  GetOrders(data:any): any {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/ecom/api/v1/get_order_list`,data);
  }


  GetOrderDetail(data:any): any {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/ecom/api/v1/get_order_detail?id=`+data);
  }
}
