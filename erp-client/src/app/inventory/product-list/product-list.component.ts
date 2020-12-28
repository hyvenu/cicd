import { isDefined } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { InventoryService } from '../inventory.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  settings = {
    // selectMode: 'multi',
    actions: {
      add: false,
      edit: false,
      delete: false,      
      },
    columns: {
      id: {
        title: 'id',
        hide:true
      },
      product_code: {
        title: 'Product Code',        
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          return `<a href="ManageProduct?id=${row.id}">${row.product_code}</a>`;
}
      },
      product_name: {
        title: 'Product Name',
      },
      description: {
        title: 'Description',
      },
      hsn_code: {
        title: 'Hsn Code',
      },
      category: {
        title: 'Category ',
        valuePrepareFunction: (value) => {  return value.category_name },
      },
      sub_category: {
        title: 'Sub Category',
        valuePrepareFunction: (value) => {   return value.sub_category_name },
      },
      product_price : {
        title:'price',
        valuePrepareFunction: (value) => { console.log(value); return value.length > 0 ?value[0].sell_price:""  },
      }
      
    },
  };

  data = [
  ]

  constructor(
    private formBuilder: FormBuilder,
    private inventoryService: InventoryService,
    private nbtoastService: NbToastrService,
    private dialogService: NbDialogService,
    private routes: Router,
  ) { }

  ngOnInit(): void {

    this.inventoryService.getProductList().subscribe(
      (data) => {
          this.data = data;
      },
      (error) => {
          this.nbtoastService.danger(error.error.detail);
      }
    )
  }

}
