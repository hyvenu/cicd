import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { AdminService } from 'src/app/admin/admin.service';
import * as moment from 'moment';
import { tr } from 'date-fns/locale';

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
  customer_data: any;
  dailog_ref: any;
  selected_customer: any;
  customer_id: any;
  appointment_id: any;
  submitted: boolean = false;
  passed_flag:boolean = false;



  constructor(
    private formBuilder: FormBuilder,
    private nbtoastService: NbToastrService,
    private dialogService: NbDialogService,
    private routes: Router,
    private route: ActivatedRoute,
    private adminService:AdminService,
    ) { }

    keyPress(event: any) {
      const pattern = /[0-9\+\-\ ]/;
      let inputChar = String.fromCharCode(event.charCode);
      if (event.keyCode != 8 && !pattern.test(inputChar)) {
        event.preventDefault();
      }
    }

  ngOnInit(): void {

    this.bookingForm  =  this.formBuilder.group({   
      customerNameFormControl: ['', [Validators.required]],
      phoneNumberFormControl: ['', [Validators.required,Validators.pattern('^[0-9]{10}$')]],
      startTimeFormControl: ['', [Validators.required]],
      bookingDateFormControl: ['', [Validators.required]],
      endTimeFormControl: ['', [Validators.required]],
      serviceFormControl:['',[Validators.required]]
    })

    let param = this.route.snapshot.queryParams['id'];

    if(param){
      this.adminService.getAppointmentDetails(param).subscribe(
        (data) =>{
          
          this.appointment_id=data.id
          
          
          this.bookingForm.controls['customerNameFormControl'].setValue(data.customer_name);
          this.bookingForm.controls['phoneNumberFormControl'].setValue(data.phone_number);
          
         
    });
  }
    
    this.adminService.getServiceList().subscribe(
      (data) =>{
        this.service_list = data;
      },
      (error) =>{
        this.nbtoastService.danger("unable to get service list");
      }
    )

    this.adminService.getCustomerList().subscribe(
      (data) =>{
        this.customer_data = data;
      } 
    )
  }

  saveBooking():void {
    let form_data = new FormData();

    form_data.append('store',sessionStorage.getItem('store_id'));
    form_data.append('customer',this.customer_id)
    form_data.append('customer_name', this.bookingForm.controls['customerNameFormControl'].value);
    form_data.append('phone_number', this.bookingForm.controls['phoneNumberFormControl'].value);
    form_data.append('service', this.bookingForm.controls['serviceFormControl'].value);
    form_data.append('start_time', this.bookingForm.controls['startTimeFormControl'].value);
    form_data.append('end_time', this.bookingForm.controls['endTimeFormControl'].value);
    form_data.append('booking_date', moment(this.bookingForm.controls['bookingDateFormControl'].value).format("YYYY-MM-DD"));
    form_data.append('is_paid',new Boolean(this.passed_flag).toString())

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
           window.location.reload();
        },  
        (error) => {
            this.nbtoastService.danger("Failed to update");
        }
      )
    }
  }

  open_category_list(dialog: TemplateRef<any>) {
    this.dailog_ref= this.dialogService.open(dialog, { context: this.customer_data })
    .onClose.subscribe(data => {
       this.selected_customer = data     
       this.customer_id  = data.id
       this.bookingForm.controls['customerNameFormControl'].setValue(data.customer_name);
       this.bookingForm.controls['phoneNumberFormControl'].setValue(data.phone_number);
       
       
    }
    );
  }

  get f() { return this.bookingForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.bookingForm.invalid) {
            return;
        }
        if (!this.bookingForm.invalid){
          return this.submitted = false;
        }

        
      
    }


}


