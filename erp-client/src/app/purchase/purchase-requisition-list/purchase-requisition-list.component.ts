import { Component, OnInit } from '@angular/core';
import {NbDatepickerModule} from '@nebular/theme';


import { isDefined } from '@angular/compiler/src/util';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { PurchaseService } from '../purchase.service';

@Component({
  selector: 'app-purchase-requisition-list',
  templateUrl: './purchase-requisition-list.component.html',
  styleUrls: ['./purchase-requisition-list.component.scss']
})
export class PurchaseRequisitionListComponent implements OnInit {

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
      pr_no: {
        title: 'PR Number',        
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          return `<a href="PurchaseRequisition?id=${row.id}">${row.pr_no}</a>`;
        }
      },
      pr_date: {
        title: 'PR Date',
      },
      dept__department_name: {
        title: 'Department',
      }
    },
  };
  
  constructor(private formBuilder: FormBuilder,
    private purchaseService: PurchaseService,
    private nbtoastService: NbToastrService,
    private dialogService: NbDialogService,
    private routes: Router,) {

     }

     data = [
    ]
  

  ngOnInit(): void {
    this.purchaseService.getPRList().subscribe(
      (data) => {
          this.data = data;
      },
      (error) => {
          this.nbtoastService.danger(error.error.detail);
      }
    )
  }

}
