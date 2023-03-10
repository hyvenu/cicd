import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InventoryService } from '../inventory.service';
import { NbToastrService } from '@nebular/theme';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-manage-category',
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.scss']
})
export class ManageCategoryComponent implements OnInit {

  categoryFrom: FormGroup;

  categories;

  createFlag = true;

  category_id;

  searchCategory:any;
  submitted: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private inventoryService: InventoryService,
              private nbtoastService: NbToastrService,
              private routes: Router) {

               }

  ngOnInit(): void {
    this.categoryFrom  =  this.formBuilder.group({
      categoryNameFormControl: ['', [Validators.required]],
      categoryDescFormControl: ['', [Validators.required]],
      categoryCodeFormControl: ['', [Validators.required]],
      salesmarginFormControl:['',[Validators.required]],
    });
    this.createFlag = true;
    this.inventoryService.getCategoryList().subscribe(
      (data) => {
          this.categories = data;
      },
      (error) => {
          this.nbtoastService.danger(error,"Error")
      }
    )
    
  }

  save_category(): void{

    if( this.categoryFrom.dirty && this.categoryFrom.valid){
      let data = {
            category_name: this.categoryFrom.get(['categoryNameFormControl']).value,
            description: this.categoryFrom.get(['categoryDescFormControl']).value,
            category_code: this.categoryFrom.get(['categoryCodeFormControl']).value,
            sales_margin: this.categoryFrom.get(['salesmarginFormControl']).value,
      }
      this.inventoryService.saveCategory(data).subscribe(
        (data) => {
          this.nbtoastService.success("Saved Successfully");
          this.ngOnInit();
        },
        (error) =>{
          if(error === "exist"){
            this.nbtoastService.danger("Category Code or Category Name already"+" "+error);
            }
            else{
              this.nbtoastService.danger(error);
            }
        }
      )
    }
    };
    update_category(): void{

      if( this.categoryFrom.dirty && this.categoryFrom.valid){
        let data = {
              category_name: this.categoryFrom.get(['categoryNameFormControl']).value,
              description: this.categoryFrom.get(['categoryDescFormControl']).value,
              category_code: this.categoryFrom.get(['categoryCodeFormControl']).value,
              sales_margin: this.categoryFrom.get(['salesmarginFormControl']).value,
        }
        this.inventoryService.updateCategory(this.category_id, data).subscribe(
          (data) => {
            this.nbtoastService.success("Category Updated Successfully");
            this.ngOnInit();
          },
          (error) =>{
            this.nbtoastService.danger(error);
          }
        )
      }
      };

    selected_category(data): any{
        this.categoryFrom.controls['categoryNameFormControl'].setValue(data.category_name);
        this.categoryFrom.controls['categoryDescFormControl'].setValue(data.description);
        this.categoryFrom.controls['categoryCodeFormControl'].setValue(data.category_code);
        this.categoryFrom.controls['salesmarginFormControl'].setValue(data.sales_margin);
        this.createFlag = false;
        this.category_id = data.id
    }

    delete_category(category){
      const data = {
        "id" : category.category_id
      }
      this.inventoryService.removeFromCategory(data).subscribe(()=>{
        this.refresh();
      })
    }
    refresh(): void {
      window.location.reload();
    }

    get f() { return this.categoryFrom.controls; }

onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.categoryFrom.invalid) {
        return;
    }
    if (!this.categoryFrom.invalid){
      return this.submitted = false;
    }

    
  
}
}