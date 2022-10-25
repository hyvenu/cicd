import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import * as moment from 'moment';
import { AdminService } from 'src/app/admin/admin.service';
import { OrderService } from 'src/app/sales/order.service';
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
  selectedLandE
  selectedPT
  selectedplan
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
    { value: "3", name: '3' },

  ];
  // personaltrainer = [
  //   { value: "1", name: '1' },
  //   { value: "2", name: '2' },

  // ];

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
  landE = [
    { value: "walkin", name: 'walkin' },
    { value: "Referal", name: 'Referal' },
    { value: "Email", name: 'Email' },
    { value: "facebook", name: 'facebook' },
    { value: "walkin", name: 'walkin' },
    { value: "insta", name: 'insta' },
    { value: "others", name: 'others' },

  ];

  membersForm: FormGroup;
  submitted: boolean = false;
  members_id: any;
  j_id: any;
  employeeData: any = [];
  data: any;
  activeList: any = [];
  trainer_list: any = [];
  employeelist: any = [];
  sales_list: any = [];
  memberlist: any = [];
  pipe = new DatePipe('en-US');
  rowData: any=[];
  TenureAmount: any=0;
  selected_plan_amount: any;

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  employeeSettings = {
    // selectMode: 'multi',
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    columns: {
      id: {
        title: 'id',
        hide: true
      },
      // departme_id: {
      //   title: 'Department Code',
      //   type: 'html',
      //   valuePrepareFunction: (cell, row) => {
      //     return `<a href="Department?id=${row.id}">${row.department_id}</a>`;
      // }
      // },
      members_code: {
        title: 'Member Code',
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          return `<a href="MemberDetails?id=${row.id}">${row.members_code}</a>`;
        }
      },
      full_name: {
        title: 'Member Name',
      },
      phone_number: {
        title: 'Phone Number',
      },
      locality: {
        title: 'locality',
      },



    },
  };

  constructor(private formBuilder: FormBuilder,
    private nbtoastService: NbToastrService,
    private dialogService: NbDialogService,
    private routes: Router,
    private route: ActivatedRoute,
    private adminService: AdminService,
    private sharedService: SharedService,
    private OrderService: OrderService,) { }

  ngOnInit(): void {
    this.membersForm = this.formBuilder.group({
      membersCodeFormControl: ['', []],
      fullNameFormControl: ['', [Validators.required]],
      phoneNumberFormControl: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      customerEmailFormControl: ['', [Validators.required]],
      genderFormControl: ['', [Validators.required]],
      localityFormControl: ['', [Validators.required]],
      vacinatedFormControl: ['', [Validators.required]],
      dateOfBirthFormControl: ['', [Validators.required]],
      leadSourceFormControl: ['', [Validators.required]],

      salesRepFormControl: ['', [Validators.required]],
      MemberManegerFormControl: ['', [Validators.required]],
      batchFormControl: ['', [Validators.required]],
      personaltraineFormControl: ['', [Validators.required]],
      // genralTrainerFormControl:['',[Validators.required]],

      AttendanceIdFormControl: ['', [Validators.required]],
      clubIdFormControl: ['', [Validators.required]],
      gstNoFormControl: ['', [Validators.required]],

      emergencyFullNameFormControl: ['', [Validators.required]],
      emergencyPhoneNumberFormControl: ['', [Validators.required]],
      relationShipFormControl: ['', [Validators.required]],

      notificationFormControl: ['', [Validators.required]],
      smsFormControl: ['', [Validators.required]],
      emailFormControl: ['', [Validators.required]],

      ocupationFormControl: ['', [Validators.required]],
      officalEmailFormControl: ['', [Validators.required]],
      companyNameFormControl: ['', [Validators.required]],
      PlanFormControl: ['', [Validators.required]],
      planamountFormControl: ['', [Validators.required]],
      TenureFormControl: ['', [Validators.required]],
      TenureamountFormControl: ['', [Validators.required]],


    })
    this.onactiveplans();
    let param = this.route.snapshot.queryParams['id'];
    if(param){
      this.adminService.getmemberdetails(param).subscribe(
        (data) =>{
          console.log(data)
          this.members_id=data.id
          this.membersForm.controls['membersCodeFormControl'].setValue(data.members_code);
          this.membersForm.controls['fullNameFormControl'].setValue(data.full_name);
          this.membersForm.controls['phoneNumberFormControl'].setValue(data.phone_number);
          this.membersForm.controls['customerEmailFormControl'].setValue(data.customer_email);
          this.membersForm.controls['genderFormControl'].setValue(data.gender);
          this.membersForm.controls['localityFormControl'].setValue(data.locality);
          this.membersForm.controls['vacinatedFormControl'].setValue(data.vacinated);
          // const dob = this.pipe.transform(data.dob, 'yyyy-MM-dd')
          this.membersForm.controls['dateOfBirthFormControl'].setValue(moment(data.dob));
          this.membersForm.controls['leadSourceFormControl'].setValue(data.lead_source);
          this.membersForm.controls['salesRepFormControl'].setValue(data.sales_rep);
          this.membersForm.controls['MemberManegerFormControl'].setValue(data.members_maneger);

          this.membersForm.controls['batchFormControl'].setValue(data.batch);
          this.membersForm.controls['personaltraineFormControl'].setValue(data.personal_traine);
          this.membersForm.controls['AttendanceIdFormControl'].setValue(data.attendance_id);
        
          this.membersForm.controls['clubIdFormControl'].setValue(data.club_id);
          this.membersForm.controls['gstNoFormControl'].setValue(data.gst_no);

          this.membersForm.controls['emergencyFullNameFormControl'].setValue(data.emergency_ccontact);
          this.membersForm.controls['emergencyPhoneNumberFormControl'].setValue(data.emergency_number);
          this.membersForm.controls['relationShipFormControl'].setValue(data.relationship);


          this.membersForm.controls['notificationFormControl'].setValue(data.notification);
          this.membersForm.controls['smsFormControl'].setValue(data.sms);
          this.membersForm.controls['emailFormControl'].setValue(data.email);

          this.membersForm.controls['ocupationFormControl'].setValue(data.occupation);
          this.membersForm.controls['officalEmailFormControl'].setValue(data.offical_mail);
          this.membersForm.controls['companyNameFormControl'].setValue(data.company_name);
          this.membersForm.controls['PlanFormControl'].setValue(data.plan_name);

          this.membersForm.controls['planamountFormControl'].setValue(data.Plan_amount);
          this.membersForm.controls['TenureFormControl'].setValue(data.tenure);
          this.membersForm.controls['TenureamountFormControl'].setValue(data.tenure_amount);
          

 
          


        })
      }

    this.sharedService.getDesignationList().subscribe(
      (data) => {
        this.data = data; console.log("DATA", data)
        this.activeList = this.data.filter(item => item.active === true);
        console.log("active list", this.activeList)
        this.trainer_list = this.activeList.filter((s) => s.designation_name === 'Trainer')
        console.log("trainee list", this.trainer_list)
        console.log("traine by id", this.trainer_list[0].id)
        this.j_id = this.trainer_list[0].id
        console.log("j_id", this.j_id)
        this.get_employee(this.j_id);
        this.get_employeelist()
        this.get_memberlist()
      },
      (error) => {
        this.nbtoastService.danger("Unable to get designation List")
      }
    )



  }


  saveInfo() {
    let formdata = new FormData();
    if (this.members_id) {


      formdata.append('members_code', this.membersForm.controls['membersCodeFormControl'].value);
      formdata.append('full_name', this.membersForm.controls['fullNameFormControl'].value);
      formdata.append('phone_number', this.membersForm.controls['phoneNumberFormControl'].value);
      formdata.append('customer_email', this.membersForm.controls['customerEmailFormControl'].value);
      formdata.append('gender', this.membersForm.controls['genderFormControl'].value);
      formdata.append('locality', this.membersForm.controls['localityFormControl'].value);
      formdata.append('vacinated', this.membersForm.controls['vacinatedFormControl'].value);
      formdata.append('lead_source', this.membersForm.controls['leadSourceFormControl'].value);
      formdata.append('dob', this.membersForm.controls['dateOfBirthFormControl'].value);

      formdata.append('sales_rep', this.membersForm.controls['salesRepFormControl'].value);
      formdata.append('members_maneger', this.membersForm.controls['MemberManegerFormControl'].value);
      formdata.append('batch', this.membersForm.controls['batchFormControl'].value);
      formdata.append('personal_traine', this.membersForm.controls['personaltraineFormControl'].value);

      formdata.append('attendance_id', this.membersForm.controls['AttendanceIdFormControl'].value);
      formdata.append('club_id', this.membersForm.controls['clubIdFormControl'].value);
      formdata.append('gst_no', this.membersForm.controls['gstNoFormControl'].value);

      formdata.append('emergency_ccontact', this.membersForm.controls['emergencyFullNameFormControl'].value);
      formdata.append('emergency_number', this.membersForm.controls['emergencyPhoneNumberFormControl'].value);
      formdata.append('relationship', this.membersForm.controls['relationShipFormControl'].value);

      formdata.append('notification', this.membersForm.controls['notificationFormControl'].value);
      formdata.append('sms', this.membersForm.controls['smsFormControl'].value);
      formdata.append('email', this.membersForm.controls['emailFormControl'].value);

      formdata.append('occupation', this.membersForm.controls['ocupationFormControl'].value);
      formdata.append('offical_mail', this.membersForm.controls['officalEmailFormControl'].value);
      formdata.append('company_name', this.membersForm.controls['companyNameFormControl'].value);
      formdata.append('plan_name', this.membersForm.controls['PlanFormControl'].value);

      formdata.append('Plan_amount', this.membersForm.controls['planamountFormControl'].value);
      formdata.append('tenure', this.membersForm.controls['TenureFormControl'].value);
      formdata.append('tenure_amount', this.membersForm.controls['TenureamountFormControl'].value);

  

      this.adminService.updateMember(formdata, this.members_id).subscribe(
        (data) => {
          this.nbtoastService.success("Memebers Updated Successfully")
          this.routes.navigate(["/Members"]);
          // this.ngOnInit()
          // window.location.reload();
          //  this.ngOnInit()
          this.membersForm.reset();




        },
        (error) => {
          this.nbtoastService.danger("Failed to update");
        }
      )

    } else {

      formdata.append('members_code', this.membersForm.controls['membersCodeFormControl'].value);
      formdata.append('full_name', this.membersForm.controls['fullNameFormControl'].value);
      formdata.append('phone_number', this.membersForm.controls['phoneNumberFormControl'].value);
      formdata.append('customer_email', this.membersForm.controls['customerEmailFormControl'].value);
      formdata.append('gender', this.membersForm.controls['genderFormControl'].value);
      formdata.append('locality', this.membersForm.controls['localityFormControl'].value);
      formdata.append('vacinated', this.membersForm.controls['vacinatedFormControl'].value);
      formdata.append('lead_source', this.membersForm.controls['leadSourceFormControl'].value);
      formdata.append('dob', this.membersForm.controls['dateOfBirthFormControl'].value);

      formdata.append('sales_rep', this.membersForm.controls['salesRepFormControl'].value);
      formdata.append('members_maneger', this.membersForm.controls['MemberManegerFormControl'].value);
      formdata.append('batch', this.membersForm.controls['batchFormControl'].value);
      formdata.append('personal_traine', this.membersForm.controls['personaltraineFormControl'].value);


      formdata.append('attendance_id', this.membersForm.controls['AttendanceIdFormControl'].value);
      formdata.append('club_id', this.membersForm.controls['clubIdFormControl'].value);
      formdata.append('gst_no', this.membersForm.controls['gstNoFormControl'].value);

      formdata.append('emergency_ccontact', this.membersForm.controls['emergencyFullNameFormControl'].value);
      formdata.append('emergency_number', this.membersForm.controls['emergencyPhoneNumberFormControl'].value);
      formdata.append('relationship', this.membersForm.controls['relationShipFormControl'].value);

      formdata.append('notification', this.membersForm.controls['notificationFormControl'].value);
      formdata.append('sms', this.membersForm.controls['smsFormControl'].value);
      formdata.append('email', this.membersForm.controls['emailFormControl'].value);

      formdata.append('occupation', this.membersForm.controls['ocupationFormControl'].value);
      formdata.append('offical_mail', this.membersForm.controls['officalEmailFormControl'].value);
      formdata.append('company_name', this.membersForm.controls['companyNameFormControl'].value);
      formdata.append('plan_name', this.membersForm.controls['PlanFormControl'].value);

      formdata.append('Plan_amount', this.membersForm.controls['planamountFormControl'].value);
      formdata.append('tenure', this.membersForm.controls['TenureFormControl'].value);
      formdata.append('tenure_amount', this.membersForm.controls['TenureamountFormControl'].value);

      this.adminService.SaveMember(formdata).subscribe(
        (data) => {
          this.nbtoastService.success("Members Saved Successfully")
          // this.routes.navigate(["/MembersList"]);
          // this.ngOnInit()
          this.membersForm.reset()



        },
        (error) => {
          this.nbtoastService.danger("Failed to save");
        }
      )

    }





  }

  get_employee(id) {


    this.adminService.getEmployeeList_by_job_id(id).subscribe(
      (data) => {
        this.employeeData = data;
        console.log("employee list by sujan", this.employeeData)
      }
    )
  }


  get_employeelist() {
    this.adminService.getEmployeeList().subscribe(
      (data) => {
        this.employeelist = data;
        this.sales_list = this.employeelist.filter((s) => s.department__department_name
          === 'sales')
        console.log("employee list 1", this.employeelist)
      }
    )
  }

  get_memberlist() {
    this.adminService.getmemberlist().subscribe(
      (data) => {
        this.memberlist = data;

      }
    )
  }

  onactiveplans() {
    this.sharedService.getplans().subscribe(
      (data) => {
        let t = data.filter(a => {
          if (a.active) {
            return a;
          }
        })
        this.rowData = t;
        console.log("row data", this.rowData)
      },
      (error) => {
        this.nbtoastService.danger(error);
      }
    )



  }

  planamount(data){
console.log("plan amount",data)
this.selected_plan_amount=data
this.membersForm.controls['planamountFormControl'].setValue(data);
this.tenureamount();
  }

  tenureamount(){
    if(this.membersForm.controls['TenureFormControl'].value){
      this.TenureAmount=this.selected_plan_amount/this.membersForm.controls['TenureFormControl'].value
      this.membersForm.controls['TenureamountFormControl'].setValue(parseFloat(this.TenureAmount).toFixed(2))
    }
  }
  get f() { return this.membersForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.membersForm.invalid) {
      return;
    }
    if (!this.membersForm.invalid) {

      // this.membersForm.reset()

      return this.submitted = false;

    }



  }

}
