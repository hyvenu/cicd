import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { PurchaseService } from '../purchase.service';

@Component({
  selector: 'app-vendor-payment-list',
  templateUrl: './vendor-payment-list.component.html',
  styleUrls: ['./vendor-payment-list.component.scss']
})
export class VendorPaymentListComponent implements OnInit {
/*

'id',
            'vendor_payment_code',
            'vendor_code',
            'vendor_name'
            */
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
      vendor_payment_code: {
        title: 'Vendor Payment Code',
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          return `<a href="VendorPayment?id=${row.vendor_payment_code}">${row.vendor_payment_code}</a>`;
        }
      },
      vendor_name: {
        title: 'Vendor Name',
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          return `${row.vendor_name}-${row.vendor_code}`;
        }
      },
      vendor_code: {
        title: 'Vendor Code(Print)',
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          return `<a href="VendorPage?id=${row.vendor_payment_code}">PRINT</a>`;
        }
      },

    },
  };

  data = [
  ]
  constructor(private formBuilder: FormBuilder,
    private purchaseService: PurchaseService,
    private nbtoastService: NbToastrService,
    private dialogService: NbDialogService,
    private routes: Router,) {

  }

  ngOnInit(): void {
    this.purchaseService.getVendorPaymentList().subscribe(
      (data) => {
          this.data = data;
      },
      (error) => {
          this.nbtoastService.danger(error.error.detail);
      }
    );
  }

}
