import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { AdminService } from 'src/app/admin/admin.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-manage-customer',
  templateUrl: './manage-customer.component.html',
  styleUrls: ['./manage-customer.component.scss']
})
export class ManageCustomerComponent implements OnInit {

  allBookingData = [];
  custBookingData = [];

  allBookingSettings = {
    // selectMode: 'multi',
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    columns: {
      id: {
        title: 'id',
        hide:true
      },
      customer__customer_name: {
        title: 'Customer Name',
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          return `<a href="ManageCustomer?id=${row.customer__id}">${row.customer__customer_name}</a>`;
        }
      },
      customer__phone_number:{
        title: 'Phone Number',
      },
      booking_date:{
        title: 'Booking Date',
      },
      service_count: {
        title: 'Service Count',
      },

    },
  };

  custBookingSettings = {
    // selectMode: 'multi',
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    columns: {
      id: {
        title: 'id',
        hide:true
      },
      appointment__booking_date:{
        title: 'Booking Date',
      },
      service__service_name: {
        title: 'Service Name',
      },
      start_time: {
        title: 'Start Time',
      },
      end_time: {
        title: 'End Time',
      },

    },
  };

  activeCust:[];
  inactiveCust:[];


  custSettings = {
    // selectMode: 'multi',
    delete: {
      deleteButtonContent: '<span class="nb-trash">x</span>',
      confirmDelete: true,
    },
    actions: {
      add: false,
      edit: false,
      delete: true,
    },

    columns: {
      id: {
        title: 'id',
        hide:true
      },
      customer_code: {
        title: 'Customer Code',
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          return `<a href="ManageCustomer?id=${row.id}">${row.customer_code}</a>`;
        }
      },
      customer_name: {
        title: 'Customer Name',
      },
      phone_number:{
        title: 'Phone Number',
      },
      customer_email: {
        title: 'Customer Email',
      },


    },
  };


  createdFlag=false;
  advance:any=0;
  marked:boolean=true;


customerForm:FormGroup;
  Bills_list=[
    {name:"Print", value:"Print"},
    {name:"Emailed",value:"Emailed"},
    {name:"Sms", value:"Sms"},
  ]
  customer_id: any;
  isCustomer_id = false;
  bill: any;
  submitted=false;
  customerList: any;

  @ViewChild('form') form;
  constructor(
    private formBuilder: FormBuilder,
    private nbtoastService: NbToastrService,
    private dialogService: NbDialogService,
    private routes: Router,
    private route: ActivatedRoute,
    private adminService:AdminService
  ) { }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  ngOnInit(): void {

    this.custBookingData = []

    this.customerForm = this.formBuilder.group({
      customerCodeFormControl:['',[]],
      customerNameFormControl:['',[Validators.required]],
      phoneNumberFormControl:['',[Validators.required,Validators.pattern('^[0-9]{10}$')],],
      customerEmailFormControl:['',[Validators.email],],
      customerServiceBillFormControl:['',[Validators.required]],
      customerAddressFormControl:['',[]],
      advanceAmountFormControl:['',[]],
      gstFormControl: ['',[Validators.minLength(15),Validators.maxLength(15)]],
      customerActiveFormControl:['',],
      customerSourceFormControl:['',],

    })

    // this.customerForm.reset();

    let param = this.route.snapshot.queryParams['id'];

    if(param) {
      this.isCustomer_id = true;
      this.adminService.getCustomerDetails(param).subscribe(
        (data) => {

          this.customer_id=data.id
           console.log(this.customer_id)
          this.customerForm.controls['customerCodeFormControl'].setValue(data.customer_code);
          this.customerForm.controls['customerNameFormControl'].setValue(data.customer_name);
          this.customerForm.controls['phoneNumberFormControl'].setValue(data.phone_number);
          this.customerForm.controls['customerEmailFormControl'].setValue(data.customer_email);
          this.customerForm.controls['customerAddressFormControl'].setValue(data.customer_address);
          this.customerForm.controls['customerServiceBillFormControl'].setValue(data.customer_service_bill);
          this.customerForm.controls['advanceAmountFormControl'].setValue(data.advance_amount);
          this.customerForm.controls['gstFormControl'].setValue(data.gst);
          this.customerForm.controls['customerActiveFormControl'].setValue(data.active);
          this.customerForm.controls['customerSourceFormControl'].setValue(data.customer_source);
          this.adminService.getBookinHistory(param).subscribe(
            (data) => {
              let service_items = []
              data.forEach(element => {
                element.service_list.forEach(item => {
                  //this.custBookingData.push(item);
                  service_items.push(item)
                });
              });

              this.custBookingData = service_items


              console.log("Customer Booking Data",this.custBookingData)
            },
            (error) => {
              this.nbtoastService.danger("Unable to get customer booking history")
            }
          )


    });



    }

    this.adminService.getAllViewbookingList().subscribe(
      (data) => {
        this.allBookingData = data;
        console.log("All Booking Data",this.allBookingData)
      },
      (error) => {
        this.nbtoastService.danger("Unable to get all booking history")
      }
    )

    this.get_customer_list();

  }

  get_customer_list() {
      this.adminService.getCustomerList().subscribe(
        (data)=>{
          this.customerList = data;
          console.log("Cust List",this.customerList);
          this.active();
          this.inActive();
          //this.source = this.customerList.filter(item => item.active === true);
          //this.inactive = this.customerList.filter(item => item.active === false);

        },
        (error) => {
          this.nbtoastService.danger("Unable to get customer List")
        }
      )
  }

  active() {
    this.activeCust= this.customerList.filter(item => item.active === true);
  }
  inActive() {
    this.inactiveCust = this.customerList.filter(item => item.active === false);
  }

  delete_customer(id){
    this.adminService.deleteCustomer(id).subscribe((data) =>
      {
        //this.active_customer()
        //this.inactive_customer()
        this.get_customer_list();
        this.nbtoastService.success("Customer Deleted Successfully")
        //this.ngOnInit()
      })
  }

  onDeleteCustomer(event) {
    this.delete_customer(event.data.id);
  }

  saveCustomer(){
    console.log(this.customerForm.controls['customerActiveFormControl'].value)
    if(this.customerForm.valid){
    let formdata = new FormData();
    if(this.customer_id){

    formdata.append('id',this.customer_id);
    formdata.append('customer_code',this.customerForm.controls['customerCodeFormControl'].value)
    formdata.append('customer_name',this.customerForm.controls['customerNameFormControl'].value)
    formdata.append('phone_number',this.customerForm.controls['phoneNumberFormControl'].value)
    formdata.append('customer_email',this.customerForm.controls['customerEmailFormControl'].value)
    formdata.append('customer_service_bill',this.customerForm.controls['customerServiceBillFormControl'].value)
    formdata.append('customer_address',this.customerForm.controls['customerAddressFormControl'].value)
    formdata.append('advance_amount',this.customerForm.controls['advanceAmountFormControl'].value)
    formdata.append('gst',this.customerForm.controls['gstFormControl'].value)
    formdata.append('active',this.customerForm.controls['customerActiveFormControl'].value)
    formdata.append('customer_source',this.customerForm.controls['customerSourceFormControl'].value)


    this.adminService.updateCustomer(formdata,this.customer_id).subscribe(
      (data) => {
        this.nbtoastService.success("customer details updated Successfully")
        //this.ngOnInit()
        this.customerForm.reset();

        this.routes.navigate(["/ManageBooking"]);




      },
      (error) => {
          this.nbtoastService.danger("Failed to Update");
      }
    );
    }else{
    formdata.append('customer_code',this.customerForm.controls['customerCodeFormControl'].value)
    formdata.append('customer_name',this.customerForm.controls['customerNameFormControl'].value)
    formdata.append('phone_number',this.customerForm.controls['phoneNumberFormControl'].value)
    formdata.append('customer_email',this.customerForm.controls['customerEmailFormControl'].value)
    formdata.append('customer_service_bill',this.customerForm.controls['customerServiceBillFormControl'].value)
    formdata.append('customer_address',this.customerForm.controls['customerAddressFormControl'].value)
    formdata.append('advance_amount',this.customerForm.controls['advanceAmountFormControl'].value)
    formdata.append('gst',this.customerForm.controls['gstFormControl'].value)
    formdata.append('active',this.customerForm.controls['customerActiveFormControl'].value)
    formdata.append('customer_source',this.customerForm.controls['customerSourceFormControl'].value)

    this.adminService.SaveCustomer(formdata).subscribe(
      (data)=>{
        this.nbtoastService.success("Customer Saved Successfully")

       this.customerForm.reset();
       this.routes.navigate(["/ManageBooking"])




      },
      (error) => {
        if(error === "exist"){
          this.nbtoastService.danger("Phone Number already"+" "+error);
          }
          else{
            this.nbtoastService.danger(error);
          }
    }
    )
    }
  }

}

get f() { return this.customerForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.customerForm.invalid) {
            return;
        }
        if (!this.customerForm.invalid){
          return this.submitted = false;
        }



    }



}
