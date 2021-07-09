import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { AdminService } from 'src/app/admin/admin.service';

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
      service__service_name:{
        title: 'Service Name',
        // type:'string',
        // valuePrepareFunction:(cell, row) =>{
        //   return row.service.service_name;
        // },  
      },
      assigned_staff__employee_name:{
        title: 'Assigned Staff',
        // type:'string',
        // // valuePrepareFunction: (cell, row)=> {
        // //   return row.assigned_staff_det.employee_name;
        // // }
      }
 
    },
  };

  source:[];


  setting = {
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




customerForm:FormGroup;
  Bills_list=[
    {name:"Emailed",value:"Emailed"},
    {name:"Not a option", value:"Not an option"},
  ]
  customer_id: any;
  bill: any;
  submitted=false;
  
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
      customerEmailFormControl:['',[Validators.required,Validators.email],],
      customerServiceBillFormControl:['',[Validators.required]],
      customerAddressFormControl:['',[Validators.required]],

    })

    let param = this.route.snapshot.queryParams['id'];

    if(param){
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


    // this.adminService.getAppointmentList().subscribe(
    //   (data) => {
    //     this.data = data;
    //     console.log(data)
    //   },
    //   (error) => {
    //     this.nbtoastService.danger("Unable to get customer List")
    //   }
    // )

    this.adminService.getCustomerList().subscribe(
      (data)=>{
        this.source = data;
      },
      (error) => {
        this.nbtoastService.danger("Unable to get customer List")
      } 

    )

  }

  saveCustomer(){
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

    
    this.adminService.updateCustomer(formdata,this.customer_id).subscribe(
      (data) => {
        this.nbtoastService.success("customer details updated Successfully")
        this.ngOnInit()
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

    this.adminService.SaveCustomer(formdata).subscribe(
      (data)=>{
        this.nbtoastService.success("Employee Saved Successfully")
        
       this.customerForm.reset();
       this.routes.navigate(["/ManageBooking"])
       
       
        
          
      },
      (error) => {
        this.nbtoastService.danger("Failed to save");
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
