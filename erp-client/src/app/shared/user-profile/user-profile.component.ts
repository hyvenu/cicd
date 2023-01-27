import { SharedService } from 'src/app/shared/shared.service';

import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  first_name: string;
  email: string;
  phone: string;
  editPhone: boolean;

  constructor(private route:Router, private Service:SharedService ,private nbtoastService: NbToastrService,) {
    this.editPhone = false;
  }

  ngOnInit(): void {

    this.first_name = localStorage.getItem('first_name');
    this.email = localStorage.getItem('email');
    this.phone = localStorage.getItem('phone_number');
  }

  Goto(data:any)
  {
    this.route.navigate(["/"+data])
  }

  EditPhoneNumber()
  {
    this.editPhone = true;
  }

  CloseEdit()
  {
    this.editPhone = false;
  }

  ChangePassword(form: NgForm)
  {

    let phone  = form.controls['phone_number'].value;
    if(phone.toString().length == 10)
    {
      let data =
      {
        phone_number:phone
      };
      this.Service.changePhoneNumber(data).subscribe((data) => {
        this.CloseEdit();
        if(data == "Success")
        {
          this.nbtoastService.success("Phone changed successfully");
          this.phone = phone;
          localStorage.setItem('phone_number',phone);
        }
       else
       {
        this.nbtoastService.warning("Something went Wrong!!");
       }
      });

    }
  }

}
