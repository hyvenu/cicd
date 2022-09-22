import { Component, OnInit } from '@angular/core';import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { PurchaseService } from '../purchase.service';


@Component({
  selector: 'app-grn-list',
  templateUrl: './grn-list.component.html',
  styleUrls: ['./grn-list.component.scss']
})
export class GrnListComponent implements OnInit {

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
      grn_code: {
        title: 'GRN Code',        
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          return `<a href="ManageGrn?id=${row.id}">${row.grn_code}</a>`;
        }
      },
      grn_date: {
        title: 'GRN Date',
      },
      po_number: {
        title: 'PO Number',
      },
      invoice_number: {
        title: 'Invoice Number',
      },
      invoice_date: {
        title: 'invoice Date',
      },
      grn_status: {
        title: 'GRN Status',
      }
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
    this.purchaseService.getGRNList().subscribe(
      (data) => {
          this.data = data;
      },
      (error) => {
          this.nbtoastService.danger(error.error.detail);
      }
    );
  }

}
