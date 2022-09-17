 
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
      // product_code: {
      //   title: 'Product Code',
      //   type: 'html',
      //   valuePrepareFunction: (cell, row) => {
      //     return `<a href="ManageProduct?id=${row.id}">${row.product_code}</a>`;
      // }
      // },
      product_name: {
        title: 'Product Name',
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          return `<a href="ManageProduct?id=${row.id}">${row.product_name}</a>`;
      }

      },
      description: {
        title: 'Description',
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          return `<p class="d-inline-block text-truncate"><small class="text-compress">${row.description}</small></p>`;
      }
      },
      hsn_code: {
        title: 'Hsn Code',
      },
      category__category_name: {
        title: 'Category ',
      },
      sub_category__sub_category_name: {
        title: 'Sub Category',
      },
      product_price__sell_price:{
        title: 'Sell price',

      },
      product_price__serial_number: {
        title: 'Serial Number',
      },

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

    this.inventoryService.getAllProductList().subscribe(
      (data) => {
          this.data = data;
      },
      (error) => {
          this.nbtoastService.danger(error.error.detail);
      }
    )
  }

}
