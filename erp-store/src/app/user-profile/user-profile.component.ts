import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  constructor(private route:Router) { }

  ngOnInit(): void {
  }

  Goto(data:any)
  {
    this.route.navigate(["/"+data])
  }

}
