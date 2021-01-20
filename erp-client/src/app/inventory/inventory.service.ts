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

  public removeFromCategory(data){
    return this.http.delete<any>(`${environment.BASE_SERVICE_URL}/manage_inventory/api/v1/ProductCategory/`, data)
  }

  public updateCategory(id,data) {
    return this.http.put<any>(`${environment.BASE_SERVICE_URL}/manage_inventory/api/v1/ProductCategory/` + id + '/', data)
  }

  public getSubCategoryList(){
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_inventory/api/v1/ProductSubCategory/`, {})
  }

  public saveSubCategory(data) {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_inventory/api/v1/ProductSubCategory/`, data)
  }

  public updateSubCategory(id,data) {
    return this.http.put<any>(`${environment.BASE_SERVICE_URL}/manage_inventory/api/v1/ProductSubCategory/` + id + '/', data)
  }

  public getUnitMasterList(){
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_inventory/api/v1/UnitMaster/`, {})
  }

  public saveUnit(data) {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_inventory/api/v1/UnitMaster/`, data)
  }

  public updateUnit(id,data) {
    return this.http.put<any>(`${environment.BASE_SERVICE_URL}/manage_inventory/api/v1/UnitMaster/` + id + '/', data)
  }

  public getBrandMasterList(){
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_inventory/api/v1/ProductBrandMaster/`, {})
  }
  public saveBrand(data) {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_inventory/api/v1/ProductBrandMaster/`, data)
  }
  public updateBrand(id,data) {
    return this.http.put<any>(`${environment.BASE_SERVICE_URL}/manage_inventory/api/v1/ProductBrandMaster/` + id + '/', data)
  }
  public getProductCode(data) {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_inventory/api/v1/get_product_code`, data)
  }
  public saveProduct(data) {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_inventory/api/v1/ProductMaster/`, data)
  }

  public getProductList() {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_inventory/api/v1/ProductMaster/`)
  }
  public getProduct(id) {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_inventory/api/v1/ProductMaster/` + id + '/')
  }
  public uploadImages(data) {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_inventory/api/v1/ProductImage/`, data)
  }
  public getImages(product_id) {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_inventory/api/v1/ProductImage/?product_id=${product_id}`)
  }

}
