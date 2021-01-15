import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  first_name: string;
  email: string;
  phone: string;

  constructor(private route:Router) { }

  ngOnInit(): void {

    this.first_name = sessionStorage.getItem('first_name');
    this.email = sessionStorage.getItem('email');
    this.phone = sessionStorage.getItem('phone_number');
  }

  Goto(data:any)
  {
    this.route.navigate(["/"+data])
  }

}
