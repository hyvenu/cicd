import { AnimationKeyframesSequenceMetadata } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { AdminService } from 'src/app/admin/admin.service';
import { InventoryService } from 'src/app/inventory/inventory.service';
import { printDiv } from 'src/app/sales/print_div';
import { PurchaseService } from '../purchase.service';


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
          
          this.invoice_details = data
          console.log('invoice data',this.invoice_details)
          this.grandTotal = this.invoice_details.invoice_amount
          this.vendor_name = this.invoice_details.vendor__vendor_name
          this.shipping_address = this.invoice_details.shipping_address
         // this.vendor_number = this.invoice_details.vendor__mobile_no
          this.gst_no = this.invoice_details.vendor__gst_no
          this.po_number = this.invoice_details.po_number
          this.po_date = this.invoice_details.po_date
          this.shipping_phone_no = this.invoice_details.mobile_no;

          this.purchaseService.getVendor(this.invoice_details.vendor_id).subscribe(
            (data)=>{
              console.log('vendor data',data)
              this.vendor_number= data.mobile_no;
            }
          )
          this.disc_amount = this.invoice_details.order_details[0].disc_amount;
          console.log(this.disc_amount)
          this.sgst = this.invoice_details.sgst
          this.cgst = this.invoice_details.cgst
          this.igst = this.invoice_details.igst
          
          
          
          
          // this.invoice_date= this.invoice_details.po_date
        
        
          

        }
      )
    }

    this.adminService.getStoreDetails(this.store_id).subscribe(
      data=>{
        console.log(data)
        this.store_list = data
        console.log(this.store_list)
        this.store_name = this.store_list[0].store_name
        console.log(this.store_name)
        this.address = this.store_list[0].address
      }
    )
    


  }

}
