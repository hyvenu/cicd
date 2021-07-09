import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../models/User';


@Injectable({
  providedIn: 'root'
})
export class SharedService {

  public userSubject: BehaviorSubject<any>;
  public user: Observable<any>;

  constructor(
    private router: Router,
    private cookie: CookieService,
    private http: HttpClient
  ) {
    this.userSubject = new BehaviorSubject<any>(null);
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  loginUser(userInfo): Observable<any> {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/authentication/api/token/`, userInfo)
      .pipe(map(user => {
      this.userSubject.next(user);
      this.cookie.set('isLoggedIn',"true");
      this.cookie.set('access_token',user.access);
        this.startRefreshTokenTimer();
        return user;
      }));
  }

  checkLogin(): any {
    if (this.cookie.get('isLoggedIn') && this.cookie.get('access_token')) {
      return true;
    } else {
      return false;
    }
  }

  logout() {
    this.stopRefreshTokenTimer();
    this.userSubject.next(null);
    this.router.navigate(['/Login']);
    this.cookie.deleteAll();
    sessionStorage.clear();
  }

  refreshToken(): any {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/authentication/api/token/refresh/`, {});
  }

  private refreshTokenTimeout;


  private startRefreshTokenTimer() {
    const timeout = (Date.now() + (10 * 60 * 1000)) - Date.now() - (60 * 1000);
    this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }

  public getStoreList() {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/StoreUser/?query=`, {})
  }

 
  public getUserPermissionList() {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/authentication/api/get_permissions`)
  }

  resetPassword(data:any)
  {
      return this.http.post<any>(`${environment.BASE_SERVICE_URL}/authentication/api/change_password`,data);

  }

  changePhoneNumber(data:any)
  {
      return this.http.post<any>(`${environment.BASE_SERVICE_URL}/authentication/api/change_phone_number`,data);

  }
  public getDepartmentList() {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/Department/`)    
  }


  public getDepartmentDetails(id) {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/Department/` + id + '/')
  }

  public saveDepartment(data) {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/Department/`, data);
  }

  public updateDepartment(data,id){
    return this.http.put<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/Department/`+ id + '/', data)
  }



}
