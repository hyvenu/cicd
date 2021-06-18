import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { AdminService } from 'src/app/admin/admin.service';

@Component({
  selector: 'app-manage-employee',
  templateUrl: './manage-employee.component.html',
  styleUrls: ['./manage-employee.component.scss']
})
export class ManageEmployeeComponent implements OnInit {
  employeeForm:FormGroup
  submitted=false;

  constructor(
    private formBuilder: FormBuilder,
    private nbtoastService: NbToastrService,
    private dialogService: NbDialogService,
    private routes: Router,
    private route: ActivatedRoute,
    private adminService:AdminService,
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
      employeeCodeFormControl:['',[Validators.required]],
      employeeNameFormControl:['',[Validators.required]],
      phoneNumberFormControl:['',[Validators.required,Validators.pattern('^[0-9]{10}$')]],
      departmentFormControl:['',[Validators.required]],

    })
  }

  saveEmployee(){
    let formdata = new FormData();

    formdata.append('employee_code',this.employeeForm.controls['employeeCodeFormControl'].value)
    formdata.append('employee_name',this.employeeForm.controls['employeeNameFormControl'].value)
    formdata.append('phone_number',this.employeeForm.controls['phoneNumberFormControl'].value)
    formdata.append('department',this.employeeForm.controls['departmentFormControl'].value)

    this.adminService.SaveEmployee(formdata).subscribe(
      (data)=>{
        this.nbtoastService.success("Employee Saved Successfully")
          
      },
      (error) => {
        this.nbtoastService.danger("Failed to update");
    }
    )

  }

  get f() { return this.employeeForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.employeeForm.invalid) {
            return;
        }

      
    }

}
