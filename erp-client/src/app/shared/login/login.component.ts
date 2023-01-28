import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from './../shared.service';
import { User } from '../../models/User';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  LoginForm:FormGroup;
  Invalid=false;
  returnUrl: any;
  constructor(private Service:SharedService,
    private router:Router,
    private route: ActivatedRoute,
    private nbtoastService: NbToastrService,
   ) { }

  ngOnInit(): void {
    this.LoginForm = new FormGroup(
      {
        'username' :new FormControl(null,Validators.required),
        'password' : new FormControl(null,Validators.required)
      }
    );
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
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
        sessionStorage.setItem('user_id',data.user_id);
        sessionStorage.setItem("accessToken",data.access);
        sessionStorage.setItem("first_name",data.first_name);
        sessionStorage.setItem("email",user.email);
        sessionStorage.setItem("phone_number",data.phone_number);
      //  if( this.returnUrl){
      //     window.location.href= this.returnUrl;
      //  }else{
       this.router.navigate(["/StoreSelect"]);
      //  }
      },(error)=>
      {
        this.Invalid = true;
        console.log(error);
        this.nbtoastService.danger(error);

      });

    }else{
      this.nbtoastService.warning("Email and Password cannot be blank!");
    }



  }



}
