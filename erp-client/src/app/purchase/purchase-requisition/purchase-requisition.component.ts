import { Component, ElementRef, OnInit, ViewChild, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PurchaseService } from '../purchase.service';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { ChangeDetectorRef, TemplateRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { InventoryService } from 'src/app/inventory/inventory.service'
import { SharedService } from 'src/app/shared/shared.service';
import * as moment from 'moment';


@Component({
  selector: 'app-purchase-requisition',
  templateUrl: './purchase-requisition.component.html',
  styleUrls: ['./purchase-requisition.component.scss']
})
export class PurchaseRequisitionComponent implements OnInit {

  @ViewChild('date')
  myInputVariable: ElementRef;
  @ViewChild('requiredDate')
  requiredDate: ElementRef;
  IsPRInfo: boolean;
  prForm: FormGroup;
  dailog_ref;
  login_user;
  store_name;
  checked;
  pr_status;

  searchProduct;
  product_list;
  unit_list;
  department_list;
  selectedOption;
  pr_id;
  store_id;
  deleterow=false;
  selected_product_list = [];
  submitted: boolean=false;
  unit_name: any;
  dateofdata: Date;
  current_date :any = new Date();
  expiry_date: Date;
  date:boolean=false;
  flag:boolean=true;
  

  constructor(private formBuilder: FormBuilder,
    private purchaseService: PurchaseService,
    private inventoryService: InventoryService,
    private sharedService: SharedService,
    private nbtoastService: NbToastrService,
    private routes: Router,
    private route: ActivatedRoute,
    private dialogService: NbDialogService,
    private cd: ChangeDetectorRef,) {
    this.sharedService.getDepartmentList().subscribe(
      (dep_data) => {
        this.department_list = dep_data;
        console.log(this.department_list);
      },
      (error) => {
        this.nbtoastService.danger(error, "Error")
      }
    );

    this.inventoryService.getUnitMasterList().subscribe(
      (data) => {
        this.unit_list = data;
      },
      (error) => {
        this.nbtoastService.danger(error, "Error")
      }
    );
  }

  ngOnInit(): void {
    this.IsPRInfo = true;
    this.selected_product_list = [];
    console.log(sessionStorage.getItem("first_name"));
    this.login_user = sessionStorage.getItem("first_name");
    this.store_name = sessionStorage.getItem("store_name");
    this.store_id = sessionStorage.getItem("store_id");
    this.prForm = this.formBuilder.group({
      prNoFormControl: ['', [Validators.required]],
      prDateFormControl: ['', [Validators.required]],
      userFormControl: ['', [Validators.required]],
      departFormControl: ['', [Validators.required]],
      statusFormControl: ['', [Validators.required]],
      // qtyFormControl: ['', [Validators.required]],
    });

    this.prForm.controls['userFormControl'].setValue(this.login_user);

    let param1 = this.route.snapshot.queryParams["id"];
    if (param1) {
      this.flag = false
      this.purchaseService.getPRDetails(param1).subscribe((data) => {
        console.log(data)
        this.pr_id = data.id
        this.pr_status = data.status
        this.prForm.controls['prNoFormControl'].setValue(data.pr_no);
        this.prForm.controls['prDateFormControl'].setValue(moment(data.pr_date));
        this.prForm.controls['userFormControl'].setValue(data.created_user);
        this.selectedOption = data.dept__id;
        this.prForm.controls['statusFormControl'].setValue(data.status);
        // this.prForm.controls['departFormControl'].setValue(data.dept__department_name);
        //this.selected_product_list = data.selected_product_list;
        console.log(this.selected_product_list)
       data.selected_product_list.forEach(element => {
         console.log(element)
         this.selected_product_list.push({
           ...element,
           unit_name:element.unit__PrimaryUnit,
           expected_date:moment(element.expected_date),
           active:'',

        });
         })
       
        console.log(data.selected_product_list)
        

      });
    }
    // this.prForm.controls['departFormControl'].setValue(this.department_list)
    this.inventoryService.getProductList().subscribe(
      (data) => {
        this.product_list = data;
        console.log(data)
      },
      (error) => {
        this.nbtoastService.danger(error, "Error")
      }
    );
      
        // this.onChange()
      
      
  }

  onChange(date){
    
        console.log(new Date(date))
        this.dateofdata = new Date(date)
        console.log(this.dateofdata)
        console.log(this.current_date)
        if(moment(this.dateofdata).format("yyyy-MM-DD") < moment(this.current_date).format("yyyy-MM-DD") ){
          this.nbtoastService.danger("Date Of Request  Allows Only Present Or Future Date"); 
          this.myInputVariable.nativeElement.value = "";
          
        }

     
     
    }

    onChanges(date,item){
      let dd:any= new Date(date)
      this.expiry_date = new Date(date.expected_date)
      console.log(new Date(date))
      console.log(item)
      console.log((this.expiry_date))
        console.log(this.current_date)
        if(moment(dd).format("yyyy-MM-DD") < moment(this.current_date).format("yyyy-MM-DD") ){
          this.nbtoastService.danger("Date Of Request  Allows Only Present Or Future Date"); 
          this.requiredDate.nativeElement.value = "";
          this.date=true
        }
      }

   

  toggle(event) {
    this.checked = event.target.checked;

  }

  open(dialog: TemplateRef<any>) {
    this.dailog_ref = this.dialogService.open(dialog, { context: this.product_list })
      .onClose.subscribe(data => {
        this.searchProduct = ""
        //  this.product_list = data
        this.unit_name = data.product_price__unit__PrimaryUnit
        console.log(data)
        
        if(this.selected_product_list.some(element => element.product_name == data.product_name)){
          this.nbtoastService.danger("product name already exist");
        }else{
          
        this.selected_product_list.push({
          
          id: data.id,
          product_code: data.product_code,
          product_name: data.product_name,
          description: '',
          store: this.store_name,
          required_qty: data.product_price__qty,
          finished_qty:0,
          unit: data.product_price__unit,
          unit_name:this.unit_name,
          // unit_price:data.product_price__unit_price,
          expected_date: '',
          active:''
        });
      }
      });
    //  this.subcategoryFrom.controls['categoryNameFormControl'].setValue(data.category_name);
   
  }

  onDepartmentChange() {

  }

  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  approvePR(): any {
    const formData = this.saveFormData();
    formData.append('id', this.pr_id);
    formData.append('approved_by', this.login_user);
    formData.append('approved_date', this.formatDate(new Date()));

    this.purchaseService.approvePR(formData).subscribe(
      (data) => {
        this.nbtoastService.success("PR Details Approved Successfully, PR number is : " + data)
        this.ngOnInit();
        this.routes.navigate(['/PurchaseRequisitionList'])
      },
      (error) => {
        this.nbtoastService.danger(error.detail);
      }
    );
  }

  delete(id,item): any {
    const formData = new FormData()
    formData.append('id', id);
    if(id !== ""){
    this.purchaseService.deleteProductFromPR(formData).subscribe(
      (data) => {
        this.nbtoastService.success("Product deleted from PR Successfully, Product code is : " + data)
        this.selected_product_list = this.selected_product_list.filter(item =>
          item.id != id
        )
        
      },
      (error) => {
        this.nbtoastService.danger("unable to remove products");
      }
    )   }else{
      const index: number = this.selected_product_list.indexOf(item);
      if (index !== -1) {
          this.selected_product_list.splice(index, 1);
      } 
    }
  }

  remove_item(item): void{
    this.deleterow=false
    const index: number = this.selected_product_list.indexOf(item);
    if (index !== -1) {
        this.selected_product_list.splice(index, 1);
    } 
   

  
   
  }

  rejectPR():any {
    const formData = this.saveFormData();
    formData.append('id', this.pr_id);
    formData.append('approved_by', this.login_user);
    formData.append('approved_date', this.formatDate(new Date()));

    this.purchaseService.rejectPR(formData).subscribe(
      (data) => {
        this.nbtoastService.success("PR Details Rejected Successfully, PR number is : " + data)
        this.ngOnInit();
        this.routes.navigate(['/PurchaseRequisitionList'])
      },
      (error) => {
        this.nbtoastService.danger(error.detail);
      }
    );
  }



  savePR(): any {
    
    const formData = this.saveFormData();
    if (!this.selected_product_list.length ) {
      this.nbtoastService.danger('Please Enter At Least ONE Product in Details Section')
    }else{
      let dd:boolean;
      this.selected_product_list.forEach(
        a =>{
          if(!a.expected_date && !a.product_code && !a.product_name && !a.required_quantity){
            dd=false
            this.nbtoastService.danger('Please Provide Product  Details Section');
          }else if(a.expected_date == "NaN-NaN-NaN"){
            dd=false
            this.nbtoastService.danger('Please Provide Required Date in Details Section');
          }
          else{
            dd=true
          }
        }
      )
      console.log(dd)
      if(dd){

    this.purchaseService.savePR(formData).subscribe(
      (data) => {
        if(this.pr_id){
          this.nbtoastService.success("PR Details Updated Successfully, PR number is : " + data)
        }else{

       
        this.nbtoastService.success("PR Details Saved Successfully, PR number is : " + data)
        }
        
        this.routes.navigate(['/PurchaseRequisitionList'])
      },
      (error) => {
        this.nbtoastService.danger("Failed to Save");
      }
    );
      }
    }

  }

  print(){
    this.routes.navigateByUrl("/PrInvoice?id=" +this.pr_id)
  }

 


  private saveFormData() {
    this.onSubmit();
    // if(this.prForm.controls['qtyFormControl'].value != ""){
    const formData = new FormData();
    // console.log(this.formatDate(this.prForm.controls['prDateFormControl'].value))
    if (this.pr_id){
      formData.append('id', this.pr_id)
    }
    formData.append('pr_date', this.formatDate(this.prForm.controls['prDateFormControl'].value));
    formData.append('created_user', this.prForm.controls['userFormControl'].value);
    formData.append('dept', this.selectedOption);
    formData.append('store_id', this.store_id);

    this.selected_product_list.forEach((element) => {
      console.log(element.expected_date);
      element.expected_date = this.formatDate(element.expected_date);
      element.active = element.active.toString();
      console.log(element.expected_date);
    });

    formData.append('product_list', JSON.stringify(this.selected_product_list));
    // for ( const product in this.selected_product_list) {
    //   product.expected_date = this.formatDate(product.expected_date)
    // }
    console.log(this.selected_product_list);
    return formData;
  // }
  }

  get f() { return this.prForm.controls; }

onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.prForm.invalid) {
        return;
    }
    if (!this.prForm.invalid){
      return this.submitted = false;
    }

    
  
}
}