import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
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

  GetOrderPDF(data:any): any {
      let headers = new Headers();
     const url =`${environment.BASE_SERVICE_URL}/ecom/api/v1/get_invoice_pdf?order_number=`+data;
     return this.http.get(url,{ responseType: 'blob' }).pipe(map(
      (res) => {
          return new Blob([res], { type: 'application/pdf' })
          // res;
      }))
  }

  CancelRequest(data:any): any {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/ecom/api/v1/update_order_status`,data);
  }
}




























