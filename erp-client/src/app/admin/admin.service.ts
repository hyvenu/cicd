import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private router: Router,    
    private http: HttpClient
  ) {
  }

  public saveStore(data){
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/Store/`, data)
  }
  public getStore(data){
    if(data == ""){
      return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/Store/`)
    }else{
      return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/Store/${data}/`)
    }
  }
  public updateStore(id, data){
    return this.http.put<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/Store/${id}/`, data)
  }
  public getStoreShipLocations(data){
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/StoreShip?store_id=${data}`)
  }
  public saveStoreShipLocations(data){
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/StoreShip/`, data)
  }
  public updateStoreShipLocations(id,data){
    return this.http.put<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/StoreShip/${id}`, data)
  }
  public deleteStoreShipLocations(id){
    return this.http.delete<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/StoreShip/${id}`)
  }
}
