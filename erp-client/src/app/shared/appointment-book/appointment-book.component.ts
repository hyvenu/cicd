import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { AdminService } from 'src/app/admin/admin.service';
import { DatePipe, Time } from '@angular/common';
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

  service_array:any;

  booking_id: any;
  customer_data: any;
  dailog_ref: any;
  selected_customer: any;
  customer_id: any;
  appointment_id: any;
  submitted: boolean = false;
  passed_flag:boolean = false;
  service=[];
  selectedService: any;
  service_list: any=[];
  calendar_data: [];
  start_date: any;
  end_date: any;
  start_time: any;
  end_time: string;
  date: string;
  assigned_staf=""
  app_id: any;
  serv: any;
  cus_id: any;
  assigned: any = "null"
  current_date :any = new Date();
  searchCategory:any;
  dateofdata: Date;
  searchService: string;
  selected_product_list: any = [];
  @ViewChild('date')
  myInputVariable: ElementRef;
  service_id: any;
  stylist_list: any=[];
  searchStylist: string;
  stylist_id: any='';


  constructor(
    private formBuilder: FormBuilder,
    private nbtoastService: NbToastrService,
    private dialogService: NbDialogService,
    private routes: Router,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private adminService:AdminService,

    ) { this.current_date = new Date() }

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
      phoneNumberFormControl: ['', [Validators.required]],
      //startTimeFormControl: ['', [Validators.required]],
      bookingDateFormControl: ['', [Validators.required]],
      //endTimeFormControl: ['', [Validators.required]],
      // serviceFormControl:['',[Validators.required]]
    })

    // this.dateCheck()
     /*this.start_date = this.route.snapshot.queryParams['start']
     this.end_date = this.route.snapshot.queryParams['end']
     console.log((this.start_date))
     console.log(this.end_date)
     if(this.start_date && this.end_date ){
      this.assigned = this.route.snapshot.queryParams['assign']
      console.log(this.assigned)
     this.start_time=this.start_date.substr(16,5)
     console.log((this.start_time))
     this.end_time = this.end_date.substr(16,5)

     this.date = new Date(this.start_date).toISOString().substr(0,10)

     console.log(this.end_date.substr(16,5))
     this.bookingForm.controls['endTimeFormControl'].setValue(this.end_time);
     this.bookingForm.controls['startTimeFormControl'].setValue(this.start_time);
     this.bookingForm.controls['bookingDateFormControl'].setValue(moment(this.date));
     }
    */
    // this.service_array = this.bookingForm.controls['serviceFormControl'].value;
     this.app_id = this.route.snapshot.queryParams['id'];
    console.log("booking id"+this.app_id)




    this.adminService.getCustomerList().subscribe(
      (data) =>{
        this.customer_data = data;
      }
    )

    this.adminService.getEmployeeList().subscribe(
      (data) => {
        this.stylist_list = data;
      },
      (error) => {
          this.nbtoastService.danger("Unable get appointment data");
      }
    )

    this.adminService.getServiceList().subscribe(
      (data) =>{
        this.service_list = data;
        console.log("srr" +this.service_list)

        if(this.app_id){

          //this.assigned = this.route.snapshot.queryParams['assign']

          console.log(this.assigned)
          this.edit_oppintment()

        }
      },
      (error) =>{
        this.nbtoastService.danger("unable to get service list");
      }
    )
    // this.onChange()

  }

  onChange(date){

    console.log(new Date(date))
    this.dateofdata = new Date(date)
    console.log(this.dateofdata)
    console.log(this.current_date)
    // if(moment(this.dateofdata).format("yyyy-MM-DD") < moment(this.current_date).format("yyyy-MM-DD") ){
    //   this.nbtoastService.danger("Date Of Request  Allows Only Present Or Future Date");
    //   this.myInputVariable.nativeElement.value = "";

    // }



}

  edit_oppintment(){
    this.adminService.getAppointmentDetailsById(this.app_id).subscribe(
      (data) =>{
        console.log(data)
        this.customer_id = this.route.snapshot.queryParams['customer_id']
        if(this.customer_id == undefined){
          this.customer_id = data.customer__id
        }
        console.log(this.cus_id)
        console.log(data)
        console.log(data.service_list)
        this.appointment_id=data.id
        //this.service_id = data.service_list[0].id
        console.log(this.service_id)
        this.bookingForm.controls['bookingDateFormControl'].setValue(moment(data.booking_date));
        if(this.assigned == undefined){
          this.assigned = data.service_list.assigned_staff__id
        }

        data.service_list.forEach(element => {
          console.log(element)
          this.selected_product_list.push({
            id:element.id,
            service_id:element.service__id,
            service_name: element.service__service_name,
            stylist_name: element.assigned_staff__employee_name,
            stylist_id: element.assigned_staff__id,
            start_time: element.start_time,
            end_time: element.end_time
          })
        });



        // let ser_id = this.adminService.getServiceList().subscribe(
        //   (serv) =>{
        //     console.log("service list"+data)
        //     this.serv = serv.find(item => item.id = data.service_list[0].service__id)
        //     console.log("service_list"+this.service_list)
        //   }
        // )
        //this.service = [data.service_list[0].service__id]
    //this.bookingForm.controls['startTimeFormControl'].setValue(data.start_time);
    //this.bookingForm.controls['endTimeFormControl'].setValue(data.end_time);
        // this.bookingForm.controls['serviceFormControl'].setValue(data.service__id);
        this.bookingForm.controls['customerNameFormControl'].setValue(data.customer__customer_name);
        this.bookingForm.controls['phoneNumberFormControl'].setValue(data.customer__phone_number);


  });
  }

  open(dialog: TemplateRef<any>) {
    this.dailog_ref = this.dialogService.open(dialog, { context: this.service_list })
      .onClose.subscribe(data => {
        this.searchService = ""
        //  this.product_list = data

        console.log(data)

        this.selected_product_list.push({

          //id: this.service_id,
          id: this.app_id,
          service_id: data.id,
          service_name: data.service_name,
          stylist_id: "",
          start_time: "",
          end_time: ""

        });

        // const duplicate:boolean = this.check_duplicate();

        // if(duplicate) {
        //   this.selected_product_list.pop();
        //   this.nbtoastService.danger("Duplicate service");
        //   return;
        // }

      });
    //  this.subcategoryFrom.controls['categoryNameFormControl'].setValue(data.category_name);

  }

  check_date_of_req():void{
    // let dateOfReq = this.bookingForm.get('bookingDateFormControl').value;
    // console.log("date from form",dateOfReq)
    // if(dateOfReq < this.current_date ){
    //   this.bookingForm.controls['bookingDateFormControl'].setValue('')
    //   this.nbtoastService.danger("Date Of Request  Allows Only Present Or Future Date");
    // }

  }

  remove_item(item): void{
    const index: number = this.selected_product_list.indexOf(item);
    if (index !== -1) {
        this.selected_product_list.splice(index, 1);
    }
  }

  check_duplicate() {
    let arr = this.selected_product_list.map(function(item){ return item.service_id });
    let isDuplicate = arr.some(function(item, idx){
    return arr.indexOf(item) != idx
    });
    return isDuplicate;

    }

    check_duplicate_stylist(service_name, stylist_name) {

      const isFound = this.selected_product_list.some(element => {
        if (element.service_name === service_name && element.stylist_name === stylist_name) {
          return true;
        }

        return false;
      });

      return isFound
      }

    check_invalid_time() {
      let arr = this.selected_product_list.map(function(item){ return item.service_id });
      let isDuplicate = arr.some(function(item, idx){
      return arr.indexOf(item) != idx
      });
      return isDuplicate;
      }
  // onChange(){
  //   this.bookingForm.controls['bookingDateFormControl'].valueChanges.subscribe(
  //     (data)=> {
  //       console.log(new Date(data))
  //       this.dateofdata = new Date(data)
  //       console.log(this.dateofdata)
  //       console.log(this.current_date)
  //       if(moment(this.dateofdata).format("yyyy-MM-DD") < moment(this.current_date).format("yyyy-MM-DD") ){
  //         this.nbtoastService.danger("Date Of Request  Allows Only Present Or Future Date");
  //       }

  //     })

  //   }

    dateCheckStart(time, item){
      item.start_time = time
    }

    dateCheckEnd(dialog, time, item){
      console.log("time:"+time)
      if(time == "") {return}
      if(item.start_time > time) {
        item.end_time = ""
        dialog.value = "";
        this.nbtoastService.danger("End time must be greater than start time", "Invalid Time");
        return;
      }else{
        item.end_time = time
      }
    }

    stylist_open(dialog: TemplateRef<any>, item) {
      this.dailog_ref = this.dialogService.open(dialog, { context: this.stylist_list })
      .onClose.subscribe(data => {
        console.log(data)
        this.searchStylist = ""
        //  this.product_list = data

        console.log(this.stylist_id);
        const duplicate:boolean  = this.check_duplicate_stylist(item.service_name, data.employee_name)

        if(duplicate) {
          //this.selected_product_list.pop();
          this.nbtoastService.danger("Service for this therapist exists");
          return;
        }else{
          item.stylist_name=data.employee_name
        item.stylist_id=data.id
        }

      })
    }







  saveBooking():void {
    if(this.selected_product_list.length == 0) {
      this.nbtoastService.danger("Add service to save this booking");
      return;
    }else{
      let valid = true;
      this.selected_product_list.forEach(element => {
          if(element.stylist_id == "") {
            this.nbtoastService.danger("Stylist not selected for one or more services");
            valid = false;
            return;
          }
          if(element.start_time == "") {
            this.nbtoastService.danger("Start Time not selected for one or more services");
            valid = false;
            return;
          }
          if(element.end_time == "") {
            this.nbtoastService.danger("End Time not selected for one or more services");
            valid = false;
            return;
          }
      });

      if(!valid) {
        return
      }
    }

    if(this.bookingForm.valid){
    let form_data = new FormData();
    if(this.app_id){
      // let service_id = this.bookingForm.controls['serviceFormControl'].value.split(',')
      form_data.append('id', this.app_id);
      //form_data.append('assigned_staff', this.assigned);
      // form_data.append('service',service_id);
      // form_data.append('customer',this.cus_id)
    }

    form_data.append('store',sessionStorage.getItem('store_id'));
    form_data.append('customer',this.customer_id)
    form_data.append('services',JSON.stringify(this.selected_product_list));
    form_data.append('booking_date', moment(this.bookingForm.controls['bookingDateFormControl'].value).format("YYYY-MM-DD"));
    form_data.append('is_paid',new Boolean(this.passed_flag).toString())

    if (this.booking_id) {
      //update
        this.adminService.updateBooking(form_data).subscribe(
          (data) => {
            console.log(data)
             this.nbtoastService.success("Booking information updated")
            this.routes.navigate(["/ViewBooking"]);

             this.booking_id=null;
             this.selected_service = null;

          },
          (error) => {
              this.nbtoastService.danger("Failed to update");
          }
        )
    }else {
      //new insert
      this.adminService.saveBooking(form_data).subscribe(
        (data) => {
          console.log(data)
          if(this.app_id){
            this.nbtoastService.success("Booking information Updated")
          }else{
            this.nbtoastService.success("Booking information Saved")
          }

           this.routes.navigate(["/ViewBooking"]);

           this.booking_id=null;
           this.service = [];
        },
        (error) => {
            this.nbtoastService.danger("Failed to update");
        }
      )
    }
  }
  }

  open_customer_list(dialog: TemplateRef<any>) {
    this.dailog_ref= this.dialogService.open(dialog, { context: this.customer_data })
    .onClose.subscribe(data => {
      this.searchCategory=""
       this.selected_customer = data
       this.customer_id  = data.id
       this.bookingForm.controls['customerNameFormControl'].setValue(data.customer_name);
       this.bookingForm.controls['phoneNumberFormControl'].setValue(data.phone_number);


    }
    );
  }

  open_phone_list(dialog: TemplateRef<any>) {
    this.dailog_ref= this.dialogService.open(dialog, { context: this.customer_data })
    .onClose.subscribe(data => {
      console.log(data)
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


