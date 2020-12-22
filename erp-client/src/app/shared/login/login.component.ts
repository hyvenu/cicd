import { Router } from '@angular/router';
import { SharedService } from './../shared.service';
import { User } from '../../models/User';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  LoginForm:FormGroup;
  Invalid=false;

  constructor(private Service:SharedService,private router:Router) { }

  ngOnInit(): void {
    this.LoginForm = new FormGroup(
      {
        'username' :new FormControl(null,Validators.required),
        'password' : new FormControl(null,Validators.required)
      }
    );
  }

  onSubmit()
  {
    if(this.LoginForm.valid)
    {
      const user:User=
      {
        email:this.LoginForm.controls['username'].value,
        password:this.LoginForm.controls['password'].value,
        first_name:''
      };

      this.Service.loginUser(user).subscribe((data)=>
      {
       localStorage.setItem("accessToken",data.access);
       localStorage.setItem("user_id",data.user_id);
       localStorage.setItem("first_name",data.first_name);
       this.router.navigate(["/StoreSelect"]);
      },(error)=>
      {
        this.Invalid = true;
      });

    }



  }



}
