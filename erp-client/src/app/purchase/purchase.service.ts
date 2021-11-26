import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { State } from '../models/state';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  state:State[] =[
    new State('Andaman and Nicobar Islands',35),
    new State('Andhra Pradesh',28),
    new State('Andhra Pradesh (New)',37),
    new State('Arunachal Pradesh',12 ),
    new State('Assam ',18),
    new State('Bihar',10 ),
    new State('Chandigarh',4),
    new State('Chattisgarh',22),
    new State('Dadra and Nagar Haveli ',26),
    new State('Daman and Diu',25),
    new State('Delhi',7),
    new State('Goa',30),
    new State('Gujarat',24),
    new State('Haryana',6),
    new State('Himachal Pradesh',2),
    new State('Jammu and Kashmir',1),
    new State('Jharkhand',20),
    new State('Karnataka',29),
    new State('Kerala',32),
    new State('Lakshadweep Islands',31),
    new State('Madhya Pradesh',23),
    new State('Maharashtra',27),
    new State('Manipur',14),
    new State('Meghalaya',17),
    new State('Mizoram',15),
    new State('Nagaland',13),
    new State('Odisha',21),
    new State('Pondicherry',34),
    new State('Punjab',3),
    new State('Rajasthan',8),
    new State('Sikkim',11),
    new State('Tamil Nadu',33),
    new State('Telangana',36),
    new State('Tripura',16),
    new State('Uttar Pradesh',9),
    new State('Uttarakhand',5),
    new State('West Bengal',19),
    
  
  ]


  constructor(
    private router: Router,    
    private http: HttpClient
  ) {
  }

  public getSate():State[]{
    return this.state
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
  public savePO(data) {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_purchase/api/v1/save_po`, data)
  }
  public getPOList() {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_purchase/api/v1/get_po_list`)
  }

  public getPODetails(id) {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_purchase/api/v1/get_po_details?id=${id}`)
  }

  public getPODetailsInvoice(id) {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_purchase/api/v1/get_po_details_invoice?id=${id}`)
  }

  public deleteProductFromPO(data) {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_purchase/api/v1/delete_po_product`, data)
  }
  public saveGRN(data) {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_purchase/api/v1/save_grn`, data)
  }

  public getGRNDetails(id) {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_purchase/api/v1/get_grn_details?id=${id}`)
  }

  public getGRNList() {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_purchase/api/v1/get_grn_list`)
  }
}