import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { InventoryService } from 'src/app/inventory/inventory.service';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-designation',
  templateUrl: './designation.component.html',
  styleUrls: ['./designation.component.scss']
})
export class DesignationComponent implements OnInit {
  designationMasterForm: any;
  desg_id: any;
  submitted: boolean =false;

  constructor(private formBuilder: FormBuilder,
    private inventoryService: InventoryService,
    private sharedService: SharedService,
    private nbtoastService: NbToastrService,  
    private routes: Router,
    private route: ActivatedRoute,
   
    private cd: ChangeDetectorRef,
    private dialogService: NbDialogService,) { }

  ngOnInit(): void {
    this.designationMasterForm = this.formBuilder.group({
      designationCodeFormControl: ['', []],
      designationNameFormControl: ['', [Validators.required]],
      
 
     });

     let param = this.route.snapshot.queryParams['id'];

    if (param) {
      this.sharedService.getDesignationDetails(param).subscribe(
        (data) => {
          // this.purchaseOrderForm.controls['poTypeFormControl'].setValue(data.po_type);
          this.desg_id =  data.id;
          console.log("D id" + this.desg_id)
          this.designationMasterForm.controls['designationCodeFormControl'].setValue(data.designation_id);
          this.designationMasterForm.controls['designationNameFormControl'].setValue(data.designation_name);
          // this.departmentMasterForm.controls['categoryActivateFormControl'].setValue(data.active);
        });
      }
  }

  saveDes() {
    if(this.designationMasterForm.valid){
    console.log("Called save dept");
    const formData = new FormData();
    if (this.desg_id) {
      formData.append('id', this.desg_id);
      // formData.append('department_id', this.departmentMasterForm.controls['departmentCodeFormControl'].value);
      formData.append('designation_id', this.designationMasterForm.controls['designationCodeFormControl'].value);
    formData.append('designation_name', this.designationMasterForm.controls['designationNameFormControl'].value);
    // formData.append('active',this.departmentMasterForm.controls['categoryActivateFormControl'].value);

    this.sharedService.updateDesignation(formData,this.desg_id).subscribe(
      (data) => {
        this.nbtoastService.success("Designation Details updated Successfully")
        this.ngOnInit();
         this.routes.navigate(["/DesignationList"]);
        this.designationMasterForm.reset()
      },
      (error) => {
       
          this.nbtoastService.danger(error);
        
      }
    );
    }else{
    formData.append('designation_id', this.designationMasterForm.controls['designationCodeFormControl'].value);
    formData.append('designation_name', this.designationMasterForm.controls['designationNameFormControl'].value);
    // formData.append('active',this.departmentMasterForm.controls['categoryActivateFormControl'].value);  
    this.sharedService.saveDesignation(formData).subscribe(
      (data) => {
        this.nbtoastService.success("Designation Details Saved Successfully, ")
        this.designationMasterForm.reset()
        this.routes.navigateByUrl("/DesignationList");
        
      },
      (error) => {
        console.log(error)
        if(error === "exist"){
          this.nbtoastService.danger("Designation Name already"+" "+error);
          }
          else{
            this.nbtoastService.danger(error);
          }
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
    }else if(!this.designationMasterForm.invalid){
      this.submitted = false
    }

  }

}
