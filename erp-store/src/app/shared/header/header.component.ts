import { Router } from '@angular/router';
import { SharedService } from './../shared.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isAuthenticated = false;
  userSub:Subscription;

  constructor(private sharedservice:SharedService,private route:Router) { }

  ngOnInit(): void {


      // this.userSub =  this.sharedservice.userSubject.subscribe(user=>
      //   {

      //     this.isAuthenticated = !!user;
      //   });
      if(sessionStorage.getItem("user_id")){
        this.isAuthenticated = true;
      }
    // else
    // {
    //   this.userSub =  this.sharedservice.userSubject.subscribe(user=>
    //     {

    //       this.isAuthenticated = this.sharedservice.checkLogin();
    //     });
    // }
  }

  logout()
  {
    this.sharedservice.logout();
    sessionStorage.clear();
  }

  Search(data:any)
  {
    if(data.length>3)
    {
      this.route.navigate(["/category/"+data]);
    }
    else
    {
      this.route.navigate(['/']);
    }
  }

}
