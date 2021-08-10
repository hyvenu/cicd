import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
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

    })
    let param = this.route.snapshot.queryParams['id'];

    if(param){
      this.adminService.getEmployeeDetails(param).subscribe(
        (data) =>{
          
          this.employee_id=data.id
           console.log(this.employee_id)
          this.employeeForm.controls['employeeCodeFormControl'].setValue(data.employee_code);
          this.employeeForm.controls['employeeNameFormControl'].setValue(data.employee_name);
          this.employeeForm.controls['phoneNumberFormControl'].setValue(data.phone_number);
          this.employeeForm.controls['departmentFormControl'].setValue(data.department);
          this.employeeForm.controls['employeeAddressFormControl'].setValue(data.employee_address);
          console.log(data.employee_address);
   
        }
      )

      

    }

    this.sharedService.getDepartmentList().subscribe(
      (data) => {
        this.department_list = data;
        this.department_list.forEach(element => {
          this.dep_id = element.id
        });
        console.log(this.department_list)
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

    
  

  saveEmployee(){
    if(this.employeeForm.valid){
    let formdata = new FormData();
    if(this.employee_id){


    formdata.append('employee_code',this.employeeForm.controls['employeeCodeFormControl'].value);
    formdata.append('employee_name',this.employeeForm.controls['employeeNameFormControl'].value);
    formdata.append('phone_number',this.employeeForm.controls['phoneNumberFormControl'].value);
    formdata.append('department',this.dep_id);
    formdata.append('employee_address',this.employeeForm.controls['employeeAddressFormControl'].value);
    

    this.adminService.updateEmployee(formdata,this.employee_id).subscribe(
      (data)=>{
        this.nbtoastService.success("Employee Updated Successfully")
        // this.ngOnInit()
        // window.location.reload();
        // this.ngOnInit()
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
          this.saveEmployee()
          // this.employeeForm.reset()
          
          return this.submitted = false;

        }
        

      
    }


}
