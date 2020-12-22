import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(
    private router: Router,    
    private http: HttpClient
  ) {
  }

  public getCategoryList(){
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_inventory/api/v1/ProductCategory/`, {})
  }

  public saveCategory(data) {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_inventory/api/v1/ProductCategory/`, data)
  }
}
