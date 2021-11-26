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
  selector: 'app-purchase-invoice-page',
  templateUrl: './purchase-invoice-page.component.html',
  styleUrls: ['./purchase-invoice-page.component.scss']
})
export class PurchaseInvoicePageComponent implements OnInit {
  invoice_details: any;
  grandTotal: any;
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

    this.store_id = sessionStorage.getItem('store_id');
    console.log(this.store_id)

    const printBtn: HTMLElement = document.getElementById('print');
    printBtn.onclick = function () {
      printDiv('bill');
    };
    
    let invoice = this.route.snapshot.queryParams['id']
    
    if(invoice){
      this.purchaseService.getPODetailsInvoice(invoice).subscribe(
        (data)=>{
          console.log('data',data)
          this.invoice_details = data
          console.log(this.invoice_details)
          this.grandTotal = this.invoice_details.invoice_amount
          this.grandTotal = Math.round(this.grandTotal)
          this.vendor_name = this.invoice_details.vendor__vendor_name
          this.shipping_address = this.invoice_details.shipping_address
          this.payment = this.invoice_details.payment_terms
          //this.vendor_number = this.invoice_details.vendor__mobile
          
          this.order_details = this.invoice_details.order_details
          this.po_number = this.invoice_details.po_number

          // this.ld_clauses = this.invoice_details.ld_clauses
          // this.note  = this.invoice_details.note
          this.order_details = this.invoice_details.order_details  
          this.packing_gst = parseInt( this.invoice_details.packing_perct)
          this.packing_gst_amount = this.invoice_details.packing_amount
          this.packing_price = this.invoice_details.packing_amount

          // this.payment_terms = this.invoice_details.payment_terms
          this.po_date = moment(this.invoice_details.po_date).format("YYYY-MM-DD")
          // this.po_status = this.invoice_details.po_status
          // this.po_type = this.invoice_details.po_type
          
          
          this.shipping_method = this.invoice_details.transport_type
          // this.sub_total = this.invoice_details.sub_total
          // this.taxable_price = this.invoice_details.taxable_price
          // this.terms_conditions = this.invoice_details.terms_conditions
          this.total_price = this.invoice_details.total_amoun
          this.vendor_contact_name = this.invoice_details.vendor__vendor_name 
          // this.refNo = this.invoice_details.ref_no
          // this.transpotation = this.invoice_details.transpotation

          console.log('vendor no',this.invoice_details.vendor_id)
          this.purchaseService.getVendor(this.invoice_details.vendor_id).subscribe(
            (data)=>{
              console.log('vendor data',data);

              // this.poc_contact_no = data.poc_contact_no 
              this.gst_no = data.gst_no 
              this.state = data.state_name
              this.state_code = data.state_code
              this.vendor_number = data.mobile_no
              
              // this.payment_method = data.payment_method
              // this.regional_name = data.regional_name
              this.vendor_address = data.branch_ofc_addr
            }
          )

          
          // this.vendor_gst = this.invoice_details.vendor_gst
          
         
          // this.other_reference = this.invoice_details.other_reference
        
          this.disc_amount = this.invoice_details.discount;
          console.log("dis",this.disc_amount)
          // this.gst = this.invoice_details.gst
          this.sgst = this.invoice_details.sgst
          this.cgst = this.invoice_details.cgst
          this.igst = this.invoice_details.igst 
                 
          
        
        }
      )
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