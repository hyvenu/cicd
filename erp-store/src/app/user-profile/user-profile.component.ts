import { UserServiceService } from './user-service.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastService } from '../shared/toast/toast.service';

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

  constructor(private route:Router, private Service:UserServiceService,private toastService:ToastService) {
    this.editPhone = false;
  }

  ngOnInit(): void {

    this.first_name = sessionStorage.getItem('first_name');
    this.email = sessionStorage.getItem('email');
    this.phone = sessionStorage.getItem('phone_number');
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
          this.toastService.show('Phone Changed Successfully', {
            classname: 'bg-success text-light',
            delay: 2000 ,
            autohide: true,
            headertext: 'Phone Changed Successfully'
          });
          this.phone = phone;
          sessionStorage.setItem('phone_number',phone);
        }
       else
       {
        this.toastService.show('Something went Wrong!!', {
          classname: 'bg-danger text-light',
          delay: 2000 ,
          autohide: true,
          headertext: 'Something went Wrong!!'
        });
       }
      });

    }
  }

}
