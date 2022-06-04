
import { AnimationKeyframesSequenceMetadata } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { AdminService } from 'src/app/admin/admin.service';
import { InventoryService } from 'src/app/inventory/inventory.service';
import { printDiv } from 'src/app/sales/print_div';
import { PurchaseService } from '../purchase.service';
import * as moment from 'moment';

@Component({
  selector: 'app-pr-invoice',
  templateUrl: './pr-invoice.component.html',
  styleUrls: ['./pr-invoice.component.scss']
})
export class PrInvoiceComponent implements OnInit {


  store_id: any;
  store_name: any;
  store_no: any;
  store_email: any;
  store_gst: any;
  store_address: any;
  store_pincode: any;
  store_list: any=[];
  pr_details: any=[];
  pr_status: any;
  pr_no: any;
  pr_date: any;
  pr_user: any;
  dep_name: any;

  constructor(private formBuilder: FormBuilder,
    private purchaseService: PurchaseService,
    private adminService: AdminService,
    private routes: Router,
    private route: ActivatedRoute,
    private nbtoastService: NbToastrService,
    private dialogService: NbDialogService,
    private inventoryService: InventoryService,) { }

  ngOnInit(): void {

    this.store_id = sessionStorage.getItem('store_id');
    // console.log(this.store_id)

    const printBtn: HTMLElement = document.getElementById('print');
    printBtn.onclick = function () {
      printDiv('bill');
    };

    let invoice = this.route.snapshot.queryParams['id']
    console.log(invoice)

    if (invoice) {

      this.purchaseService.getPRDetails(invoice).subscribe((data) => {
        console.log(data)
        this.pr_status = data.status
        this.pr_no = data.pr_no
        this.pr_date = moment(data.pr_date).format("YYYY-MM-DD")
        this.pr_user = data.created_user
        this.dep_name = data.dept__department_name
        this.pr_details = data.selected_product_list
        console.log(data.selected_product_list)


      });
    }

    function printDiv(divId: string) {
      const css = `<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css"
      integrity="sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4" crossorigin="anonymous">
       `;
      const printContents = document.getElementById(divId).innerHTML;
      const pageContent = `<!DOCTYPE html><html><head>${css}</head><body onload="window.print()">${printContents}</html>`;
      let popupWindow: Window;
      if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
        popupWindow = window.open(
          '',
          '_blank',
          'scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no'
        );
        popupWindow.window.focus();
        popupWindow.document.write(pageContent);
        popupWindow.document.close();
        popupWindow.onbeforeunload = event => {
          popupWindow.close();
        };
        popupWindow.onabort = event => {
          popupWindow.document.close();
          popupWindow.close();
        };
      } else {
        popupWindow = window.open('', '_blank',);
        popupWindow.document.open();
        popupWindow.document.write(pageContent);
        popupWindow.document.close();
      }

    }

    this.adminService.getStoreDetails(this.store_id).subscribe(
      data=>{
        console.log(data)
        this.store_list = data
        console.log(this.store_list)
        this.store_name = this.store_list[0].store_name
        this.store_address = this.store_list[0].address
        this.store_pincode = this.store_list[0].pin_code
        this.store_no = this.store_list[0].store_number
        console.log(this.store_name)

        this.store_email = this.store_list[0].email
        this.store_gst =  this.store_list[0].gst_no
      }
    )
  }

}
