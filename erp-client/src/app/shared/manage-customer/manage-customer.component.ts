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

  data: [];

  settings = {
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
      // departme_id: {
      //   title: 'Department Code',
      //   type: 'html',
      //   valuePrepareFunction: (cell, row) => {
      //     return `<a href="Department?id=${row.id}">${row.department_id}</a>`;
      // }
      // },
      customer_name: {
        title: 'Customer Name',
        type:'html',
        valuePrepareFunction: (cell, row) => {
          return `<a href="ManageBooking?id=${row.id}">${row.customer_name}</a>`;
        }
      },
      phone_number:{
        title: 'Phone Number',
      },
      booking_date:{
        title: 'Booking Date',
      },
      service_list:{
        title: 'Service Name',
        type:'string',
        //valuePrepareFunction:(service_list) =>{
          //return service_list[0].service__service_name;
        //},
      },
      //assigned_staff__employee_name:{
        //title: 'Assigned Staff',
        // type:'string',
        // // valuePrepareFunction: (cell, row)=> {
        // //   return row.assigned_staff_det.employee_name;
        // // }
      //}

    },
  };

  source:[];
  activeCust:[];
  inactiveCust:[];


  setting = {
    // selectMode: 'multi',
    actions: {
      add: false,
      edit: false,
      delete: false,
      custom: [
        {
          name: 'delete',
          title: '<i style="color:red" class="fa fa-trash"></i>',
        },
      ],
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


    },
  };



  inactive:[];


  inSetting = {
    // selectMode: 'multi',
    actions: {
      add: false,
      edit: false,
      delete: false,
      custom: [
        {
          name: 'delete',
          title: '<i style="color:red" class="fa fa-trash"></i>',
        },
      ],
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

    })

    this.customerForm.reset();

    let param = this.route.snapshot.queryParams['id'];

    if(param){
      this.isCustomer_id = true;
      this.adminService.getCustomerDetails(param).subscribe(
        (data) =>{

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
          this.adminService.getBookinHistory(param).subscribe(
            (data) => {
              this.data = data;
              console.log(this.data)
            },
            (error) => {
              this.nbtoastService.danger("Unable to get customer List")
            }
          )




    });
    }

    this.adminService.getAllViewbookingList().subscribe(
      (data) => {
        this.data = data;
        console.log(data)
      },
      (error) => {
        this.nbtoastService.danger("Unable to get customer List")
      }
    )

    this.get_customer_list();

  }

  get_customer_list() {
      this.adminService.getCustomerList().subscribe(
        (data)=>{
          this.customerList = data;
          console.log("Cust List");
          console.log(this.customerList);
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
  /*
  active_customer(){
    this.source = this.customerList.filter(item => item.active === true);


  }

  inactive_customer(){

    this.adminService.getCustomerList().subscribe(
      (data)=>{
        this.inactive = data.filter(item => item.active === false);
      },
      (error) => {
        this.nbtoastService.danger("Unable to get customer List")
      }

    )



  }

*/

  delete_customer(id){
    this.adminService.deleteCustomer(id).subscribe((data) =>
      {
        //this.active_customer()
        //this.inactive_customer()
        this.get_customer_list();
        this.nbtoastService.success("customer Deleted Successfully")
        //this.ngOnInit()
      })
  }

  onCustom(event) {
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
