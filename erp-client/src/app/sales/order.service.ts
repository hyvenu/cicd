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

  public getOrderList(){
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_order/api/v1/get_order_list`, {})
  }
  public getOrderDetail(order_id){
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_order/api/v1/get_order_detail?id=${order_id}`, {})
  }

}
