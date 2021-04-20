import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NbComponentSize, NbDialogService, NbToastrService } from '@nebular/theme';
import * as moment from 'moment';
import { AdminService } from 'src/app/admin/admin.service';
import { InventoryService } from 'src/app/inventory/inventory.service';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-sales-order',
  templateUrl: './sales-order.component.html',
  styleUrls: ['./sales-order.component.scss']
})
export class SalesOrderComponent implements OnInit {

  purchaseOrderForm: FormGroup;
  po_type_list = [
    { 'po_type_value': 'PO', 'po_type_name': 'Sales Order' }
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
  po_id: any;
  store_id: any;
  service_list: any;
  customer_list: any;
  selected_customer: any;


  constructor(
    private formBuilder: FormBuilder,
    private salesService: OrderService,
    private routes: Router,
    private route: ActivatedRoute,
    private nbtoastService: NbToastrService,
    private dialogService: NbDialogService,
    private inventoryService: InventoryService,
    private adminService:AdminService,
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
        prNumberFormControl: ['', [Validators.required]],
        customerFormControl: ['',[Validators.required]],
      }
    );

    this.selected_product_list = [];
    this.total_amount = 0.0;
    this.sub_total = 0.0;
    this.cgst = 0.0;
    this.sgst = 0.0;
    this.igst = 0.0;

    this.po_id = this.route.snapshot.queryParams['id'];
    if(this.po_id){
       this.salesService.getPODetails(this.po_id).subscribe(
         (data) => {
          this.purchaseOrderForm.controls['poTypeFormControl'].setValue(data.po_type);
          this.purchaseOrderForm.controls['poDateFormControl'].setValue(moment(data.po_date));
          this.purchaseOrderForm.controls['poNumberFormControl'].setValue(data.po_number);
          this.purchaseOrderForm.controls['userFormControl'].setValue(data.po_raised_by);
          this.purchaseOrderForm.controls['transportTypeFormControl'].setValue(data.transport_type);
          this.purchaseOrderForm.controls['vendorCodeFormControl'].setValue(data.vendor__vendor_code);
          this.purchaseOrderForm.controls['vendorNameFormControl'].setValue(data.vendor__vendor_name);
          this.purchaseOrderForm.controls['paymentTermsFormControl'].setValue(data.payment_terms);
          this.purchaseOrderForm.controls['otherRefFormControl'].setValue(data.other_reference);
          this.purchaseOrderForm.controls['termsDeliveryFormControl'].setValue(data.terms_of_delivery);
          this.purchaseOrderForm.controls['shipAddressFormControl'].setValue(data.shipping_address);
          this.purchaseOrderForm.controls['noteFormControl'].setValue(data.note);
          this.purchaseOrderForm.controls['prNumberFormControl'].setValue(data.pr_number);
          this.purchaseOrderForm.controls['packPrecntFormControl'].setValue(data.packing_perct);
          this.purchaseOrderForm.controls['termsConditionFormControl'].setValue(data.terms_conditions);
          this.store_id = data.store_id;
         
          for(let i=0;i<data.order_details.length;i++){
            console.log(moment(data.order_details[i].delivery_date))
            data.order_details[i].delivery_date = moment(data.order_details[i].delivery_date)
            data.qty = parseInt(data.order_details[i].qty)
          };
          this.selected_product_list = data.order_details;
          this.total_amount = parseFloat(data.total_amount);
          this.sub_total = parseFloat(data.sub_total);
          this.cgst = parseFloat(data.cgst);
          this.sgst = parseFloat(data.sgst);
          this.igst = parseFloat(data.igst);
          this.invoice_amount = parseFloat(data.invoice_amount);
          

         },
         (error) =>{
            this.nbtoastService.danger("Unable to get PO data");
         }
       )
    }else{
      this.purchaseOrderForm.controls['userFormControl'].setValue(sessionStorage.getItem('first_name'));
    }

    // this.salesService.getVendorList().subscribe(
    //   (data) => {
    //     this.vendor_list = data;
    //   },
    //   (error) => {
    //     this.nbtoastService.danger("Error while getting vendor list")
    //   }
    // )

    this.adminService.getServiceList().subscribe(
      (data) =>{
        this.service_list = data;
      },
      (error) =>{
        this.nbtoastService.danger("unable to get service list");
      }
    )

    this.adminService.getCustomerList().subscribe(
      (data) =>{
        this.customer_list = data;
      },
      (error) =>{
        this.nbtoastService.danger("unable to get customer list");
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

  service_open(dialog: TemplateRef<any>) {
    this.dailog_ref = this.dialogService.open(dialog, { context: this.service_list })
      .onClose.subscribe(data => {
        //  this.product_list = data
        this.selected_product_list.push({
          id:'',
          product_id: data.id,
          product_code: '',
          product_name: data.service_name,
          description: data.service_desc,
          qty: 1,
          unit_id: '',
          delivery_date: '',
          unit_price:data.price,
          gst: 0.0,
          amount: 0.0,
          disc_percent: 0.0,
          disc_amount: 0.0,
          gst_amount: 0.0,

        });
      });
    //  this.subcategoryFrom.controls['categoryNameFormControl'].setValue(data.category_name);

  }

  customer_open(dialog: TemplateRef<any>) {
    this.dailog_ref = this.dialogService.open(dialog, { context: this.customer_list })
      .onClose.subscribe(data => {
        this.selected_customer = data
        this.purchaseOrderForm.controls['customerFormControl'].setValue(data.customer_name);
         
      });
    //  this.subcategoryFrom.controls['categoryNameFormControl'].setValue(data.category_name);

  }

  calculate_sub_total(item): any {

    if (item.unit_price > 0 && item.qty > 0) {
      item.amount = (item.unit_price * item.qty) * 1.00
      item.disc_amount = ((item.amount * item.disc_percent) / 100.00)
     
      item.total_amount = (item.amount - item.disc_amount) 
      item.gst_amount = ((item.total_amount * item.gst) / 100.00)
      this.calculate_total();
    }

  }

  calculate_total(): any {
    this.sub_total = 0;
    console.log(this.selected_product_list);
    this.selected_product_list.forEach(element => {
      this.sub_total = this.sub_total + element.total_amount
    });
    this.calculate_packing();

  };

  calculate_packing(): any {
    let packing_percnt = this.purchaseOrderForm.controls['packPrecntFormControl'].value;
    if (packing_percnt > 0) {
      this.packing_amount = ((this.sub_total * packing_percnt) / 100.00)
      this.total_amount = this.sub_total + this.packing_amount;
      this.calculate_gst();
    }else {
      this.total_amount = this.sub_total
      this.calculate_gst();
    }
  }

  calculate_gst(): any {
    let total_gst = 0
    this.selected_product_list.forEach(element => {
      if (this.total_amount > 0) {
        total_gst = (total_gst + element.gst_amount);
      }else{
        total_gst = 0
      }
    });
    if (this.selected_vendor !== undefined){
     if (this.selected_vendor.state_code == '29') {
      this.sgst = total_gst / 2;
      this.cgst = total_gst / 2;
    } else {
      this.igst = total_gst;
    }
    }else {
      this.igst = total_gst ;
    }

    this.invoice_amount = this.igst + this.cgst + this.sgst + this.total_amount;

  }

  save_po(): any {
    const formdata = new FormData()
    if(this.po_id){
      formdata.append('id', this.po_id);  
    }
    formdata.append('po_type', this.purchaseOrderForm.controls['poTypeFormControl'].value);
    formdata.append('pr_number', this.purchaseOrderForm.controls['prNumberFormControl'].value);
    console.log(this.purchaseOrderForm.controls['poDateFormControl'].value);
    console.log(moment(this.purchaseOrderForm.controls['poDateFormControl'].value));
    formdata.append('po_date', moment(this.purchaseOrderForm.controls['poDateFormControl'].value).format("YYYY-MM-DD"));
    formdata.append('po_raised_by', this.purchaseOrderForm.controls['userFormControl'].value);
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
    formdata.append('store_id', this.store_id);
    formdata.append('terms_conditions', this.purchaseOrderForm.controls['termsConditionFormControl'].value);

    this.selected_product_list.forEach(element => {
      element = moment(element.delivery_date).format("YYYY-MM-DD")
    });
    formdata.append('po_products', JSON.stringify(this.selected_product_list))

    this.salesService.savePO(formdata).subscribe(
      (data) => {
        this.nbtoastService.success(`PO Created SuccessFully ${data}`);
        this.ngOnInit();
      },
      (error) => {
        this.nbtoastService.danger(error);
      }
    )
  }

  // pr_open(dialog: TemplateRef<any>) {
  //   this.salesService.getPRList().subscribe(
  //     (data) => {
  //         this.pr_list = data;
     
  //             this.dailog_ref = this.dialogService.open(dialog, { context: this.pr_list  })
  //               .onClose.subscribe(data => {
  //                 //  this.product_list = data
  //                  this.purchaseOrderForm.controls['prNumberFormControl'].setValue(data.pr_no);
  //                  if (data.status !== 'APPROVED'){
  //                    this.nbtoastService.warning("Selected PR is not Approved");
  //                    return;
  //                  }
  //                  this.salesService.getPRDetails(data.id).subscribe(
  //                    (pr_data) => {
  //                       this.store_id = pr_data.store_id;
  //                       let pr_products = pr_data['selected_product_list']
  //                       pr_products.forEach(element => {
  //                         this.selected_product_list.push({
  //                           id:'',
  //                           product_id: element.product,
  //                           product_code: element.product_code,
  //                           product_name: element.product_name,
  //                           description: element.product_description,
  //                           qty: element.required_qty,
  //                           unit_id: element.unit,
  //                           delivery_date: moment(element.expected_date),
  //                           unit_price: 0.0,
  //                           gst: 0.0,
  //                           amount: 0.0,
  //                           disc_percent: 0.0,
  //                           disc_amount: 0.0,
  //                           gst_amount: 0.0,
  //                           total_amount:0.0,
  
  //                         });
  //                       });
                       
  //                    },
  //                    (error) => {
  //                       this.nbtoastService.danger("Unable to get PR details")
  //                    }

  //                  )
                     
  //               });
  //           },
  //           (error) => {
  //               this.nbtoastService.danger("Unable to get PR List");
  //           }
  //         )
  //   //  this.subcategoryFrom.controls['categoryNameFormControl'].setValue(data.category_name);

  // }

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

  delete_product(id): any {
    const data = { 'id' : id}
    this.salesService.deleteProductFromPO(data).subscribe(
      (data) => {
        this.nbtoastService.info("Item Removed");
      },
      (error) =>{
        this.nbtoastService.danger("Unable remove product");
      }
    )
  }

}
