

import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../models/User';


@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  constructor(
    private router: Router,
    private cookie: CookieService,
    private http: HttpClient
  ) {
    this.userSubject = new BehaviorSubject<User>(null);
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  loginUser(userInfo): Observable<any> {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/authentication/api/token/`, userInfo)
      .pipe(map(user => {
        this.userSubject.next(user);
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

}
