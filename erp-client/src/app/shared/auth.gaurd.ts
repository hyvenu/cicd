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
  //  return this.sharedservice.user.pipe(
  //   take(1),
  //   map(user =>{
  //    const isauth = !!user;
  //    if (isauth)
  //    {
  //      return true;
  //    }
  //    return this.router.createUrlTree(['/Login'])
  //  }));
     if (sessionStorage.getItem('user_id'))
     {
        if (sessionStorage.getItem('user_id') &&  sessionStorage.getItem('store_id'))
        {
          return true;
        }else{
          return this.router.createUrlTree(['/StoreSelect'])   
        }
     }else {
       return this.router.createUrlTree(['/Login'])
     }
     
  }

}
