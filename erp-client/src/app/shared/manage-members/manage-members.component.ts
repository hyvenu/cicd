import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { AdminService } from 'src/app/admin/admin.service';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-manage-members',
  templateUrl: './manage-members.component.html',
  styleUrls: ['./manage-members.component.scss']
})
export class ManageMembersComponent implements OnInit {
  selectedGender;
  selectedTrainer
  selectedBatch
  selectedManeger
  selectedsalesRep
  selectedNotification
  selectedSms
  selectedEmail
  selectedVaccin

  options = [
    { value: "Male", name: 'Male' },
    { value: "Female", name: 'Female' },
   
  ];
  vacinated = [
    { value: "Yes", name: 'Yes' },
    { value: "No", name: 'No' },
   
  ];

  salesrep = [
    { value: "ram", name: 'ram' },
    { value: "raju", name: 'raju' },
   
  ];

  manage = [
    { value: "kavita", name: 'kavita' },
    { value: "sammy", name: 'sammy' },
   
  ];

  batch = [
    { value: "1", name: '1' },
    { value: "2", name: '2' },
   
  ];

  notification = [
    { value: "Yes", name: 'Yes' },
    { value: "No", name: 'No' },
   
  ];

  
  sms = [
    { value: "Yes", name: 'Yes' },
    { value: "No", name: 'No' },
   
  ];
  email = [
    { value: "Yes", name: 'Yes' },
    { value: "No", name: 'No' },
   
  ];

  membersForm: FormGroup;
  submitted: boolean = false;
  members_id: any;

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  constructor( private formBuilder: FormBuilder,
    private nbtoastService: NbToastrService,
    private dialogService: NbDialogService,
    private routes: Router,
    private route: ActivatedRoute,
    private adminService:AdminService,
    private sharedService:SharedService,) { }

  ngOnInit(): void {
    this.membersForm = this.formBuilder.group({
      membersCodeFormControl:['',[]],
      fullNameFormControl:['',[Validators.required]],
      phoneNumberFormControl:['',[Validators.required,Validators.pattern('^[0-9]{10}$')]],
      customerEmailFormControl:['',[Validators.required]],
      genderFormControl:['',[Validators.required]],
      localityFormControl:['',[Validators.required]],
      vacinatedFormControl:['',[Validators.required]],
      dateOfBirthFormControl:['',[Validators.required]],
      leadSourceFormControl:['',[Validators.required]],

      salesRepFormControl:['',[Validators.required]],
      MemberManegerFormControl:['',[Validators.required]],
      batchFormControl:['',[Validators.required]],
      // genralTrainerFormControl:['',[Validators.required]],

      AttendanceIdFormControl:['',[Validators.required]],
      clubIdFormControl:['',[Validators.required]],
      gstNoFormControl:['',[Validators.required]],

      emergencyFullNameFormControl:['',[Validators.required]],
      emergencyPhoneNumberFormControl:['',[Validators.required]],
      relationShipFormControl:['',[Validators.required]],

      notificationFormControl:['',[Validators.required]],
      smsFormControl:['',[Validators.required]],
      emailFormControl:['',[Validators.required]],

      ocupationFormControl:['',[Validators.required]],
      officalEmailFormControl:['',[Validators.required]],
      companyNameFormControl:['',[Validators.required]],

      

    })

  }


  saveInfo(){
    let formdata = new FormData();
    if(this.members_id){


    formdata.append('members_code',this.membersForm.controls['membersCodeFormControl'].value);
    formdata.append('full_name',this.membersForm.controls['fullNameFormControl'].value);
    formdata.append('phone_number',this.membersForm.controls['phoneNumberFormControl'].value);
    formdata.append('customer_email',this.membersForm.controls['customerEmailFormControl'].value);
    formdata.append('gender',this.membersForm.controls['genderFormControl'].value);
    formdata.append('locality',this.membersForm.controls['localityFormControl'].value);
    formdata.append('vacinated',this.membersForm.controls['vacinatedFormControl'].value);
    formdata.append('lead_source',this.membersForm.controls['leadSourceFormControl'].value);
    formdata.append('dob',this.membersForm.controls['dateOfBirthFormControl'].value);

    formdata.append('sales_rep',this.membersForm.controls['salesRepFormControl'].value);
    formdata.append('members_maneger',this.membersForm.controls['MemberManegerFormControl'].value);
    formdata.append('batch',this.membersForm.controls['batchFormControl'].value);
    

    formdata.append('attendance_id',this.membersForm.controls['AttendanceIdFormControl'].value);
    formdata.append('club_id',this.membersForm.controls['clubIdFormControl'].value);
    formdata.append('gst_no',this.membersForm.controls['gstNoFormControl'].value);

    formdata.append('emergency_ccontact',this.membersForm.controls['emergencyFullNameFormControl'].value);
    formdata.append('emergency_number',this.membersForm.controls['emergencyPhoneNumberFormControl'].value);
    formdata.append('relationship',this.membersForm.controls['relationShipFormControl'].value);

    formdata.append('notification',this.membersForm.controls['notificationFormControl'].value);
    formdata.append('sms',this.membersForm.controls['smsFormControl'].value);
    formdata.append('email',this.membersForm.controls['emailFormControl'].value);

    formdata.append('occupation',this.membersForm.controls['ocupationFormControl'].value);
    formdata.append('offical_mail',this.membersForm.controls['officalEmailFormControl'].value);
    formdata.append('company_name',this.membersForm.controls['companyNameFormControl'].value);
  
    
    

    this.adminService.updateMember(formdata,this.members_id).subscribe(
      (data)=>{
        this.nbtoastService.success("Memebers Updated Successfully")
        this.routes.navigate(["/MembersList"]);
        // this.ngOnInit()
        // window.location.reload();
        //  this.ngOnInit()
        this.membersForm.reset();
        
        
        
          
      },
      (error) => {
        this.nbtoastService.danger("Failed to update");
    }
    )

    }else{

      formdata.append('members_code',this.membersForm.controls['membersCodeFormControl'].value);
      formdata.append('full_name',this.membersForm.controls['fullNameFormControl'].value);
      formdata.append('phone_number',this.membersForm.controls['phoneNumberFormControl'].value);
      formdata.append('customer_email',this.membersForm.controls['customerEmailFormControl'].value);
      formdata.append('gender',this.membersForm.controls['genderFormControl'].value);
      formdata.append('locality',this.membersForm.controls['localityFormControl'].value);
      formdata.append('vacinated',this.membersForm.controls['vacinatedFormControl'].value);
      formdata.append('lead_source',this.membersForm.controls['leadSourceFormControl'].value);
      formdata.append('dob',this.membersForm.controls['dateOfBirthFormControl'].value);
  
      formdata.append('sales_rep',this.membersForm.controls['salesRepFormControl'].value);
      formdata.append('members_maneger',this.membersForm.controls['MemberManegerFormControl'].value);
      formdata.append('batch',this.membersForm.controls['batchFormControl'].value);
      
  
      formdata.append('attendance_id',this.membersForm.controls['AttendanceIdFormControl'].value);
      formdata.append('club_id',this.membersForm.controls['clubIdFormControl'].value);
      formdata.append('gst_no',this.membersForm.controls['gstNoFormControl'].value);
  
      formdata.append('emergency_ccontact',this.membersForm.controls['emergencyFullNameFormControl'].value);
      formdata.append('emergency_number',this.membersForm.controls['emergencyPhoneNumberFormControl'].value);
      formdata.append('relationship',this.membersForm.controls['relationShipFormControl'].value);
  
      formdata.append('notification',this.membersForm.controls['notificationFormControl'].value);
      formdata.append('sms',this.membersForm.controls['smsFormControl'].value);
      formdata.append('email',this.membersForm.controls['emailFormControl'].value);
  
      formdata.append('occupation',this.membersForm.controls['ocupationFormControl'].value);
      formdata.append('offical_mail',this.membersForm.controls['officalEmailFormControl'].value);
      formdata.append('company_name',this.membersForm.controls['companyNameFormControl'].value);

    this.adminService.SaveMember(formdata).subscribe(
      (data)=>{
        this.nbtoastService.success("Members Saved Successfully")
        this.routes.navigate(["/MembersList"]);
        // this.ngOnInit()
        this.membersForm.reset()
        
        
          
      },
      (error) => {
        this.nbtoastService.danger("Failed to save");
    }
    )
    
    }


  


  }


  get f() { return this.membersForm.controls; }

  onSubmit() {
      this.submitted = true;
      
      // stop here if form is invalid
      if (this.membersForm.invalid) {
          return;
      }
      if (!this.membersForm.invalid){
      
        // this.membersForm.reset()
        
        return this.submitted = false;

      }
      

    
  }

}
