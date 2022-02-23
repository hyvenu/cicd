import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { InventoryService } from 'src/app/inventory/inventory.service';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef, TemplateRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Identifiers } from '@angular/compiler';
import { SharedService } from 'src/app/shared/shared.service';

import { debounceTime, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-designation',
  templateUrl: './designation.component.html',
  styleUrls: ['./designation.component.scss']
})
export class DesignationComponent implements OnInit {
  designationMasterForm: FormGroup;

  designation_id: any;
  marked = true;
  submitted=false;
  createFlag=true;



  constructor(private formBuilder: FormBuilder,
    private inventoryService: InventoryService,
    private sharedService: SharedService,
    private http:HttpClient,
    private nbtoastService: NbToastrService,
    private routes: Router,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private dialogService: NbDialogService,) { }

  ngOnInit(): void {

    this.designationMasterForm = this.formBuilder.group({
      designationCodeFormControl: ['', []],
      designationNameFormControl: ['', [Validators.required]],
      categoryActivateFormControl:[''],
    });

    let param = this.route.snapshot.queryParams['id'];

    if (param) {
      this.sharedService.getDesignationDetails(param).subscribe(
        (data) => {
          // this.purchaseOrderForm.controls['poTypeFormControl'].setValue(data.po_type);
          this.createFlag = !this.createFlag;
          this.designation_id =  data.id;


          this.designationMasterForm.controls['designationCodeFormControl'].setValue(data.designation_code);
          // this.gradeMasterForm.controls['gradeNameFormControl'].setValue(data.grade_name);
          this.designationMasterForm.controls['designationNameFormControl'].setValue(data.designation_name);
           this.designationMasterForm.controls['categoryActivateFormControl'].setValue(data.active);
        });
      }


  }
  get designationName(){
    return this.designationMasterForm.get('designationNameFormControl') ;
  }

  update(){
    if(this.designationMasterForm.valid){
      const formData = new FormData();
      if (this.designation_id) {
        formData.append('id', this.designation_id);
        formData.append('designation_code', this.designationMasterForm.controls['designationCodeFormControl'].value);
        formData.append('designation_name', this.designationMasterForm.controls['designationNameFormControl'].value);
        formData.append('active',this.designationMasterForm.controls['categoryActivateFormControl'].value);
        console.log("grade id - " + this.designation_id);
        this.sharedService.updateDesignation(formData, this.designation_id).subscribe(
          (data) => {

            this.nbtoastService.success("Designation Details Updated Successfully")
            this.reset();
            this.routes.navigate(["/DesignationList"]);

          },
          (error) => {
            this.nbtoastService.danger("Designation already exist");
            console.log('update err',error)
          }
        );
      } else {
        formData.append('designation_code', this.designationMasterForm.controls['designationCodeFormControl'].value);
        formData.append('designation_name', this.designationMasterForm.controls['designationNameFormControl'].value);
        formData.append('active',this.designationMasterForm.controls['categoryActivateFormControl'].value);
        this.sharedService.saveDesignation(formData).subscribe(
          (data) => {
            this.nbtoastService.success("Designation Details Saved Successfully")
            this.reset();
            this.routes.navigate(["/DesignationList"]);
          },
          (error) => {
            console.log('save err',error);
            this.nbtoastService.danger("Designation already exist");

          }
        );
      }
    }
  }

  saveDesignation() {
    if(this.designationMasterForm.valid){
    const formData = new FormData();
    if (this.designation_id) {
      formData.append('id', this.designation_id);
      formData.append('designation_code', this.designationMasterForm.controls['designationCodeFormControl'].value);
      formData.append('designation_name', this.designationMasterForm.controls['designationNameFormControl'].value);
      formData.append('active',this.designationMasterForm.controls['categoryActivateFormControl'].value);
      console.log("grade id - " + this.designation_id);
      this.sharedService.updateDesignation(formData, this.designation_id).subscribe(
        (data) => {

          this.nbtoastService.success("Designation Details Updated Successfully")
          this.reset();
          this.routes.navigate(["/DesignationList"]);

        },
        (error) => {
          this.nbtoastService.danger("Designation already exist");
          console.log(error)
        }
      );
    } else {
      formData.append('designation_code', this.designationMasterForm.controls['designationCodeFormControl'].value);
      formData.append('designation_name', this.designationMasterForm.controls['designationNameFormControl'].value);
      formData.append('active',this.designationMasterForm.controls['categoryActivateFormControl'].value);
      this.sharedService.saveDesignation(formData).subscribe(
        (data) => {
          this.nbtoastService.success("Designation Details Saved Successfully")
          this.reset();
          this.routes.navigate(["/DesignationList"]);
        },
        (error) => {
          console.log(error);
          this.nbtoastService.danger("Designation already exist");

        }
      );
    }
  }
  }

  get f() { return this.designationMasterForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.designationMasterForm.invalid) {
        return;
    }

  }

  reset(){
    this.designationMasterForm.reset();
  }

}
