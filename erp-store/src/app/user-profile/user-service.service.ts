import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor(private http:HttpClient) { }

  resetPassword(data:any)
  {
      return this.http.post<any>(`${environment.BASE_SERVICE_URL}/authentication/api/change_password`,data);

  }

  changePhoneNumber(data:any)
  {
      return this.http.post<any>(`${environment.BASE_SERVICE_URL}/authentication/api/change_phone_number`,data);

  }
}
