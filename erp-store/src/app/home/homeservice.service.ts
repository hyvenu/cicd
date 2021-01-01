import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeserviceService {

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  GetCategory(data): any {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/ecom/api/v1/get_category`);
  }

  GetSubcategories(): any {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/ecom/api/v1/get_sub_category`);
  }
}
