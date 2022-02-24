import { InventoryService } from './../../inventory/inventory.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { AdminService } from 'src/app/admin/admin.service';
import { OrderService } from '../order.service';
import * as moment from 'moment';

@Component({
  selector: 'app-sales-bill-list',
  templateUrl: './sales-bill-list.component.html',
  styleUrls: ['./sales-bill-list.component.scss']
})
export class SalesBillListComponent implements OnInit {

  salesData = []
  salesSettings = {
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
        hide:true
      },
      invoice_no: {
        title: 'Invoice No.',
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          return `<a href="InvoicePage?id=${row.po_number}">${row.invoice_no}</a>`;
        }
      },
      po_date: {
        title: 'Invoice Date',
      },
      grand_total: {
        title: 'Grand Total',
      },
      exchange_count: {
        title: 'Exchanges',
      },
      refund_count: {
        title: 'Refunds',
      },

    },
  };

  salesExchangeData = []
  salesExchangeSettings = {
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
      exchange_number: {
        title: 'Exchange No.',
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          return `<a href="InvoicePage?eid=${row.exchange_number}">${row.exchange_number}</a>`;
        }
      },
      exchange_date: {
        title: 'Exchange Date',
      },
      grand_total: {
        title: 'Grand Total',
      },
      invoice_no__invoice_no: {
        title: 'Invoice No',
      }

    },
  };

  salesRefundData = []
  salesRefundSettings = {
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
      refund_number: {
        title: 'Refund No.',
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          return `<a href="InvoicePage?rid=${row.refund_number}">${row.refund_number}</a>`;
        }
      },
      refund_date: {
        title: 'Refund Date',
      },
      grand_total: {
        title: 'Grand Total',
      },
      invoice_no__invoice_no: {
        title: 'Invoice No',
      }

    },
  };



  constructor( private formBuilder: FormBuilder,
    private adminService: AdminService,
    private service: OrderService,
    private nbtoastService: NbToastrService,
    private dialogService: NbDialogService,
    private routes: Router,) { }

  ngOnInit(): void {
    this.service.getBillList().subscribe(
      (data) => {
          this.salesData = data.map(item => item.id != ""? {...item, po_date:moment(item.po_date).format("YYYY-MM-DD")}: item.po_date);

      },
      (error) => {
          this.nbtoastService.danger(error.error.detail);
      }
    )

    this.service.getBillExchangeList().subscribe(
      (data) => {
          this.salesExchangeData = data.map(item => item.id != ""? {...item, exchange_date:moment(item.exchange_date).format("YYYY-MM-DD")}: item.exchange_date);
      },
      (error) => {
          this.nbtoastService.danger(error.error.detail);
      }
    )
    this.service.getBillRefundList().subscribe(
      (data) => {
          this.salesRefundData = data.map(item => item.id != ""? {...item, refund_date:moment(item.refund_date).format("YYYY-MM-DD")}: item.refund_date);
      },
      (error) => {
          this.nbtoastService.danger(error.error.detail);
      }
    )

  }


  }




