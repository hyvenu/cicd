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

  public getDesignationList() {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/Designation/`)
  }


  public getDepartmentDetails(id) {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/Department/` + id + '/')
  }

  public getDesignationDetails(id) {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/Designation/` + id + '/')
  }

  public saveDepartment(data) {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/Department/`, data);
  }

  public saveDesignation(data) {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/Designation/`, data);
  }

  public updateDepartment(data,id){
    return this.http.put<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/Department/`+ id + '/', data)
  }

  public updateDesignation(data,id){
    return this.http.put<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/Designation/`+ id + '/', data)
  }

  public getAppSettings() {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/AppSettings/`)
  }
  public getReports() {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/ReportModule/`)
  }

  public getDashboardbookingDetails(){
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_dashboard/api/v1/get_dashboard_booking_details`, {})
  }
  public getDashboardSalesDetails(){
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_dashboard/api/v1/get_dashboard_sales_details`, {})
  }

  public getDashboardSalesList() {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_dashboard/api/v1/get_monthly_sales_list`)
  }
  public getDashboardPurchaseList() {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_dashboard/api/v1/get_monthly_purchase_list`)
  }
  public getDashboardDailyStatusList() {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_dashboard/api/v1/get_daily_status`)
  }

  public getReportsNew() {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_reportengine/api/v1/ReportEngineMain/`)
  }

  public getReportbyIDAndType(id, from_date, to_date) {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_reportengine/api/v1/get_report?id=${id}&from_date=${from_date}&to_date=${to_date}`)
  }

  public saveplan(data) {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/subscriptionplan/`, data);
  }

  public getplans() {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/subscriptionplan/`);
  }
  public updateplan(data,id) {
    return this.http.put<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/subscriptionplan/`+ id + '/', data);
  }
  public getplanDetails_by_id(id) {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/subscriptionplan/` + id + '/')
  }

}
