import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { InventoryService } from '../inventory.service';

@Component({
  selector: 'app-manage-brand',
  templateUrl: './manage-brand.component.html',
  styleUrls: ['./manage-brand.component.scss']
})
export class ManageBrandComponent implements OnInit {

  brandMasterFrom: FormGroup;
  createFlag = true;
  brandMasterList;
  brand_id;
  brand_image;
  searchBrand;

  constructor(
    private formBuilder: FormBuilder,
    private inventoryService: InventoryService,
    private nbtoastService: NbToastrService,
    private dialogService: NbDialogService,
    private routes: Router,
  ) { }

  ngOnInit(): void {
    this.brandMasterFrom  =  this.formBuilder.group({
      brandnameFormControl: ['', [Validators.required]],      
      brandImageFormControl: ['',],        
      fileSource: new FormControl('',) 
    });
    this.createFlag = true;

    this.inventoryService.getBrandMasterList().subscribe(
      (data) => {
          this.brandMasterList = data;
      },
      (error) => {
          this.nbtoastService.danger(error,"Error")
      }
    );


  }

  onChange(event) {
    console.log('image');
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      
      this.brandMasterFrom.get('brandImageFormControl').setValue(file);
      console.log(file);
      this.brand_image = file.name;
    }
    const reader = new FileReader();
    
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
    
      reader.onload = () => {
   
        this.brand_image = reader.result as string;
     
        this.brandMasterFrom.patchValue({
          brandImageFormControl: reader.result
        });
   
      };
    }
   
  
  }
 

  save_brand(): void{
    
    if( this.brandMasterFrom.dirty && this.brandMasterFrom.valid){
      // let data = {
      //       brand_name: this.brandMasterFrom.get(['primaryUnitFormControl']).value,            
      //       SecondaryUnit: this.brandMasterFrom.get(['secondaryUnitFormControl']).value,            
      // }
      const data = new FormData();
      data.append('brand_name', this.brandMasterFrom.controls['brandnameFormControl'].value)
      data.append('brand_image', this.brandMasterFrom.controls['brandImageFormControl'].value)

      this.inventoryService.saveBrand(data).subscribe(
        (data) => {
          this.nbtoastService.success("Saved Successfully");
          this.ngOnInit();
        },
        (error) =>{
          this.nbtoastService.danger(error.error.detail);
        }
      )    
    }
    };
    update_brand(): void{
    
      if( this.brandMasterFrom.dirty && this.brandMasterFrom.valid){
        
        const data = new FormData();
        data.append('brand_name', this.brandMasterFrom.controls['brandnameFormControl'].value)
        data.append('brand_image', this.brandMasterFrom.controls['brandImageFormControl'].value)

        this.inventoryService.updateBrand(this.brand_id, data).subscribe(
          (data) => {
            this.nbtoastService.success("Saved Successfully");
            this.ngOnInit();
          },
          (error) =>{
            this.nbtoastService.danger(error.error.detail);
          }
        )    
      }
      };
      selected_brand(data): any{
        this.brandMasterFrom.controls['brandnameFormControl'].setValue(data.brand_name);        
        this.createFlag = false;

        this.brand_id = data.id  
        this.brand_image = data.brand_image;
        console.log(data.brand_image);
        const reader = new FileReader();
        reader.readAsDataURL(data.brand_image);
    
        reader.onload = () => {
     
          this.brand_image = reader.result as string;
          this.brandMasterFrom.controls['brandImageFormControl'].setValue(this.brand_image);
          this.brandMasterFrom.patchValue({
            brandImageFormControl: reader.result
          });
     
        };
        // this.brandMasterFrom.patchValue({
        //   brandImageFormControl : data.brand_image,
        // }
        // )
        
        // this.brandMasterFrom.controls['brandImageFormControl'].setValue(data.brand_image);
        
        
              
    }  
}
