import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../models/User';


@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private messageSource = new BehaviorSubject<string>('service');
count = this.messageSource.asObservable();

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
      sessionStorage.setItem("accessToken",user.access);
      sessionStorage.setItem("user_id",user.user_id);
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
    localStorage.clear();
  }

  refreshToken(): any {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/auth/api/token/refresh`, {});
  }

  private refreshTokenTimeout;


  private startRefreshTokenTimer() {
    const timeout = (Date.now() + (10 * 60 * 1000)) - Date.now() - (60 * 1000);
    this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }

  registerUser(registerInfo): Observable<any>{
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/authentication/api/user/`, registerInfo)
    // .pipe(map(registeruser =>{
    //   this.userSubject.next(registeruser)
    //   return registeruser;

    // }))
  };

    handleError(error){
      return throwError(error.message || "miss match")
     };

     changeMessage(message: string) {
      this.messageSource.next(message)
    }

}
