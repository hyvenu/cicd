import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryService } from 'src/app/inventory/inventory.service';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef, TemplateRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit {

  // departmentForm: FormGroup;
  departmentMasterForm: FormGroup;

  dept_id: any;
  submitted=false;
  data: any;
  marked = true;
  createFlag = true;


  constructor(private formBuilder: FormBuilder,
    private inventoryService: InventoryService,
    private sharedService: SharedService,
    private nbtoastService: NbToastrService,
    private routes: Router,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private dialogService: NbDialogService,) { }

  ngOnInit(): void {

    this.departmentMasterForm = this.formBuilder.group({
     departmentCodeFormControl: ['', []],
     departmentNameFormControl: ['', [Validators.required]],
     categoryActivateFormControl:[''],

    });

    let param = this.route.snapshot.queryParams['id'];

    if (param) {
      this.sharedService.getDepartmentDetails(param).subscribe(
        (data) => {
          // this.purchaseOrderForm.controls['poTypeFormControl'].setValue(data.po_type);
          this.createFlag=!this.createFlag;
          this.dept_id =  data.id;
          console.log("D id" + this.dept_id)
          this.departmentMasterForm.controls['departmentCodeFormControl'].setValue(data.department_id);
          this.departmentMasterForm.controls['departmentNameFormControl'].setValue(data.department_name);
          this.departmentMasterForm.controls['categoryActivateFormControl'].setValue(data.active);
        });
      }


      this.sharedService.getDepartmentList().subscribe(
        (data) => {
          this.data = data;
        },
        (error) => {
          this.nbtoastService.danger("Unable to get Deparment List")
        }
      )

  }


  saveDept() {
    if(this.departmentMasterForm.valid){
    console.log("Called save dept");
    const formData = new FormData();
    if (this.dept_id) {
      formData.append('id', this.dept_id);
      // formData.append('department_id', this.departmentMasterForm.controls['departmentCodeFormControl'].value);
      formData.append('department_id', this.departmentMasterForm.controls['departmentCodeFormControl'].value);
    formData.append('department_name', this.departmentMasterForm.controls['departmentNameFormControl'].value);
    formData.append('active',this.departmentMasterForm.controls['categoryActivateFormControl'].value);

    this.sharedService.updateDepartment(formData,this.dept_id).subscribe(
      (data) => {
        this.nbtoastService.success("Department Details updated Successfully")
        this.ngOnInit();
        this.routes.navigate(["/DepartmentList"]);
      },
      (error) => {
          this.nbtoastService.danger("Department name already exist");
      }
    );
    }else{
    formData.append('department_id', this.departmentMasterForm.controls['departmentCodeFormControl'].value);
    formData.append('department_name', this.departmentMasterForm.controls['departmentNameFormControl'].value);
    formData.append('active',this.departmentMasterForm.controls['categoryActivateFormControl'].value);
    this.sharedService.saveDepartment(formData).subscribe(
      (data) => {
        this.nbtoastService.success("Department Details Saved Successfully, ")
        this.ngOnInit();
        this.routes.navigate(["/DepartmentList"]);
      },
      (error) => {
        console.log(error);
          this.nbtoastService.danger("Department name already exist");

      }
    );
    }

  }
  }

  update(){
    if(this.departmentMasterForm.valid){
      console.log("Called save dept");
      const formData = new FormData();
      if (this.dept_id) {
        formData.append('id', this.dept_id);
        // formData.append('department_id', this.departmentMasterForm.controls['departmentCodeFormControl'].value);
        formData.append('department_id', this.departmentMasterForm.controls['departmentCodeFormControl'].value);
      formData.append('department_name', this.departmentMasterForm.controls['departmentNameFormControl'].value);
      formData.append('active',this.departmentMasterForm.controls['categoryActivateFormControl'].value);

      this.sharedService.updateDepartment(formData,this.dept_id).subscribe(
        (data) => {
          this.nbtoastService.success("Department Details updated Successfully")
          this.ngOnInit();
          this.routes.navigate(["/DepartmentList"]);
        },
        (error) => {
            this.nbtoastService.danger("Department name already exist");
        }
      );
      }else{
      formData.append('department_id', this.departmentMasterForm.controls['departmentCodeFormControl'].value);
      formData.append('department_name', this.departmentMasterForm.controls['departmentNameFormControl'].value);
      formData.append('active',this.departmentMasterForm.controls['categoryActivateFormControl'].value);
      this.sharedService.saveDepartment(formData).subscribe(
        (data) => {
          this.nbtoastService.success("Department Details Saved Successfully, ")
          this.ngOnInit();
          this.routes.navigate(["/DepartmentList"]);
        },
        (error) => {
          console.log(error);
            this.nbtoastService.danger("Department name already exist");

        }
      );
      }

    }
  }

  get f() { return this.departmentMasterForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.departmentMasterForm.invalid) {
        return;
    }

  }


}
