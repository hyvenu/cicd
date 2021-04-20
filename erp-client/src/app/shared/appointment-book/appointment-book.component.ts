import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { AdminService } from 'src/app/admin/admin.service';
import * as moment from 'moment';

@Component({
  selector: 'app-appointment-book',
  templateUrl: './appointment-book.component.html',
  styleUrls: ['./appointment-book.component.scss']
})
export class AppointmentBookComponent implements OnInit {

  bookingForm: FormGroup;

  selected_service: [];

  service_list:any;

  booking_id: any;



  constructor(
    private formBuilder: FormBuilder,
    private nbtoastService: NbToastrService,
    private dialogService: NbDialogService,
    private routes: Router,
    private route: ActivatedRoute,
    private adminService:AdminService,
    ) { }

  ngOnInit(): void {

    this.bookingForm  =  this.formBuilder.group({   
      customerNameFormControl: ['', [Validators.required]],
      phoneNumberFormControl: ['', [Validators.required]],
      startTimeFormControl: ['', [Validators.required]],
      bookingDateFormControl: ['', [Validators.required]],
      endTimeFormControl: ['', [Validators.required]],
      serviceFormControl:['',[Validators.required]]
    })
    
    this.adminService.getServiceList().subscribe(
      (data) =>{
        this.service_list = data;
      },
      (error) =>{
        this.nbtoastService.danger("unable to get service list");
      }
    )
  }

  saveBooking():void {
    let form_data = new FormData();

    form_data.append('store',sessionStorage.getItem('store_id'));
    form_data.append('customer_name', this.bookingForm.controls['customerNameFormControl'].value);
    form_data.append('phone_number', this.bookingForm.controls['phoneNumberFormControl'].value);
    form_data.append('service', this.bookingForm.controls['serviceFormControl'].value);
    form_data.append('start_time', this.bookingForm.controls['startTimeFormControl'].value);
    form_data.append('end_time', this.bookingForm.controls['endTimeFormControl'].value);
    form_data.append('booking_date', moment(this.bookingForm.controls['bookingDateFormControl'].value).format("YYYY-MM-DD"));

    if (this.booking_id) {
        this.adminService.updateBooking(this.booking_id,form_data).subscribe(
          (data) => {
             this.nbtoastService.success("Booking information updated")
             this.bookingForm.reset();
             this.booking_id=null;
          },  
          (error) => {
              this.nbtoastService.danger("Failed to update");
          }
        )
    }else {
      this.adminService.saveBooking(form_data).subscribe(
        (data) => {
           this.nbtoastService.success("Booking information saved")
           this.bookingForm.reset();
           this.booking_id=null;
        },  
        (error) => {
            this.nbtoastService.danger("Failed to update");
        }
      )
    }
  }

}


