import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  constructor(
    private router: Router,    
    private http: HttpClient
  ) {
  }


  public saveVendor(data) {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_vendor/api/v1/VendorMaster/`, data)
  }
  public getVendorList() {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_vendor/api/v1/VendorMaster/`)
  }

  public getVendor(id) {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_vendor/api/v1/VendorMaster/` + id + '/')
  }

  public getVendorCode(data) {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_vendor/api/v1/get_vendor_code`, data)
  }

  public savePR(data) {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_purchase/api/v1/save_pr`, data)
  }
  public approvePR(data) {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_purchase/api/v1/approve_pr`, data)
  }

  public rejectPR(data) {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_purchase/api/v1/reject_pr`, data)
  }

  public deleteProductFromPR(data) {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_purchase/api/v1/delete_prpl`, data)
  }
  
  public getPRList() {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_purchase/api/v1/get_pr_list`)
  }

  public getPRDetails(id) {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_purchase/api/v1/get_pr_details?id=${id}`)
  }
}
