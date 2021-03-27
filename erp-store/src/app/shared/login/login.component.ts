import { Router } from '@angular/router';
import { SharedService } from './../shared.service';
import { User } from '../../models/User';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  error:any;
  LoginForm:FormGroup;
  Invalid=false;
  forgot_password_like = environment.BASE_SERVICE_URL + '/accounts/password_reset/';

  constructor(private Service:SharedService,
    private router:Router,
    private _snackBar: MatSnackBar) { }

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
       sessionStorage.setItem("user_id",data.user_id);
       sessionStorage.setItem("phone_number",data.phone_number);
       window.location.href="Home";
      // this.router.navigateByUrl('\Home');
      },(error)=>
      {
        console.log(error);
        this.Invalid = true;
        this.error = this.Service.handleError(error.message);
        this._snackBar.open(this.error,"OK", {
          duration: 1000,
        })
      });

    }



  }



}
