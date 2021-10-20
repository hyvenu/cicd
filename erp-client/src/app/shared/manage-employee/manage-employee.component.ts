import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import * as moment from 'moment';
import { AdminService } from 'src/app/admin/admin.service';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-manage-employee',
  templateUrl: './manage-employee.component.html',
  styleUrls: ['./manage-employee.component.scss']
})
export class ManageEmployeeComponent implements OnInit {
  employeeForm:FormGroup
  submitted=false;
  employeeData = [];
  selectedDepartment;
  code;
  options = [
    { value: "Male", name: 'Male' },
    { value: "Female", name: 'Female' },
   
  ];
  payout = [
    { value: "Fixed", name: 'Fixed' },
    { value: "Variable", name: 'Variable' },
    { value: "Fixed-Variable", name: 'Fixed-Variable' },
   
  ];
  grade = [
    { value: "A", name: 'A' },
    { value: "B", name: 'B' },
    { value: "C", name: 'C' },
   
  ];
  login = [
    { value: "Yes", name: 'Yes' },
    { value: "No", name: 'No' },
    
   
  ];
  selectedOption;

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
        hide:true
      },
      // departme_id: {
      //   title: 'Department Code',        
      //   type: 'html',
      //   valuePrepareFunction: (cell, row) => {
      //     return `<a href="Department?id=${row.id}">${row.department_id}</a>`;
      // }
      // },
      employee_code: {
        title: 'Employee Code',
        type:'html',
        valuePrepareFunction: (cell, row) => {
          return `<a href="ManageEmployee?id=${row.id}">${row.employee_code}</a>`;
        }
      },
      employee_name:{
        title:'Employee Name',
      },
      phone_number:{
        title: 'Phone Number',
      },
      department__department_name:{
        title: 'Department Name',
      },
     
    
 
    },
  };
  employee_id: any;
  department_list: any;
  dep_id: any;
  dailog_ref: any;
  selected_dep: any;
  searchDept:any;
  designation_list: string | Partial<any>;
  searchDes: string;
  selected_des: any;
  des_id: any;
  selectedGender:any;
  selectedGrade:any;
  selectedLogin:any;
  


  constructor(
    private formBuilder: FormBuilder,
    private nbtoastService: NbToastrService,
    private dialogService: NbDialogService,
    private routes: Router,
    private route: ActivatedRoute,
    private adminService:AdminService,
    private sharedService:SharedService,
  ) { }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  ngOnInit(): void {

    this.employeeForm = this.formBuilder.group({
      employeeCodeFormControl:['',[]],
      employeeNameFormControl:['',[Validators.required]],
      phoneNumberFormControl:['',[Validators.required,Validators.pattern('^[0-9]{10}$')]],
      departmentFormControl:['',[Validators.required]],
      employeeAddressFormControl:['',[Validators.required]],
      DOBFormControl:['',[Validators.required]],
      DOJFormControl:['',[Validators.required]],
      SalaryFormControl:['',[Validators.required]],
      jobDesignationFormControl:['',[Validators.required]],
      adminRightsFormControl:['',[Validators.required]],
      attendanceIdFormControl:['',[Validators.required]],
      panCardFormControl:['',[Validators.required]],
      accountNumberFormControl:['',[Validators.required]],
      ifscFormControl:['',[Validators.required]],
      hrmsIdFormControl:['',[Validators.required]],
      genderFormControl:['',[Validators.required]],
      employeeCategoryFormControl:['',[Validators.required]],
      payOutFormControl:['',[Validators.required]],
      gradeFormControl:['',[Validators.required]],
      loginAccessFormControl:['',[Validators.required]],

    })
    let param = this.route.snapshot.queryParams['id'];

    if(param){
      this.adminService.getEmployeeDetails(param).subscribe(
        (data) =>{
          console.log(data)
          this.employee_id=data.id
           console.log(this.employee_id)
          this.employeeForm.controls['employeeCodeFormControl'].setValue(data.employee_code);
          this.employeeForm.controls['employeeNameFormControl'].setValue(data.employee_name);
          this.employeeForm.controls['phoneNumberFormControl'].setValue(data.phone_number);
          this.employeeForm.controls['departmentFormControl'].setValue(data.department_name);
          this.employeeForm.controls['employeeAddressFormControl'].setValue(data.employee_address);
          this.employeeForm.controls['DOBFormControl'].setValue(moment(data.dob));
          this.employeeForm.controls['DOJFormControl'].setValue(moment(data.doj));
          this.employeeForm.controls['SalaryFormControl'].setValue(data.salary);
          this.employeeForm.controls['jobDesignationFormControl'].setValue(data.designation_name);
          this.employeeForm.controls['adminRightsFormControl'].setValue(data.admin_rights);
          this.employeeForm.controls['attendanceIdFormControl'].setValue(data.attendance_id);
          this.employeeForm.controls['panCardFormControl'].setValue(data.pan_card);
          this.employeeForm.controls['accountNumberFormControl'].setValue(data.account_number);
          this.employeeForm.controls['ifscFormControl'].setValue(data.ifsc);
          this.employeeForm.controls['hrmsIdFormControl'].setValue(data.hrms_id);
          this.employeeForm.controls['genderFormControl'].setValue(data.gender);
          this.employeeForm.controls['employeeCategoryFormControl'].setValue(data.employee_category);
          this.employeeForm.controls['payOutFormControl'].setValue(data.pay_out);
          this.employeeForm.controls['gradeFormControl'].setValue(data.grade);
          this.employeeForm.controls['loginAccessFormControl'].setValue(data.login_access);
          this.des_id = data.job_designation
          console.log(this.des_id)
          this.dep_id = data.department
          console.log(data.employee_address);
   
        }
      )

      

    }

    this.sharedService.getDepartmentList().subscribe(
      (data) => {
        this.department_list = data;
        // this.department_list.forEach(element => {
        //   this.dep_id = element.id
        // });
        console.log(this.department_list)
      },
      (error) => {
        this.nbtoastService.danger("Unable to get Deparment List")
      }
    )

    this.sharedService.getDesignationList().subscribe(
      (data) => {
        this.designation_list = data;
        // this.department_list.forEach(element => {
        //   this.dep_id = element.id
        // });
        console.log(this.designation_list)
      },
      (error) => {
        this.nbtoastService.danger("Unable to get Deparment List")
      }
    )

    this.get_employee()

    
  }

  get_employee(){
    this.adminService.getEmployeeList().subscribe(
      (data)=> {
        this.employeeData = data;
      }
    )
  }

  dep_open(dialog: TemplateRef<any>) {
    this.dailog_ref = this.dialogService.open(dialog, { context: this.department_list })
      .onClose.subscribe(data => {
        this.searchDept =""
        this.selected_dep = data;
        this.dep_id = this.selected_dep.id
        this.employeeForm.controls['departmentFormControl'].setValue(data.department_name);
        

      }
      );
  }

  des_open(dialog: TemplateRef<any>) {
    this.dailog_ref = this.dialogService.open(dialog, { context: this.designation_list })
      .onClose.subscribe(data => {
        this.searchDes =""
        this.selected_des = data;
        this.des_id = this.selected_des.id
        this.employeeForm.controls['jobDesignationFormControl'].setValue(data.designation_name);
        

      }
      );
  }
    
  

  saveEmployee(){
    if(this.employeeForm.valid){
    let formdata = new FormData();
    if(this.employee_id){


    formdata.append('employee_code',this.employeeForm.controls['employeeCodeFormControl'].value);
    formdata.append('employee_name',this.employeeForm.controls['employeeNameFormControl'].value);
    formdata.append('phone_number',this.employeeForm.controls['phoneNumberFormControl'].value);
    formdata.append('department',this.dep_id);
    formdata.append('employee_address',this.employeeForm.controls['employeeAddressFormControl'].value);
    formdata.append('dob',this.employeeForm.controls['DOBFormControl'].value);
    formdata.append('doj',this.employeeForm.controls['DOJFormControl'].value);
    formdata.append('salary',this.employeeForm.controls['SalaryFormControl'].value);
    formdata.append('job_designation',this.des_id);
    formdata.append('admin_rights',this.employeeForm.controls['adminRightsFormControl'].value);
    formdata.append('attendance_id',this.employeeForm.controls['attendanceIdFormControl'].value);
    formdata.append('pan_card',this.employeeForm.controls['panCardFormControl'].value);
    formdata.append('account_number',this.employeeForm.controls['accountNumberFormControl'].value);
    formdata.append('ifsc',this.employeeForm.controls['ifscFormControl'].value);
    formdata.append('hrms_id',this.employeeForm.controls['hrmsIdFormControl'].value);
    formdata.append('gender',this.employeeForm.controls['genderFormControl'].value);
    formdata.append('employee_category',this.employeeForm.controls['employeeCategoryFormControl'].value);
    formdata.append('pay_out',this.employeeForm.controls['payOutFormControl'].value);
    formdata.append('grade',this.employeeForm.controls['gradeFormControl'].value);
    formdata.append('login_access',this.employeeForm.controls['loginAccessFormControl'].value);
    

    this.adminService.updateEmployee(formdata,this.employee_id).subscribe(
      (data)=>{
        this.nbtoastService.success("Employee Updated Successfully")
        // this.ngOnInit()
        // window.location.reload();
        //  this.ngOnInit()
        this.employeeForm.reset();
        this.get_employee()
        
        
          
      },
      (error) => {
        this.nbtoastService.danger("Failed to update");
    }
    )

    }else{

    formdata.append('employee_code',this.employeeForm.controls['employeeCodeFormControl'].value)
    formdata.append('employee_name',this.employeeForm.controls['employeeNameFormControl'].value)
    formdata.append('phone_number',this.employeeForm.controls['phoneNumberFormControl'].value)
    formdata.append('department',this.dep_id)
    formdata.append('employee_address',this.employeeForm.controls['employeeAddressFormControl'].value)
    formdata.append('dob',this.employeeForm.controls['DOBFormControl'].value);
    formdata.append('doj',this.employeeForm.controls['DOJFormControl'].value);
    formdata.append('salary',this.employeeForm.controls['SalaryFormControl'].value);
    formdata.append('job_designation',this.des_id);
    formdata.append('admin_rights',this.employeeForm.controls['adminRightsFormControl'].value);
    formdata.append('attendance_id',this.employeeForm.controls['attendanceIdFormControl'].value);
    formdata.append('pan_card',this.employeeForm.controls['panCardFormControl'].value);
    formdata.append('account_number',this.employeeForm.controls['accountNumberFormControl'].value);
    formdata.append('ifsc',this.employeeForm.controls['ifscFormControl'].value);
    formdata.append('hrms_id',this.employeeForm.controls['hrmsIdFormControl'].value);
    formdata.append('gender',this.employeeForm.controls['genderFormControl'].value);
    formdata.append('employee_category',this.employeeForm.controls['employeeCategoryFormControl'].value);
    formdata.append('pay_out',this.employeeForm.controls['payOutFormControl'].value);
    formdata.append('grade',this.employeeForm.controls['gradeFormControl'].value);
    formdata.append('login_access',this.employeeForm.controls['loginAccessFormControl'].value);
    
    

    this.adminService.SaveEmployee(formdata).subscribe(
      (data)=>{
        this.nbtoastService.success("Employee Saved Successfully")
        
        // this.ngOnInit()
        this.employeeForm.reset()
        this.get_employee()
        
          
      },
      (error) => {
        this.nbtoastService.danger("Failed to save");
    }
    )
    
  }
  }

  }
  refresh(){
    window.location.reload()
  }

  get f() { return this.employeeForm.controls; }

    onSubmit() {
        this.submitted = true;
        
        // stop here if form is invalid
        if (this.employeeForm.invalid) {
            return;
        }
        if (!this.employeeForm.invalid){
        
          // this.employeeForm.reset()
          
          return this.submitted = false;

        }
        

      
    }


}
