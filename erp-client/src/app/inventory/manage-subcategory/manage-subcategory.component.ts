import { Optional, TemplateRef, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { InventoryService } from '../inventory.service';

@Component({
  selector: 'app-manage-subcategory',
  templateUrl: './manage-subcategory.component.html',
  styleUrls: ['./manage-subcategory.component.scss']
})
export class ManageSubcategoryComponent implements OnInit {

  subcategoryFrom: FormGroup;

  sub_categories;

  createFlag = true;

  subcategory_id;

  selected_category;

  categories_list;

  dailog_ref;

  // @ViewChild('#dialog') public model: TemplateRef<any>;
  
  constructor(private formBuilder: FormBuilder,
    private inventoryService: InventoryService,
    private nbtoastService: NbToastrService,
    private dialogService: NbDialogService,
    private routes: Router,
    @Optional() protected ref: NbDialogRef<any>) {
     
     }


  ngOnInit(): void {

    this.subcategoryFrom  =  this.formBuilder.group({
      subcategoryNameFormControl: ['', [Validators.required]],      
      subcategoryCodeFormControl: ['', [Validators.required]],   
      categoryNameFormControl: ['', [Validators.required]],
    });
    
    this.createFlag = true;

    this.inventoryService.getSubCategoryList().subscribe(
      (data) => {
          this.sub_categories = data;
      },
      (error) => {
          this.nbtoastService.danger(error,"Error")
      }
    )
    this.inventoryService.getCategoryList().subscribe(
      (data) => {
          this.categories_list = data;
      },
      (error) => {
          this.nbtoastService.danger(error,"Error")
      }
    )
  }

  open(dialog: TemplateRef<any>) {
    this.dailog_ref= this.dialogService.open(dialog, { context: this.categories_list })
    .onClose.subscribe(data => {
       this.selected_category = data       
       this.subcategoryFrom.controls['categoryNameFormControl'].setValue(data.category_name);
       
    }
    );
  }
  
  save_sub_category(): void{
    
    if( this.subcategoryFrom.dirty && this.subcategoryFrom.valid){
      let data = {
            sub_category_name: this.subcategoryFrom.get(['subcategoryNameFormControl']).value,            
            sub_category_code: this.subcategoryFrom.get(['subcategoryCodeFormControl']).value,
            category_id: this.selected_category.id,
      }
      this.inventoryService.saveSubCategory(data).subscribe(
        (data) => {
          this.nbtoastService.success("Saved Successfully");
          this.ngOnInit();
        },
        (error) =>{
          this.nbtoastService.danger(error);
        }
      )    
    }
    };
    update_sub_category(): void{
    
      if( this.subcategoryFrom.dirty && this.subcategoryFrom.valid){
        let data = {
              sub_category_name: this.subcategoryFrom.get(['subcategoryNameFormControl']).value,              
              sub_category_code: this.subcategoryFrom.get(['subcategoryCodeFormControl']).value,
              category_id: this.selected_category.id,
        }
        this.inventoryService.updateSubCategory(this.subcategory_id, data).subscribe(
          (data) => {
            this.nbtoastService.success("Saved Successfully");
            this.ngOnInit();
          },
          (error) =>{
            this.nbtoastService.danger(error);
          }
        )    
      }
      };

    selected_sub_category(data): any{
        this.subcategoryFrom.controls['subcategoryNameFormControl'].setValue(data.sub_category_name);        
        this.subcategoryFrom.controls['subcategoryCodeFormControl'].setValue(data.sub_category_code);
        this.subcategoryFrom.controls['categoryNameFormControl'].setValue(data.category.category_name);
        this.createFlag = !this.createFlag;
        this.subcategory_id = data.id
        this.selected_category = data.category
    }

    // selected_category(data,ref): any{
    //   this.nbtoastService.show(data);    
      
      
    // }

}
