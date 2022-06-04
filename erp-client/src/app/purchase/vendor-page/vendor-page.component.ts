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
import { ThrowStmt } from '@angular/compiler';


@Component({
  selector: 'app-vendor-page',
  templateUrl: './vendor-page.component.html',
  styleUrls: ['./vendor-page.component.scss']
})
export class VendorPageComponent implements OnInit {

  vendor_payment_detail:any;

  invoice_details: any;
  grandTotal: number = 0;
  vendor_name: any;
  vendor_phone_no:any;
  shipping_phone_no:any;
  shipping_address: any;
  vendor_number: any;
  gst_no: any;
  po_number: any;
  po_date: any;
  order: any;

  store_id: any;
  store_name: any;
  address: any;
  store_list: any;
  sgst: any;
  cgst: any;
  igst: any;
  disc_amount: any;
  state: any;
  state_code: any;
  vendor_contact_name: any;
  shipping_method: any;
  order_details: any;
  packing_gst_amount: any;
  packing_price: any;
  packing_gst: number;
  total_price: any;
  vendor_address: any;
  store_no: any;
  store_email: any;
  store_gst: any;
  store_address: any;
  store_pincode: any;
  payment: any;

  constructor(private formBuilder: FormBuilder,
    private purchaseService: PurchaseService,
    private adminService: AdminService,
    private routes: Router,
    private route: ActivatedRoute,
    private nbtoastService: NbToastrService,
    private dialogService: NbDialogService,
    private inventoryService: InventoryService,) { }

  ngOnInit(): void {

    this.store_id = localStorage.getItem('store_id');
    console.log(this.store_id)

    const printBtn: HTMLElement = document.getElementById('print');
    printBtn.onclick = function () {
      printDiv('bill');
    };

    let invoice = this.route.snapshot.queryParams['id']

    if(invoice){
      this.purchaseService.getVendorPaymentListById(invoice).subscribe((data) => {
        console.log("VENDOR PAYMENT LIST",data)
        this.vendor_payment_detail = data;

        this.vendor_payment_detail.v_list.forEach(element => {
          this.grandTotal += (Number(element.payment_amount))
        });

        //this.grandTotal = parseFloat(this.grandTotal).toFixed(2)
        console.log("GRAND TOTAL",this.grandTotal)

        this.purchaseService.getVendorByCode(data.vendor_code).subscribe(
          (data)=>{
            console.log('vendor data',data);

            this.gst_no = data.gst_no
            this.state = data.state_name
            this.state_code = data.state_code
            this.vendor_number = data.mobile_no
            this.vendor_address = data.branch_ofc_addr
          }
        )

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
        this.address = this.store_list[0].address
        this.store_email = this.store_list[0].email
        this.store_gst =  this.store_list[0].gst_no
      }
    )



  }

}

