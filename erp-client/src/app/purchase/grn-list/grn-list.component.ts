import { Component, OnInit } from '@angular/core';

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
          return `<a href="ManageGRN?id=${row.id}">${row.grn_code}</a>`;
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
      }
    },
  };

  data = [
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
