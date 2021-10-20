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

    if(this.enquiry_id){
      this.adminService.getEmployeeDetails(this.enquiry_id).subscribe(
        (data) =>{
          console.log(data)
         
          this.enquiryForm.controls['employeeCodeFormControl'].setValue(data.employee_code);
          this.enquiryForm.controls['employeeNameFormControl'].setValue(data.employee_name);
          this.enquiryForm.controls['phoneNumberFormControl'].setValue(data.phone_number);
          this.enquiryForm.controls['departmentFormControl'].setValue(data.department_name);
          this.enquiryForm.controls['employeeAddressFormControl'].setValue(data.employee_address);
          this.enquiryForm.controls['DOBFormControl'].setValue(moment(data.dob));
          this.enquiryForm.controls['DOJFormControl'].setValue(moment(data.doj));
          this.enquiryForm.controls['SalaryFormControl'].setValue(data.salary);
          this.enquiryForm.controls['jobDesignationFormControl'].setValue(data.designation_name);
          this.enquiryForm.controls['adminRightsFormControl'].setValue(data.admin_rights);
          this.enquiryForm.controls['attendanceIdFormControl'].setValue(data.attendance_id);
          this.enquiryForm.controls['panCardFormControl'].setValue(data.pan_card);
          this.enquiryForm.controls['accountNumberFormControl'].setValue(data.account_number);
          this.enquiryForm.controls['ifscFormControl'].setValue(data.ifsc);
          this.enquiryForm.controls['hrmsIdFormControl'].setValue(data.hrms_id);
          this.enquiryForm.controls['genderFormControl'].setValue(data.gender);
          this.enquiryForm.controls['employeeCategoryFormControl'].setValue(data.employee_category);
          this.enquiryForm.controls['payOutFormControl'].setValue(data.pay_out);
          this.enquiryForm.controls['gradeFormControl'].setValue(data.grade);
          this.enquiryForm.controls['loginAccessFormControl'].setValue(data.login_access);
          this.serv_id = data.service
          
          this.emp_id = data.staff_id
         
   
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
    formdata.append('cold',this.enquiryForm.controls['coldFormControl'].value);
    formdata.append('warm',this.enquiryForm.controls['warmFormControl'].value);
    formdata.append('hot',this.enquiryForm.controls['hotFormControl'].value);
    
    

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
      formdata.append('call_tag',this.enquiryForm.controls['callTagFormControl'].value);
      
      

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
