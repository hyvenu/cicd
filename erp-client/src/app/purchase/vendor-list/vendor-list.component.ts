import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { PurchaseService } from '../purchase.service';


@Component({
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.scss']
})
export class VendorListComponent implements OnInit {

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
      vendor_code: {
        title: 'Vendor Code',        
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          return `<a href="ManageVendor?id=${row.id}">${row.vendor_code}</a>`;
        }
      },
      vendor_name: {
        title: 'Vendor Name',
      },
      vendor_type: {
        title: 'Vendor Type',
      },
      poc_name: {
        title: 'POC name',
      }
    },
  };

  data = [
  ]

  constructor( private formBuilder: FormBuilder,
    private purchaseService: PurchaseService,
    private nbtoastService: NbToastrService,
    private dialogService: NbDialogService,
    private routes: Router,) { }

  ngOnInit(): void {
    this.purchaseService.getVendorList().subscribe(
      (data) => {
          this.data = data;
      },
      (error) => {
          this.nbtoastService.danger(error.error.detail);
      }
    )
  }

}
