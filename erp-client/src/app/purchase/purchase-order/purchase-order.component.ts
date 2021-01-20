import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { InventoryService } from 'src/app/inventory/inventory.service';
import { PurchaseService } from '../purchase.service';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss']
})
export class PurchaseOrderComponent implements OnInit {

  purchaseOrderForm : FormGroup;
  po_type_list = [
    { 'po_type_value':'PO','po_type_name':'Purchase Order' }
  ]
  selectedPOType:any;

  transport_type_list = [
    { 'key':'BY_ROAD','value':'By Road'},
    { 'key':'BY_AIR','value':'By Air'},
    { 'key':'BY_SEA','value':'By Sea'},
    { 'key':'OTHERS','value':'Others'},
  ]

  payments_terms_list = [
    { key: "PAYMENT_TERMS_1", value: '10% advance & 90% after Receipt of materials' },
    { key: "PAYMENT_TERMS_2", value: '100% against material receipt' },
    { key: "PAYMENT_TERMS_3", value: 'Wholese credit for 30 days of material receiptller' },
  ]

  selectedTransportType: any;
  vendor_list: [];
  selected_vendor: any;
  selected_product_list= [
    
  ];
  dailog_ref: any;
  product_list: [];
  unit_list: [];



  constructor(
                private formBuilder: FormBuilder,
                private purchaseService: PurchaseService,
                private routes: Router,
                private route: ActivatedRoute,
                private nbtoastService: NbToastrService,
                private dialogService: NbDialogService,
                private inventoryService: InventoryService,
              ) { }

  ngOnInit(): void {

    this.purchaseOrderForm = this.formBuilder.group(
      {
        poTypeFormControl: ['',[Validators.required]],
        poDateFormControl: ['',[Validators.required]],
        poNumberFormControl: ['',[Validators.required]],
        userFormControl: ['',[Validators.required]],
        transportTypeFormControl: ['',[Validators.required]],
        vendorCodeFormControl: ['',[Validators.required]],
        vendorNameFormControl: ['',[Validators.required]],
        paymentTermsFormControl: ['',[Validators.required]],
        otherRefFormControl: ['',[Validators.required]],
        termsDeliveryFormControl: [''],
        noteFormControl: ['',[Validators.required]],
      }
    );
    this.purchaseOrderForm.controls['userFormControl'].setValue(sessionStorage.getItem('first_name'));

    this.purchaseService.getVendorList().subscribe(
      (data) =>{
        this.vendor_list = data;
      },
      (error) => {
        this.nbtoastService.danger("Error while getting vendor list")
      }
    )
    this.inventoryService.getProductList().subscribe(
      (data) => {
        this.product_list = data;
      },
      (error) => {
        this.nbtoastService.danger(error, "Error")
      }
    );

    this.inventoryService.getUnitMasterList().subscribe(
      (data) => {
        this.unit_list = data;
      },
      (error) => {
        this.nbtoastService.danger(error, "Error")
      }
    );

  }

  vendor_open(dialog: TemplateRef<any>) {
    this.dailog_ref = this.dialogService.open(dialog, { context: this.vendor_list })
    .onClose.subscribe(data => {
       this.selected_vendor = data       
       this.purchaseOrderForm.controls['vendorCodeFormControl'].setValue(data.vendor_code);
       this.purchaseOrderForm.controls['vendorNameFormControl'].setValue(data.vendor_name);
       this.purchaseOrderForm.controls['paymentTermsFormControl'].setValue(data.payment_terms);
       
    }
    );
  }

  product_open(dialog: TemplateRef<any>) {
    this.dailog_ref = this.dialogService.open(dialog, { context: this.product_list })
      .onClose.subscribe(data => {
        //  this.product_list = data
        this.selected_product_list.push({
          id: data.id,
          product_code: data.product_code,
          product_name: data.product_name,
          description: data.product_description,
          qty: 0,
          unit: '',
          expected_date: '',
          unit_price:0,
          gst:0,
          amount:0,
          discount:0,
          discount_amount:0,
          gst_amount:0,

        });
      });
    //  this.subcategoryFrom.controls['categoryNameFormControl'].setValue(data.category_name);
   
  }

  calculate_sub_total(item): any {
    console.log(item);
      if(item.unit_price > 0 && item.qty > 0){
        item.amount = (item.unit_price * item.qty) * 1.00
        item.discount_amount = item.amount - ((item.amount * item.discount) / 100.00)
        item.gst_amount = item.amount + ((item.amount * item.gst) / 100.00)
      }
  }

}
