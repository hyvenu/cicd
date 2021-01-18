import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private router: Router,    
    private http: HttpClient
  ) { }

  public getOrderList(data){
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_sales/api/v1/get_order_list`, data)
  }
  public getOrderDetail(order_id){
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_sales/api/v1/get_order_detail?id=${order_id}`, {})
  }
  public updateOrderStatus(order_id,order_status){
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_sales/api/v1/update_order_status?id=${order_id}&order_status=${order_status}`, {})
  }

}
