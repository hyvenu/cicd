import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { InventoryService } from '../inventory.service';

@Component({
  selector: 'app-manage-unitmaster',
  templateUrl: './manage-unitmaster.component.html',
  styleUrls: ['./manage-unitmaster.component.scss']
})
export class ManageUnitmasterComponent implements OnInit {

  unitMasterFrom: FormGroup;
  createFlag = true;
  unitMasterList;
  unit_id;
  submitted: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private inventoryService: InventoryService,
    private nbtoastService: NbToastrService,
    private dialogService: NbDialogService,
    private routes: Router,
  ) { }

  ngOnInit(): void {
    this.unitMasterFrom  =  this.formBuilder.group({
      primaryUnitFormControl: ['', [Validators.required]],      
      secondaryUnitFormControl: ['', [Validators.required]],         
    });
    
    this.createFlag = true;

    this.inventoryService.getUnitMasterList().subscribe(
      (data) => {
          this.unitMasterList = data;
      },
      (error) => {
          this.nbtoastService.danger(error,"Error")
      }
    )

  }
  save_unit(): void{
    
    if( this.unitMasterFrom.dirty && this.unitMasterFrom.valid){
      let data = {
            PrimaryUnit: this.unitMasterFrom.get(['primaryUnitFormControl']).value,            
            SecondaryUnit: this.unitMasterFrom.get(['secondaryUnitFormControl']).value,            
      }
      this.inventoryService.saveUnit(data).subscribe(
        (data) => {
          this.nbtoastService.success("Saved Successfully");
          this.ngOnInit();
        },
        (error) =>{
          if(error === "exist"){
            this.nbtoastService.danger("Primary Unit or Secondary Unit already"+" "+error);
            }
            else{
              this.nbtoastService.danger(error);
            }
        }
      )    
    }
    };
    update_unit(): void{
    
      if( this.unitMasterFrom.dirty && this.unitMasterFrom.valid){
        let data = {
              PrimaryUnit: this.unitMasterFrom.get(['primaryUnitFormControl']).value,              
              SecondaryUnit: this.unitMasterFrom.get(['secondaryUnitFormControl']).value,
              id: this.unit_id,
        }
        this.inventoryService.updateUnit(this.unit_id, data).subscribe(
          (data) => {
            this.nbtoastService.success("Unit Updated Successfully");
            this.ngOnInit();
          },
          (error) =>{
            this.nbtoastService.danger(error);
          }
        )    
      }
      };

      selected_unit(data): any{
        this.unitMasterFrom.controls['primaryUnitFormControl'].setValue(data.PrimaryUnit);        
        this.unitMasterFrom.controls['secondaryUnitFormControl'].setValue(data.SecondaryUnit);
        
        this.createFlag = !this.createFlag;
        this.unit_id = data.id        
    }

    get f() { return this.unitMasterFrom.controls; }

onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.unitMasterFrom.invalid) {
        return;
    }
    if (!this.unitMasterFrom.invalid){
      return this.submitted = false;
    }

    
  
}

}
