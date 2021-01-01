import { map, take } from 'rxjs/operators';
import { SharedService } from './shared.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate{
  constructor(private sharedservice:SharedService,private router:Router)
  {

  }
  canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

    if(sessionStorage.getItem("accessToken")!="" && sessionStorage.getItem("accessToken")!=null)
    {
      return true;
    }
     return this.router.createUrlTree(['/Login'])

  }

}
