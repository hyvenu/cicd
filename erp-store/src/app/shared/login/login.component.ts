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
        password:this.LoginForm.controls['password'].value
      };
      console.log(user);
      this.Service.loginUser(user).subscribe((data)=>
      {
        console.log(data);
        
       sessionStorage.setItem("accessToken",data.access);
       sessionStorage.setItem("first_name",data.first_name);
       sessionStorage.setItem("email",user.email);
       sessionStorage.setItem("phone_number",data.phone_number);

       this.router.navigate(["/Home"]);
      },(error)=>
      {
        console.log(error);
        this.Invalid = true;
      });

    }



  }



}
