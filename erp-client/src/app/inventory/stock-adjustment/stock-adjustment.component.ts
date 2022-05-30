import { Component, OnInit, Optional, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import * as moment from 'moment';
// import { type } from 'os';
// import { element } from 'protractor';
import { InventoryService } from '../inventory.service';

@Component({
  selector: 'app-stock-adjustment',
  templateUrl: './stock-adjustment.component.html',
  styleUrls: ['./stock-adjustment.component.scss']
})
export class StockAdjustmentComponent implements OnInit {
  stockadjustmentForm: FormGroup;
  //dailog_ref: any;
  product_list: any = [];
  // searchProduct: string;
  // selected_Product: any;
  // ProductName_list: string | Partial<any>;
  // products:[];
  submitted: boolean=false;
  product_id:any;
  product_name: any;
  date: string | Blob;
  ob_qty: string | Blob;
  searchProduct: any;

  constructor(
    private formBuilder: FormBuilder,
    private inventoryService: InventoryService,
    private nbtoastService: NbToastrService,
    private dialogService: NbDialogService,
    private routes: Router,
    @Optional() protected ref: NbDialogRef<any>
  ) { }

  ngOnInit(): void {
    this.stockadjustmentForm = this.formBuilder.group({
      DateFormControl : [moment(new Date()).format("YYYY-MM-DD")],
      searchFormControl: ['']
    });
    this.product_list=[];

  }

load_products(){
  this.product_list = [];
  this.inventoryService.getProductWiseObQty(moment(this.stockadjustmentForm.controls['DateFormControl'].value).format("YYYY-MM-DD")).subscribe(
    (data) => {

      data.forEach(elm =>{
        const item = {
          id:elm.id,
          product_id:elm.product_id,
          product_name:elm.product_name,
          available_qty : elm.available_qty,
          ob_qty:elm.ob_qty == 0? elm.available_qty : elm.ob_qty ,
          adjusted_qty:elm.adjusted_qty
        }
        this.product_list.push(item);
      });
      this.product_list = this.sortBy("product_name",this.product_list);

    },
    (error) => {
      this.nbtoastService.danger(error);
    }
  )
}

sortBy(prop: string,arr) {
  return arr.sort((a, b) => a[prop] > b[prop] ? 1 : a[prop] === b[prop] ? 0 : -1);
}

calculate_adjusted_qty(item){
  // if(item.ob_qty > 0){
    item.adjusted_qty = item.available_qty -item.ob_qty ;
  // }else{
  //   item.adjusted_qty = 0;
  // }

}
save_Stock(): void{
console.log("date",this.stockadjustmentForm.get(['DateFormControl']).value)
console.log('product_list',this.product_list)
    const formData = new FormData();

    formData.append('date', this.stockadjustmentForm.get(['DateFormControl']).value),
    formData.append('product_list',JSON.stringify(this.product_list))


    if( this.stockadjustmentForm.valid){
      console.log("product",formData)
      this.inventoryService.saveStock1(formData).subscribe(
        (data) => {
          this.nbtoastService.success("Saved Successfully");
          this.ngOnInit();
        },
        (error) =>{
          if(error === "exist"){
            this.nbtoastService.danger("product stock with same Ob quantity already Exist"+" "+error);
            }
            else{
              this.nbtoastService.danger(error);
            }
        }
      )
    }
    }

  onSubmit(){
    this.submitted = true;

    // stop here if form is invalid
    if (this.stockadjustmentForm.invalid) {
        return;
    }
    if (!this.stockadjustmentForm.invalid){
      return this.submitted = false;
    }
}

}


