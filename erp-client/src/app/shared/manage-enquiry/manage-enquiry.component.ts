import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import * as moment from 'moment';
import { AdminService } from 'src/app/admin/admin.service';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-manage-enquiry',
  templateUrl: './manage-enquiry.component.html',
  styleUrls: ['./manage-enquiry.component.scss']
})
export class ManageEnquiryComponent implements OnInit {

  selectedGender;
  selectedTag;

  options = [
    { value: "Male", name: 'Male' },
    { value: "Female", name: 'Female' },
   
  ];
  tag = [
    { value: "Cold", name: 'Cold' },
    { value: "Warm", name: 'Warm' },
    { value: "Hot", name: 'Hot' },
  ];


  submitted: boolean=false
  enquiryForm: FormGroup;
  enquiry_id: any ="";
  serv_id: string | Blob;
  service_list: any;
  dailog_ref: any;
  searchService: string;
  employee_list: string | Partial<any>;
  searchEmployee: string;
  emp_id: any;


  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  constructor(   private formBuilder: FormBuilder,
    private nbtoastService: NbToastrService,
    private dialogService: NbDialogService,
    private routes: Router,
    private route: ActivatedRoute,
    private adminService:AdminService,
    private sharedService:SharedService,) { }

  ngOnInit(): void {
    this.enquiryForm = this.formBuilder.group({
      enquiryCodeFormControl:['',[]],
      fullNameFormControl:['',[Validators.required]],
      phoneNumberFormControl:['',[Validators.required,Validators.pattern('^[0-9]{10}$')]],
      customerEmailFormControl:['',[Validators.required]],
      genderFormControl:['',[Validators.required]],
      localityFormControl:['',[Validators.required]],
      enquiryDateFormControl:['',[Validators.required]],
      serviceNameFormControl:['',[Validators.required]],
      leadSourceFormControl:['',[Validators.required]],
      enquiryTypeFormControl:['',[Validators.required]],
      DateFormControl:['',[Validators.required]],
      timeFormControl:['',[Validators.required]],
      staffNameFormControl:['',[Validators.required]],
      messageFormControl:['',[Validators.required]],
      callTagFormControl:['',[Validators.required]],
      warmFormControl:['',[Validators.required]],
      hotFormControl:['',[Validators.required]],
      

    })

    this.enquiry_id = this.route.snapshot.queryParams['id'];
    console.log(this.enquiry_id)

    if(this.enquiry_id){
      this.adminService.getEnquiryDetails(this.enquiry_id).subscribe(
        (data) =>{
          console.log(data)
         
          this.enquiryForm.controls['enquiryCodeFormControl'].setValue(data.enquiry_code);
          this.enquiryForm.controls['fullNameFormControl'].setValue(data.full_name);
          this.enquiryForm.controls['phoneNumberFormControl'].setValue(data.phone_number);
          this.enquiryForm.controls['serviceNameFormControl'].setValue(data.service_name);
          this.enquiryForm.controls['customerEmailFormControl'].setValue(data.customer_email);
          this.enquiryForm.controls['genderFormControl'].setValue(data.gender);
          this.enquiryForm.controls['localityFormControl'].setValue(data.locality);
          this.enquiryForm.controls['enquiryDateFormControl'].setValue(moment(data.enquiry_date));
          this.enquiryForm.controls['leadSourceFormControl'].setValue(data.lead_source);
          this.enquiryForm.controls['enquiryTypeFormControl'].setValue(data.enquiry_type);
          this.enquiryForm.controls['DateFormControl'].setValue(data.date);
          this.enquiryForm.controls['timeFormControl'].setValue(data.time);
          this.enquiryForm.controls['staffNameFormControl'].setValue(data.employee_name);
          this.enquiryForm.controls['messageFormControl'].setValue(data.message);
          this.enquiryForm.controls['callTagFormControl'].setValue(data.call_log);
      
          this.serv_id = data.service
          
          this.emp_id = data.staff_name
         
   
        }
      )
      }
      


    this.adminService.getEmployeeList().subscribe(
      (data)=> {
        this.employee_list = data;
      }
    )

    this.adminService.getServiceList().subscribe(
      (data) =>{
        this.service_list = data;
        console.log("srr" +this.service_list)

   
      },
      (error) =>{
        this.nbtoastService.danger("unable to get service list");
      }
    )
  }

  open_service_list(dialog: TemplateRef<any>) {
    this.dailog_ref= this.dialogService.open(dialog, { context: this.service_list })
    .onClose.subscribe(data => {
      this.searchService=""
          
       this.serv_id = data.id
       this.enquiryForm.controls['serviceNameFormControl'].setValue(data.service_name);
      
       
       
    }
    );
  }

  open_employee_list(dialog: TemplateRef<any>) {
    this.dailog_ref= this.dialogService.open(dialog, { context: this.employee_list })
    .onClose.subscribe(data => {
      this.searchEmployee=""
          
       this.emp_id = data.id
       this.enquiryForm.controls['staffNameFormControl'].setValue(data.employee_name);
      
       
       
    }
    );
  }






  saveEnquiry(){
    console.log("save me")
  
    let formdata = new FormData();
    if(this.enquiry_id){


    formdata.append('enquiry_code',this.enquiryForm.controls['enquiryCodeFormControl'].value);
    formdata.append('full_name',this.enquiryForm.controls['fullNameFormControl'].value);
    formdata.append('phone_number',this.enquiryForm.controls['phoneNumberFormControl'].value);
    formdata.append('service',this.serv_id);
    formdata.append('customer_email',this.enquiryForm.controls['customerEmailFormControl'].value);
    formdata.append('gender',this.enquiryForm.controls['genderFormControl'].value);
    formdata.append('locality',this.enquiryForm.controls['localityFormControl'].value);
    formdata.append('enquiry_date',this.enquiryForm.controls['enquiryDateFormControl'].value);
    formdata.append('lead_source',this.enquiryForm.controls['leadSourceFormControl'].value);
    formdata.append('enquiry_type',this.enquiryForm.controls['enquiryTypeFormControl'].value);
    formdata.append('date',this.enquiryForm.controls['DateFormControl'].value);
    formdata.append('time',this.enquiryForm.controls['timeFormControl'].value);
    formdata.append('staff_name',this.emp_id);
    formdata.append('message',this.enquiryForm.controls['messageFormControl'].value);
    formdata.append('call_log',this.enquiryForm.controls['callTagFormControl'].value);
  
    
    

    this.adminService.updateEnquiry(formdata,this.enquiry_id).subscribe(
      (data)=>{
        this.nbtoastService.success("Enquiry Updated Successfully")
        this.routes.navigate(["/EnquiryList"]);
        // this.ngOnInit()
        // window.location.reload();
        //  this.ngOnInit()
        this.enquiryForm.reset();
        
        
        
          
      },
      (error) => {
        this.nbtoastService.danger("Failed to update");
    }
    )

    }else{

      formdata.append('enquiry_code',this.enquiryForm.controls['enquiryCodeFormControl'].value);
      formdata.append('full_name',this.enquiryForm.controls['fullNameFormControl'].value);
      formdata.append('phone_number',this.enquiryForm.controls['phoneNumberFormControl'].value);
      formdata.append('service',this.serv_id);
      formdata.append('customer_email',this.enquiryForm.controls['customerEmailFormControl'].value);
      formdata.append('gender',this.enquiryForm.controls['genderFormControl'].value);
      formdata.append('locality',this.enquiryForm.controls['localityFormControl'].value);
      formdata.append('enquiry_date',this.enquiryForm.controls['enquiryDateFormControl'].value);
      formdata.append('lead_source',this.enquiryForm.controls['leadSourceFormControl'].value);
      formdata.append('enquiry_type',this.enquiryForm.controls['enquiryTypeFormControl'].value);
      formdata.append('date',this.enquiryForm.controls['DateFormControl'].value);
      formdata.append('time',this.enquiryForm.controls['timeFormControl'].value);
      formdata.append('staff_name',this.emp_id);
      formdata.append('message',this.enquiryForm.controls['messageFormControl'].value);
      formdata.append('call_log',this.enquiryForm.controls['callTagFormControl'].value);
      
      

    this.adminService.SaveEnquiry(formdata).subscribe(
      (data)=>{
        this.nbtoastService.success("Enquiry Saved Successfully")
        this.routes.navigate(["/EnquiryList"]);
        // this.ngOnInit()
        this.enquiryForm.reset()
        
        
          
      },
      (error) => {
        this.nbtoastService.danger("Failed to save");
    }
    )
    
    }


  }


  get f() { return this.enquiryForm.controls; }

    onSubmit() {
        this.submitted = true;
        
        // stop here if form is invalid
        if (this.enquiryForm.invalid) {
            return;
        }
        if (!this.enquiryForm.invalid){
        
          // this.enquiryForm.reset()
          
          return this.submitted = false;

        }
        

      
    }
    
}
