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

  constructor(private sharedservice:SharedService) { }

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

}
