import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { InventoryService } from 'src/app/inventory/inventory.service';
import { PurchaseService } from '../purchase.service';

@Component({
  selector: 'app-purchase-order-list',
  templateUrl: './purchase-order-list.component.html',
  styleUrls: ['./purchase-order-list.component.scss']
})
export class PurchaseOrderListComponent implements OnInit {
  po_list: [];

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
      po_number: {
        title: 'PO Number',        
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          return `<a href="PurchaseOrder?id=${row.id}">${row.po_number}</a>`;
      }
      },
      po_date: {
        title: 'PO Date',
      },
      invoice_amount: {
        title: 'Invoice Amount',
      },
      vendor__vendor_name:{
        title: 'Vendor Name'
      }
       
      
    },
  };

  constructor(
    private formBuilder: FormBuilder,
    private purchaseService: PurchaseService,
    private routes: Router,
    private route: ActivatedRoute,
    private nbtoastService: NbToastrService,
    private dialogService: NbDialogService,
    private inventoryService: InventoryService,
  ) { }

  ngOnInit(): void {
    this.purchaseService.getPOList().subscribe(
      (data) => {
        this.po_list = data;
      },
      (error) => {
        this.nbtoastService.danger("Unable to get PO List")
      }
    )
  }

}
