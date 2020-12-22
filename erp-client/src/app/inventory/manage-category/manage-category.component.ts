import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InventoryService } from '../inventory.service';
import { NbToastrService } from '@nebular/theme';
@Component({
  selector: 'app-manage-category', 
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.scss']
})
export class ManageCategoryComponent implements OnInit {

  categoryFrom: FormGroup;

  categories;

  constructor(private formBuilder: FormBuilder,
              private inventoryService: InventoryService,
              private nbtoastService: NbToastrService,
              private routes: Router) {
                this.categoryFrom  =  this.formBuilder.group({
                  categoryNameFormControl: ['', [Validators.required]],
                  categoryDescFormControl: ['', [Validators.required]],      
                  categoryCodeFormControl: ['', [Validators.required]],   
                });
               }

  ngOnInit(): void {
    
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
      }
      this.inventoryService.saveCategory(data).subscribe(
        (data) => {
          this.nbtoastService.success("Saved Successfully");
          this.ngOnInit();
        },
        (error) =>{
          this.nbtoastService.danger(error);
        }
      )    
    }

  }

}
