import { Optional, Pipe, PipeTransform, TemplateRef, ViewChild ,ElementRef } from '@angular/core';
import { Component, OnInit, } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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

  searchCatgory;
  searchSubCategory:any;

  dailog_ref;
  selectedFiles = [];
  subcat_image: string;
  url:string;
  

  @ViewChild('myInput')
  myInputVariable: ElementRef;
  submitted: boolean = false;

  

  // resetFileUploader() { 
  //   this.Inputvar.nativeElement.value = null;
  // }

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
      subCategoryCodeFormControl: ['', [Validators.required]],   
      categoryNameFormControl: ['', [Validators.required]],
      subDescription: ['', [Validators.required]],
      subCatImageFormControl: ['',],        
      fileSource: new FormControl('',) 
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
      this.searchCatgory = ""
       this.selected_category = data       
       this.subcategoryFrom.controls['categoryNameFormControl'].setValue(data.category_name);
       
    }
    );
  }


  reset() {
    console.log(this.myInputVariable.nativeElement.files);
    this.myInputVariable.nativeElement.value = "";
    console.log(this.myInputVariable.nativeElement.files);
  }

  refresh(): void {
    window.location.reload();
  }
  
  save_sub_category(): void{
    
    if( this.subcategoryFrom.dirty && this.subcategoryFrom.valid){
      // let data = {
      //       sub_category_name: this.subcategoryFrom.get(['subcategoryNameFormControl']).value,            
      //       sub_category_code: this.subcategoryFrom.get(['subcategoryCodeFormControl']).value,
      //       sub_category_image: '',
      //       category_id: this.selected_category.id,
      // }
      let data = new FormData()
      data.append('sub_category_name', this.subcategoryFrom.get(['subcategoryNameFormControl']).value)
      data.append('sub_category_code', this.subcategoryFrom.get(['subCategoryCodeFormControl']).value)
      data.append('description', this.subcategoryFrom.get(['subDescription']).value)
      data.append('category_id', this.selected_category.id)
      if(this.selectedFiles.length){
        for(let i=0 ; i < this.selectedFiles.length ; i++)
          data.append('sub_category_image', this.selectedFiles[i],this.selectedFiles[i].name);
      }


      this.inventoryService.saveSubCategory(data).subscribe(
        (data) => {
          this.nbtoastService.success("Saved Successfully");
          this.subcat_image = null;
          this.subcategoryFrom.reset();
          this.myInputVariable.nativeElement.value = "";
          this.refresh()
          
          
          
          
        },
        (error) =>{
          if(error === "exist"){
            this.nbtoastService.danger("Sub Category Code or Subcategory Nmae already"+" "+error);
            }
            else{
              this.nbtoastService.danger(error);
            }
        }
      )    
    }
    };
    update_sub_category(): void{
    
      if( this.subcategoryFrom.valid){
        let data = new FormData()
            data.append('sub_category_name', this.subcategoryFrom.get(['subcategoryNameFormControl']).value)
            data.append('sub_category_code', this.subcategoryFrom.get(['subCategoryCodeFormControl']).value)
            data.append('category_id', this.selected_category.id)
            data.append('description', this.subcategoryFrom.get(['subDescription']).value)
        if(this.selectedFiles.length){
          for(let i=0 ; i < this.selectedFiles.length ; i++)
            data.append('sub_category_image', this.selectedFiles[i],this.selectedFiles[i].name);
        }
        this.inventoryService.updateSubCategory(this.subcategory_id, data).subscribe(
          (data) => {
            
            this.nbtoastService.success("SubCategory Updated Successfully");
            this.subcat_image = null;
            this.subcategoryFrom.reset();
            this.refresh()
            this.myInputVariable.nativeElement.value = "";
            
          
            
          },
          (error) =>{
            this.nbtoastService.danger(error);
          }
        )    
      }
      };

     

    selected_sub_category(data): any{
      
        this.subcategoryFrom.controls['subcategoryNameFormControl'].setValue(data.sub_category_name);        
        this.subcategoryFrom.controls['subCategoryCodeFormControl'].setValue(data.sub_category_code);
        this.subcategoryFrom.controls['categoryNameFormControl'].setValue(data.category.category_name);
        this.subcategoryFrom.controls['subDescription'].setValue(data.description);
        this.subcat_image = data.sub_category_image;
        this.createFlag = !this.createFlag;
        this.subcategory_id = data.id
        this.selected_category = data.category
    }

    onFileChange(event) {
      const reader = new FileReader();
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        // just checking if it is an image, ignore if you want      
        for(let i=0 ; i < event.target.files.length ;i++){ 
          this.selectedFiles.push(<File>event.target.files[i]);
        }
        reader.readAsDataURL(file);
        reader.onload = () => {
     
          this.subcat_image = reader.result as string;
       
          this.subcategoryFrom.patchValue({
            fileSource: reader.result
          });
     
        };
        
        
      }
      
      
    }
    // selected_category(data,ref): any{
    //   this.nbtoastService.show(data);    
      
      
    // }
    get f() { return this.subcategoryFrom.controls; }

onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.subcategoryFrom.invalid) {
        return;
    }
    if (!this.subcategoryFrom.invalid){
      return this.submitted = false;
    }

    
  
}

}
