import { Component, OnInit, Optional, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { AdminService } from 'src/app/admin/admin.service';
import { InventoryService } from 'src/app/inventory/inventory.service';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-refund',
  templateUrl: './refund.component.html',
  styleUrls: ['./refund.component.scss']
})
export class RefundComponent implements OnInit {


  Upi = [
    { value: 'Phone Pay', name: 'Phone Pay' },
    { value: 'Google Pay', name: 'Google Pay' },
    { value: 'Amazon Pay', name: 'Amazon Pay' },
    { value: ' Others', name: ' Others' },


    // {value:'Long Leave', name: 'Long Leave'},
  ]

  Events = [
    { value: 'CASH', name: 'CASH' },
    { value: 'CARD', name: 'CARD' },
    { value: 'UPI', name: 'UPI' },

    // {value:'Long Leave', name: 'Long Leave'},
  ]
  selectedRefund:any=0.00;
  searchInv: string;
  transaction: any = 0;
  selectedPayEvents: any;
  selectedGST: any;
  selectedGstEvent: any;
  createFlag = false
  refundForm: FormGroup;
  dailog_ref: any;
  booking_history: any;
  booking_id: any;
  invoice_items: any=[];
  customer_object: any;
  customer_list: any;
  store_id: string | Blob;
  store_list: any;
  booking_data: any;
  product_list: any;
  selected_product: any;
  selected_product_data: any;
  subtotal: any = 0.00;
  gstTotal: any = 0.00;
  selectedSubTotal: any;
  selectedGstPercentage: any = 0;
  event: any;
  selectedDiscount: any = 0.00;
  grandTotal: any = 0.00;
  customer_id: any;
  product_id: any;
  gstValue: any = 0;
  totalGst: any = 0;
  selectedTotalGst: any = 0.00;
  poType: string | Blob = "";
  shippingAddress: string | Blob = "";
  transportType: string | Blob = "";
  paymentTerms: any = "";
  otherRefrence: any = "";
  termsOfDelivery: any = "";
  note: any = "";
  packingPerct: any = "0";
  packingAmount: any = "0";
  sgst: any = "0";
  cgst: any = "0";
  igst: any = "0";
  termsConditions: any = "";
  refundNumber: string | Blob = "";
  poRaised: string | Blob = "";
  refundDate: string | Blob = "";
  other
  cardChecked: any;
  store_name: string;
  user_name: string;
  selectedCupon: any;
  selectedEvents: any;

  //dialog_single_product =  TemplateRef<#dialog_single_product>;
  total_include_tax: any = 0;
  bill_list: any;
  selectedUpiEvents: any;
  refund_items: any=[];
  sum: any=0;
  invoice_id: any;
  barcode: any;
  amount:any=0.00;
  change:any=0.00;
  submitted: boolean=false;
  // @ViewChild('dialog_single_product', { static: true }) dialog_single_product: TemplateRef<any>;
  // @ViewChild('focus') search:ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private service: OrderService,
    private routes: Router,
    private route: ActivatedRoute,
    private inventoryService: InventoryService,
    private nbtoastService: NbToastrService,
    private dialogService: NbDialogService,
    @Optional() protected ref: NbDialogRef<any>
  ) { }

  ngOnInit(): void {
    // let invoice = this.route.snapshot.queryParams['id']
    this.change=0
    this.user_name = localStorage.getItem('first_name');
    console.log(this.user_name)


    this.refundForm = this.formBuilder.group({
      invoiceNumberFormControl: ['',Validators.required],
      customerNameFormControl: [''],
      barCodeFormControl: ['',],
      quantityFormControl: ['',],
      subTotalFormControl: ['',],
      gstFormControl: ['',],
      gstTotalFormControl: ['',],
      discountFormControl: ['',],
      grandTotalFormControl: ['',],
      // cardFormControl: ['',],
      // cashFormControl: ['',],
      upiTypeFormControl: ['',],
      cuponFormControl: ['',],
      paymentFormControl: [this.Events[0].value,Validators.required],
      TransactionIdFormControl: ['',],
      amountFormControl:['',],
      //changeFormControl:['',],

      exchangeFormControl: ['',],
      cancelInvoiceFormControl: ['',],
      refundFormControl: ['',],
      nameFormControl: ['',],
      customerMobileNumberFormControl: ['',],
      customerEmailFormControl: ['',],
      cardNoFormControl: ['',],

      userIdFormControl: ['',],
      supervisorIdFormControl: ['',],




    });


    this.service.getPOSList().subscribe(
      (data) => {
        this.bill_list = data
        console.log(this.bill_list)
      })

      this.onEvnetChange(this.event);
  }



  calculate_price(): void {

    let total_gross:any =0;
    let total_discount:any = 0;
    let total_grand:any =0;
    let total_basic_price: any = 0;
    let total_gst_value: any = 0;

    this.invoice_items.forEach(element => {
      console.log('pro ele', element)
      /*
      let tot_price: any = (element.price * element.quantity)
      let gst_tot: any = ((tot_price * element.tax) / 100)
      let item_tot = tot_price + gst_tot;
      */
      let net_price:any = (element.price - element.discount)
      let tot_price:any = (net_price * element.quantity )
      let gst_tot:any =((tot_price * element.tax)/100)
      let item_tot:any = tot_price + gst_tot;

      console.log('tot pri', tot_price)
      console.log('tot gst', gst_tot)

      total_gross += parseFloat(element.price);
      total_basic_price += tot_price;
      total_gst_value += gst_tot;

      total_discount += parseFloat(element.discount);
      total_grand += item_tot;

      //element.price = parseFloat(tot_price).toFixed(2);
      element.gst_value = parseFloat(gst_tot).toFixed(2);
      element.item_total = parseFloat(item_tot).toFixed(2);


    });

    this.subtotal = parseFloat(total_gross).toFixed(2);
    this.gstValue = parseFloat(total_gst_value).toFixed(2);

    this.selectedDiscount = parseFloat(total_discount).toFixed(2);
    this.grandTotal = parseFloat(total_grand).toFixed(2);

    console.log('siub tot', this.subtotal + 'gst', this.gstValue)
    let includeGST: any = (parseFloat(this.subtotal) + parseFloat(this.gstValue));
    this.selectedTotalGst = parseFloat(includeGST).toFixed(2)
    console.log('inc gst', this.selectedTotalGst)


    //refund amount
    if(parseFloat(this.grandTotal) >= parseFloat(this.amount)){
      this.selectedRefund = 0;
      this.change = (parseFloat(this.grandTotal)-parseFloat(this.amount));

    }else{
      this.change = 0;
      this.selectedRefund = (parseFloat(this.amount)-parseFloat(this.grandTotal));
    }

    this.selectedRefund = Math.ceil(this.selectedRefund);
    this.change = Math.ceil(this.change);

  }

  open_invoice_number(dialog: TemplateRef<any>) {
    this.dailog_ref = this.dialogService.open(dialog, { context: this.bill_list })
      .onClose.subscribe(data => {
        this.searchInv=""
        this.invoice_items=[]
        this.invoice_id = data.id
        console.log(data)

        this.refundForm.controls['invoiceNumberFormControl'].setValue(data.invoice_no)
        this.refundForm.controls['customerNameFormControl'].setValue(data.customer__customer_name)
        this.refundForm.controls['customerMobileNumberFormControl'].setValue(data.customer__phone_number)
        this.refundForm.controls['customerEmailFormControl'].setValue(data.customer__customer_email)
        this.refundForm.controls['subTotalFormControl'].setValue(data.sub_total)
        this.refundForm.controls['paymentFormControl'].setValue(data.payment_terms)
        this.refundForm.controls['upiTypeFormControl'].setValue(data.upi_type)
        this.refundForm.controls['discountFormControl'].setValue(data.discount_price)
        this.refundForm.controls['gstFormControl'].setValue(data.total_gst_amount)
        this.refundForm.controls['TransactionIdFormControl'].setValue(data.transaction_id)
        this.customer_id = data.customer_id
        this.selectedGstPercentage = data.total_gst_amount
        this.selectedTotalGst = data.total_include_gst
        console.log(data.gst_amount)
        this.grandTotal = data.grand_total
        this.amount = data.grand_total
        // this.selectedTotalGst = data.

        // this.selectedPayEvents = data.payment_terms
        // this.selectedUpiEvents = data.upi_type
        data.order_details.forEach(element => {
          console.log('ele', element)
          let sellPrice: any = parseFloat(element.sell_price) * element.qty;
          let gstVal: any = (sellPrice * parseFloat(element.tax)) / 100;
          let total: any = sellPrice + gstVal;
          this.barcode = element.barcode
          let name = element.product? element.product__product_name: element.service__service_name;
          this.invoice_items.push({

            id: "",
            item_id: element.product ? element.product : "",
            service_id: element.service ? element.service : "",
            description: name,
            quantity: element.qty ? element.qty : 0.00,
            unit_id: element.unit_id,
            unit: element.unit_text,
            price: element.unit_price,
            discount: element.discount_price,
            item_total: element.subtotal_amount,
            tax: element.gst,
            gst_value: element.gst_amount,

          })
        })

      })
  }


  remove_item(item): void {
    //this.sum = 0;
    const index: number = this.invoice_items.indexOf(item);
    // this.serviceIds.splice(index, 1)
    // console.log(this.serviceIds)
    if (index !== -1) {
      this.invoice_items.splice(index, 1);
    }

    /*
    this.refund_items.push(item)
    console.log(this.refund_items)

  //  this.refund_items.forEach(element => {
  //    this.sum = parseFloat(this.sum) + parseFloat(element.item_total)

  //  });
  this.sum = (parseFloat(this.sum) + parseFloat(item.item_total)) - parseFloat(this.selectedDiscount)

   console.log(this.sum)
   this.selectedRefund = (this.sum).toFixed()
    // this.selectedCupon = ""
    // this.refundForm.controls['discountFormControl'].setValue(0)
    */

    this.calculate_price()


  }

  onEvnetChange(event) {
    this.event = event.target.value;
    this.calculate_price()
    //
  }


  saveBill(): any {

    const formData = new FormData();
    if(this.refundForm.controls['invoiceNumberFormControl'].value != ""){
    formData.append('invoice_no',this.invoice_id)
    formData.append('refund_number', this.refundNumber)
    formData.append('refund_date', this.refundDate)
    formData.append('shipping_address', this.shippingAddress)
    formData.append('transport_type', this.transportType)
    formData.append('payment_terms', this.paymentTerms)
    formData.append('other_reference', this.otherRefrence)
    formData.append('terms_of_delivery', this.termsOfDelivery)
    formData.append('note', this.note)
    formData.append('sub_total', this.subtotal);

    formData.append('packing_perct', this.packingPerct)
    formData.append('packing_amount', this.packingAmount)
    formData.append('sgst', this.sgst)
    formData.append('cgst', this.cgst)
    formData.append('igst', this.igst)
    formData.append('terms_conditions', this.termsConditions)


    formData.append('store_id', localStorage.getItem('store_id'))
    formData.append('grand_total', this.grandTotal)
    // formData.append('card', this.refundForm.controls['cardFormControl'].value);
    // formData.append('cash', this.refundForm.controls['cashFormControl'].value);
    // formData.append('upi', this.refundForm.controls['upiFormControl'].value);

    formData.append('payment_terms', this.refundForm.controls['paymentFormControl'].value)
    formData.append('upi_type', this.refundForm.controls['upiTypeFormControl'].value)
    formData.append('transaction_id', this.refundForm.controls['TransactionIdFormControl'].value)
    formData.append('total_include_gst',this.selectedTotalGst)
    formData.append('total_gst_amount', this.gstValue);

    formData.append('barcode', this.barcode)

    formData.append('discount_price', this.refundForm.controls['discountFormControl'].value);
    formData.append('gst_amount', this.refundForm.controls['gstFormControl'].value);
    // formData.append('exchange', this.refundForm.controls['exchangeFormControl'].value);
    // formData.append('cancel_invoice', this.refundForm.controls['cancelinvoiceFormControl'].value);
    formData.append('refund_amount', this.selectedRefund);

    formData.append('user_id', this.user_name);
    formData.append('supervisor_id', this.refundForm.controls['supervisorIdFormControl'].value);
    // formData.append('card_no', this.refundForm.controls['cardNoFormControl'].value);
    formData.append('customer_id', this.customer_id)

    formData.append('invoice_items', JSON.stringify(this.invoice_items));
    this.service.save_sales_refund(formData).subscribe(
      (data) => {
        // this.billPaid()
        console.log(data)
        this.nbtoastService.success("Invoice Saved Successfully")

        this.routes.navigateByUrl("/InvoicePage?rid=" + data)

      },
      (error) => {
        this.nbtoastService.danger("unable to save");

      }
    )
    }
  }

  get f() { return this.refundForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.refundForm.invalid) {
        return;
    }
    if (!this.refundForm.invalid){
      return this.submitted = false;
    }



}


}
