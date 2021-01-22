import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NbComponentSize, NbDialogService, NbToastrService } from '@nebular/theme';
import { InventoryService } from 'src/app/inventory/inventory.service';
import { PurchaseService } from '../purchase.service';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss']
})
export class PurchaseOrderComponent implements OnInit {

  purchaseOrderForm: FormGroup;
  po_type_list = [
    { 'po_type_value': 'PO', 'po_type_name': 'Purchase Order' }
  ]
  selectedPOType: any;

  transport_type_list = [
    { 'key': 'BY_ROAD', 'value': 'By Road' },
    { 'key': 'BY_AIR', 'value': 'By Air' },
    { 'key': 'BY_SEA', 'value': 'By Sea' },
    { 'key': 'OTHERS', 'value': 'Others' },
  ]

  payments_terms_list = [
    { key: "PAYMENT_TERMS_1", value: '10% advance & 90% after Receipt of materials' },
    { key: "PAYMENT_TERMS_2", value: '100% against material receipt' },
    { key: "PAYMENT_TERMS_3", value: 'Wholese credit for 30 days of material receiptller' },
  ]

  selectedTransportType: any;
  vendor_list: [];
  selected_vendor: any;
  selected_product_list = [

  ];
  dailog_ref: any;
  product_list: [];
  unit_list: [];
  total_amount: number = 0.00;
  packing_amount: number = 0.00;
  total_invoice_value: number = 0.0;
  total_order_value: number = 0.00;
  nb_select_size: NbComponentSize[] = ['medium']
  sgst: number = 0;
  cgst: number = 0;
  igst: number = 0;
  sub_total: number;
  invoice_amount: number;
  pr_list: [];



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
        poTypeFormControl: ['', [Validators.required]],
        poDateFormControl: ['', [Validators.required]],
        poNumberFormControl: ['', [Validators.required]],
        userFormControl: ['', [Validators.required]],
        transportTypeFormControl: ['', [Validators.required]],
        vendorCodeFormControl: ['', [Validators.required]],
        vendorNameFormControl: ['', [Validators.required]],
        paymentTermsFormControl: ['', [Validators.required]],
        otherRefFormControl: ['', [Validators.required]],
        termsDeliveryFormControl: [''],
        shipAddressFormControl: ['', [Validators.required]],
        noteFormControl: ['', [Validators.required]],
        packPrecntFormControl: ['', [Validators.required]],
        termsConditionFormControl: ['', [Validators.required]],
        prNumberFormControl: ['', [Validators.required]]
      }
    );
    let param = this.route.snapshot.queryParams['id'];
    if(param){
       this.purchaseService.getPODetails(param).subscribe(
         (data) => {
          this.purchaseOrderForm.controls['poTypeFormControl'].setValue(data.po_type);
          this.purchaseOrderForm.controls['poDateFormControl'].setValue(data.po_date);
          this.purchaseOrderForm.controls['poNumberFormControl'].setValue(data.po_number);
          // this.purchaseOrderForm.controls['userFormControl'].setValue(data.po_type);
          this.purchaseOrderForm.controls['transportTypeFormControl'].setValue(data.transport_type);
          this.purchaseOrderForm.controls['vendorCodeFormControl'].setValue(data.vendor__vendor_code);
          this.purchaseOrderForm.controls['vendorNameFormControl'].setValue(data.vendor__vendor_name);
          this.purchaseOrderForm.controls['paymentTermsFormControl'].setValue(data.payment_terms);
          this.purchaseOrderForm.controls['otherRefFormControl'].setValue(data.other_reference);
          this.purchaseOrderForm.controls['termsDeliveryFormControl'].setValue(data.terms_of_delivery);
          this.purchaseOrderForm.controls['shipAddressFormControl'].setValue(data.shipping_address);
          this.purchaseOrderForm.controls['noteFormControl'].setValue(data.note);
          this.purchaseOrderForm.controls['prNumberFormControl'].setValue(data.pr_number);
          this.selected_product_list = data.order_details;
          this.total_amount = data.total_amount;
          this.sub_total = data.sub_total;
          this.cgst = data.cgst;
          this.sgst = data.sgst;
          this.igst = data.igst;
          this.invoice_amount = data.invoice_amount;

         },
         (error) =>{
            this.nbtoastService.danger("Unable to get PO data");
         }
       )
    }
    this.purchaseOrderForm.controls['userFormControl'].setValue(sessionStorage.getItem('first_name'));

    this.purchaseService.getVendorList().subscribe(
      (data) => {
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
        this.selected_vendor = data;
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
          id:'',
          product_id: data.id,
          product_code: data.product_code,
          product_name: data.product_name,
          description: data.product_description,
          qty: 0,
          unit_id: '',
          delivery_date: '',
          unit_price: 0.0,
          gst: 0.0,
          amount: 0.0,
          disc_percent: 0.0,
          disc_amount: 0.0,
          gst_amount: 0.0,

        });
      });
    //  this.subcategoryFrom.controls['categoryNameFormControl'].setValue(data.category_name);

  }

  calculate_sub_total(item): any {

    if (item.unit_price > 0 && item.qty > 0) {
      item.amount = (item.unit_price * item.qty) * 1.00
      item.disc_amount = ((item.amount * item.disc_percent) / 100.00)
      item.gst_amount = ((item.amount * item.gst) / 100.00)
      this.calculate_total();
    }

  }

  calculate_total(): any {
    this.sub_total = 0;
    console.log(this.selected_product_list);
    this.selected_product_list.forEach(element => {
      this.sub_total = this.sub_total + (element.amount - element.disc_amount)
    });
    this.calculate_packing();

  };

  calculate_packing(): any {
    let packing_percnt = this.purchaseOrderForm.controls['packPrecntFormControl'].value;
    if (packing_percnt > 0) {
      this.packing_amount = ((this.sub_total * packing_percnt) / 100.00)
      this.total_amount = this.sub_total + this.packing_amount;
      this.calculate_gst();
    }
  }

  calculate_gst(): any {
    let total_gst = 0
    this.selected_product_list.forEach(element => {
      if (this.total_amount > 0) {
        total_gst = (total_gst + element.gst_amount);
      }
    });
    if (this.selected_vendor.state_code == '29') {
      this.sgst = total_gst / 2;
      this.cgst = total_gst / 2;
    } else {
      this.igst = total_gst / 2;
    }

    this.invoice_amount = this.igst + this.cgst + this.sgst + this.total_amount;

  }

  save_po(): any {
    const formdata = new FormData()
    formdata.append('po_type', this.purchaseOrderForm.controls['poTypeFormControl'].value);
    formdata.append('pr_number', this.purchaseOrderForm.controls['prNumberFormControl'].value);
    formdata.append('po_date', this.purchaseOrderForm.controls['poDateFormControl'].value);
    formdata.append('shipping_address', this.purchaseOrderForm.controls['shipAddressFormControl'].value);
    formdata.append('transport_type', this.purchaseOrderForm.controls['transportTypeFormControl'].value);
    formdata.append('vendor_id', this.selected_vendor.id);
    formdata.append('payment_terms', this.purchaseOrderForm.controls['paymentTermsFormControl'].value);
    formdata.append('other_reference', this.purchaseOrderForm.controls['otherRefFormControl'].value);
    formdata.append('note', this.purchaseOrderForm.controls['noteFormControl'].value);
    formdata.append('sub_total', this.sub_total.toString());
    formdata.append('packing_perct', this.purchaseOrderForm.controls['packPrecntFormControl'].value);
    formdata.append('packing_amount', this.packing_amount.toString());
    formdata.append('total_amount', this.total_order_value.toString());
    formdata.append('sgst', this.sgst.toString());
    formdata.append('cgst', this.cgst.toString());
    formdata.append('igst', this.igst.toString());
    formdata.append('invoice_amount', this.invoice_amount.toString());
    formdata.append('terms_conditions', this.purchaseOrderForm.controls['termsConditionFormControl'].value);
    formdata.append('po_products', JSON.stringify(this.selected_product_list))

    this.purchaseService.savePO(formdata).subscribe(
      (data) => {
        this.nbtoastService.success(`PO Created SuccessFully ${data}`);
        this.ngOnInit();
      },
      (error) => {
        this.nbtoastService.danger(error);
      }
    )
  }

  pr_open(dialog: TemplateRef<any>) {
    this.purchaseService.getPRList().subscribe(
      (data) => {
          this.pr_list = data;
     
              this.dailog_ref = this.dialogService.open(dialog, { context: this.pr_list  })
                .onClose.subscribe(data => {
                  //  this.product_list = data
                   this.purchaseOrderForm.controls['prNumberFormControl'].setValue(data.pr_no);
                   this.purchaseService.getPRDetails(data.id).subscribe(
                     (pr_data) => {
                        let pr_products = pr_data['selected_product_list']
                        pr_products.forEach(element => {
                          this.selected_product_list.push({
                            id:'',
                            product_id: element.product,
                            product_code: element.product_code,
                            product_name: element.product_name,
                            description: element.product_description,
                            qty: element.required_qty,
                            unit_id: element.unit,
                            delivery_date: this.formatDate(element.expected_date),
                            unit_price: 0.0,
                            gst: 0.0,
                            amount: 0.0,
                            disc_percent: 0.0,
                            disc_amount: 0.0,
                            gst_amount: 0.0,
  
                          });
                        });
                       
                     },
                     (error) => {
                        this.nbtoastService.danger("Unable to get PR details")
                     }

                   )
                     
                });
            },
            (error) => {
                this.nbtoastService.danger("Unable to get PR List");
            }
          )
    //  this.subcategoryFrom.controls['categoryNameFormControl'].setValue(data.category_name);

  }

  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

}
