import { isDefined } from '@angular/compiler/src/util';
import { ChangeDetectorRef, TemplateRef } from '@angular/core';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { InventoryService } from '../inventory.service';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.css']
})
export class ManageProductComponent implements OnInit {

  productMasterFrom: FormGroup;

  createFlag = true;

  categories_list;
  
  sub_categories;
  
  dailog_ref;
  selected_category: any;
  selected_sub_ategory: any;
  atrribute_name: any;
  product_id:any;
  searchCategory:any;
  searchSubCategory:any;
  

  product_attributes = []
  product_packingtypes = []
  brand_list: any;
  selected_brand: any;
  product_list: string | Partial<any>;
  selected_product: any;
  selected_unit: any;
  unit_list: string | Partial<any>;
  IsProductInfo: boolean;
  IsProductImage: boolean;
  loading = false;

  imageForm: FormGroup = this.formBuilder.group({
    
    image: ['', Validators.required], //making the image required here  
    fileSource: new FormControl('', [Validators.required])
  })
  image_list: any;
  imgSrc: string;
  selectedFiles= [];

  @ViewChild('myInput')
  myInputVariable: ElementRef;
  submitted: boolean = false;
  category_id: any;
  sub_category_id: any;
  brand_id: any;

  constructor(
    private formBuilder: FormBuilder,
    private inventoryService: InventoryService,
    private nbtoastService: NbToastrService,
    private dialogService: NbDialogService,
    private routes: Router,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.IsProductImage = false;
    this.IsProductInfo = true;
    this.productMasterFrom  =  this.formBuilder.group({        
      categoryNameFormControl: ['', [Validators.required]],
      subcategoryNameFormControl: ['', [Validators.required]],
      productNameFormControl: ['', [Validators.required]],
      productCodeFormControl: ['', [Validators.required]],
      hsncodeFormControl: ['', [Validators.required]],
      descFormControl: ['', [Validators.required]],
      brandNameFormControl: ['', [Validators.required]],
      atrributeNameFormControl: [''],
      packtypeFormControl: [''],
      productsListFormControl: [''],
      image: ['', Validators.required], //making the image required here  
      fileSource: new FormControl('', [Validators.required])
    });

    this.product_attributes = [];

    this.product_packingtypes =[
    
    ]
    let param1 = this.route.snapshot.queryParams["id"];
    if (param1) {
        this.inventoryService.getProduct(param1).subscribe(
          (data) => {
            this.productMasterFrom.controls['categoryNameFormControl'].setValue(data.category.category_name);
            this.productMasterFrom.controls['subcategoryNameFormControl'].setValue(data.sub_category.sub_category_name);
            this.productMasterFrom.controls['brandNameFormControl'].setValue(data.brand.brand_name);
            this.productMasterFrom.controls['productNameFormControl'].setValue(data.product_name);
            this.productMasterFrom.controls['productCodeFormControl'].setValue(data.product_code);
            this.productMasterFrom.controls['hsncodeFormControl'].setValue(data.hsn_code);
            this.productMasterFrom.controls['descFormControl'].setValue(data.description);
            this.selected_category = data.category;
            this.selected_sub_ategory = data.sub_category;
            this.selected_brand = data.brand;
            this.product_id = data.id;
            this.image_list = data.product_images
            

            data.product_price.forEach(element => {
              this.product_packingtypes.push(
                {
                  id: element.id,
                  unit_id:element.unit.id,
                  qty: element.qty,
                  unit:element.unit.PrimaryUnit,
                  sell_price:element.sell_price,
                  bar_code: element.bar_code,
                  tax: element.tax,
                  unit_price: element.unit_price,
                  safety_stock_level: element.safety_stock_level,
                  serial_number: element.serial_number,
                }
              )
            });

            this.product_attributes = JSON.parse(data.product_attributes);
            // this.product_packingtypes = data.product_price;
      
            
          },
          (error) => {
            this.nbtoastService.danger(error.error.detail);
          }
        )
    }
    
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
    this.inventoryService.getBrandMasterList().subscribe(
      (data) => {
          this.brand_list = data;
      },
      (error) => {
          this.nbtoastService.danger(error,"Error")
      }
    )
     
  }

  cat_open(dialog: TemplateRef<any>) {
    this.dailog_ref= this.dialogService.open(dialog, { context: this.categories_list })
    .onClose.subscribe(data => {
       this.selected_category = data     
       this.category_id = data.id 
       console.log(this.category_id)
       this.productMasterFrom.controls['categoryNameFormControl'].setValue(data.category_name);
       this.getProductCode();
    }
    );
  }

  sub_open(dialog: TemplateRef<any>) {
    this.dailog_ref= this.dialogService.open(dialog, { context: this.sub_categories })
    .onClose.subscribe(data => {
       this.selected_sub_ategory = data 
       this.sub_category_id = data.id     
       this.productMasterFrom.controls['subcategoryNameFormControl'].setValue(data.sub_category_name);
       this.getProductCode();
    }
    );
  }

  brand_open(dialog: TemplateRef<any>) {
    this.dailog_ref= this.dialogService.open(dialog, { context: this.brand_list })
    .onClose.subscribe(data => {
       this.selected_brand = data  
       this.brand_id = data.id     
       this.productMasterFrom.controls['brandNameFormControl'].setValue(data.brand_name);
       this.getProductCode();
    }
    );
  }

  product_open(dialog: TemplateRef<any>) {

    this.inventoryService.getProductList().subscribe(
      (data) => {
          this.product_list = data;
          this.dailog_ref= this.dialogService.open(dialog, { context: this.product_list })
          .onClose.subscribe(data => {
             this.selected_product = data       
             this.productMasterFrom.controls['productsListFormControl'].setValue(data.product_code);       
          }
          );
      },
      (error) => {
        this.nbtoastService.danger(error.error.detail);
      }
    )


   
  }

  unit_open(dialog: TemplateRef<any>, type) {
    this.inventoryService.getUnitMasterList().subscribe(
      (data) => {
          this.unit_list = data;
          this.dailog_ref= this.dialogService.open(dialog, { context: this.unit_list })
          .onClose.subscribe(data => {
            console.log(data);
             this.selected_unit = data      
             type.unit = data.PrimaryUnit 
             type.unit_id = data.id
             // this.productMasterFrom.controls['productsListFormControl'].setValue(data.product_code);       
          }
          );
      },
      (error) => {
        this.nbtoastService.danger(error.error.detail);
      }
    )

  }

  add_attribute():any {
    const name = this.productMasterFrom.controls['atrributeNameFormControl'].value;
    const data = {name: name,value:''}
    this.product_attributes.push(data)
  }

  remove_attribute(item): void{
    const index: number = this.product_attributes.indexOf(item);
    if (index !== -1) {
        this.product_attributes.splice(index, 1);
    } 
  }

  add_types():any {
    
    const data = {unit:'',qty:'',sell_price:'',unit_id:'',tax:'',unit_price:'',safety_stock_level:'', serial_number:''}
    this.product_packingtypes.push(data)
  }

  remove_types(item): void{
    const index: number = this.product_packingtypes.indexOf(item);
    if (index !== -1) {
        this.product_packingtypes.splice(index, 1);
    } 
  }
 
  change_tab(){
    if (this.productMasterFrom.valid) {
        this.IsProductImage = !this.IsProductImage;
        this.IsProductInfo = !this.IsProductInfo;
    }
  }
  getProductCode():void {
    try{
    if (this.selected_category['category_code'] && this.selected_sub_ategory['sub_category_code'] && this.selected_brand['brand_name']){
      const data = {
        category_code: this.selected_category.category_code,
        sub_category_code: this.selected_sub_ategory.sub_category_code,
        brand: this.selected_brand.brand_name
      }
      this.inventoryService.getProductCode(data).subscribe(
        (data) =>{
          this.productMasterFrom.controls['productCodeFormControl'].setValue(data)
        },
        (error) => {
          this.nbtoastService.danger('Error while getting product code');
        }
      )
    }
  }catch(e){
      console.log(e);
  }
  };

  saveProduct():any {
    this.loading = true;
    const formData = new FormData();
    if (this.product_id){
      formData.append('id', this.product_id)
    }
    formData.append('category', this.category_id);
    formData.append('sub_category', this.sub_category_id);
    formData.append('brand', this.brand_id);
    formData.append('product_code', this.productMasterFrom.controls['productCodeFormControl'].value);
    formData.append('product_name', this.productMasterFrom.controls['productNameFormControl'].value);
    formData.append('hsn_code', this.productMasterFrom.controls['hsncodeFormControl'].value);
    formData.append('description', this.productMasterFrom.controls['descFormControl'].value);
    formData.append('product_attributes', JSON.stringify(this.product_attributes));
    formData.append('product_pack_types', JSON.stringify(this.product_packingtypes));
    // formData.append('product_images', this.productMasterFrom.controls['fileSource'].value);
    if(this.selectedFiles.length){
      for(let i=0 ; i < this.selectedFiles.length ; i++)
        formData.append('files[]', this.selectedFiles[i],this.selectedFiles[i].name);
    }

    this.inventoryService.saveProduct(formData).subscribe(
      (data) => {
        this.nbtoastService.success("Product Saved Successfully")
        this.imgSrc=null;
        this.loading = false;
        
        this.productMasterFrom.reset();
        this.routes.navigate(["/ManageProductMaster"]);
        
      },
      (error) =>{
        this.nbtoastService.danger(error.error.detail);
        this.loading = false;
      }
    )



  }

  reset() {
    console.log(this.myInputVariable.nativeElement.files);
    this.myInputVariable.nativeElement.value = "";
    console.log(this.myInputVariable.nativeElement.files);
  }

  onFileChange(event, field) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      // just checking if it is an image, ignore if you want      
      for(let i=0 ; i < event.target.files.length ;i++){ 
        this.selectedFiles.push(<File>event.target.files[i]);
      }
      reader.readAsDataURL(file);
      reader.onload = () => {
   
        this.imgSrc = reader.result as string;
     
        this.productMasterFrom.patchValue({
          fileSource: reader.result
        });
   
      };
      
    }
  }
  onSubmit() {
    const formData = new FormData();
    formData.append('product_id',this.product_id)
    Object.entries(this.imageForm.value).forEach(
      ([key, value]: any[]) => {
        formData.set(key, value);
      }
      //submit the form using formData
      // if you are using nodejs use something like multer
    )
    this.inventoryService.uploadImages(formData).subscribe(
      (data) => {

      },
      (error) => {

      }
    )
  }

  calculate_tax(item): void {
    item.sell_price = parseFloat(item.unit_price) + ((parseFloat(item.unit_price) * parseFloat(item.tax))/100.00)
  }
  
  delete_image(product_id, image_id): void {
    const data = { product_id: product_id, image_id : image_id}
    this.inventoryService.deleteImage(data).subscribe(
      (data) => {
        const objIndex = this.image_list.findIndex(obj => obj.id === image_id);
        // const index = this.image_list.indexOf(image_id, 0);
        if (objIndex > -1) {
          this.image_list.splice(objIndex, 1);
        }
      },
      (error) =>{
          this.nbtoastService.danger("Unable to delete image");
      }
    )
  }

  get f() { return this.productMasterFrom.controls; }

onSubmits() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.productMasterFrom.invalid) {
        return;
    }
    if (!this.productMasterFrom.invalid){
      return this.submitted = false;
    }

  
  
}



}
