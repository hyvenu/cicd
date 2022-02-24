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

  public get_product_by_slno(data) {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_inventory/api/v1/get_product_by_slno`, data)
  }

  public saveCategory(data) {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_inventory/api/v1/ProductCategory/`, data)
  }

  public removeFromCategory(id){
    return this.http.delete<any>(`${environment.BASE_SERVICE_URL}/manage_inventory/api/v1/delete_product_cat/`+id, {})
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
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_inventory/api/v1/get_product_list`)
  }

  public getProductDetails(id) {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_inventory/api/v1/get_product_details?id=${id}`)
  }
  public getAllProductsList() {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_inventory/api/v1/get_all_product_list`)
  }
  public getAllServiceList() {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_inventory/api/v1/get_all_service_list`)
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
  public deleteImage(data) {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_inventory/api/v1/delete_image`, data)
  }

}
