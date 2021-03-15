import { SharedService } from 'src/app/shared/shared.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  verifyPassword: boolean;

  constructor(private service:SharedService,private route:Router) { }

  ngOnInit(): void {
  }

  resetPassword(form: NgForm)
  {
    if (sessionStorage.getItem('user_id')) {
      if (form.valid) {
        let oldPassword = form.controls['oldpassword'].value;
        let password = form.controls['password'].value;
        let confirmPassword = form.controls['confirmpassword'].value;
        if(password == confirmPassword)
        {
          this.verifyPassword = false;
          let email = sessionStorage.getItem("email");
          let resetData = {
            username:email,
            old_password:oldPassword,
            new_password:password
          }
          this.service.resetPassword(resetData).subscribe((data)=>
          {
            //console.log(data);
            this.route.navigate(["profile"]);
          });
        }
        else
        {
          this.verifyPassword = true;
        }

      }
    }
  }

}
