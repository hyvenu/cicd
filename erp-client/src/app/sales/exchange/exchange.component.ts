import { Component, ElementRef, OnInit, Optional, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { AdminService } from 'src/app/admin/admin.service';
import { InventoryService } from 'src/app/inventory/inventory.service';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.scss']
})
export class ExchangeComponent implements OnInit {

  searchProduct:any;
  searchPro:any;
  searchPhoneNo: string;
  searchCus: string;
  serviceIds = [];
  multi_product: any = [];
  multi_product_list: any = [];
  pro_id: any;
  selectedPro: any = [];
  all_product: any=[];
  product: any=[];
  p_id: any;

  Upi = [
    { value: 'Phone Pay', name: 'Phone Pay' },
    { value: 'Google Pay', name: 'Google Pay' },
    { value: 'Amazon Pay', name: 'Amazon Pay' },
    { value: ' Others', name: ' Others' },


    // {value:'Long Leave', name: 'Long Leave'},
  ]

  Events = [
    { value: 'CARD', name: 'CARD' },
    { value: 'CASH', name: 'CASH' },
    { value: 'UPI', name: 'UPI' },

    // {value:'Long Leave', name: 'Long Leave'},
  ]

  @ViewChild('dialog_single_product', { static: true }) dialog_single_product: TemplateRef<any>;
  @ViewChild('focus') search:ElementRef;
  searchInv: string;
  transaction: any = 0;
  selectedPayEvents: any;
  selectedGST: any;
  selectedGstEvent: any;
  createFlag = false
  exchangeForm: FormGroup;
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
  subtotal: any = 0;
  gstTotal: any = 0;
  selectedSubTotal: any;
  selectedGstPercentage: any = 0;
  event: any;
  selectedDiscount: any = 0;
  grandTotal: any = 0;
  customer_id: any;
  product_id: any;
  gstValue: any = 0;
  totalGst: any = 0;
  selectedTotalGst: any = 0;
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
  exchangeNumber: string | Blob = "";
  poRaised: string | Blob = "";
  exchangeDate: string | Blob = "";
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
  barcode: any;
  invoice_id: any;
  amount:any=0;
  change:any=0;
  remaingAmount:any=0;
  includegst: any;
  includegstremaing:any
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

    this.user_name = sessionStorage.getItem('first_name');
    console.log(this.user_name)


    this.exchangeForm = this.formBuilder.group({
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
      paymentFormControl: ['',],
      TransactionIdFormControl: ['',],
      amountFormControl:['',],
      changeFormControl:['',],


      exchangeFormControl: ['',],
      cancelInvoiceFormControl: ['',],
      
      nameFormControl: ['',],
      customerMobileNumberFormControl: ['',],
      customerEmailFormControl: ['',],
      cardNoFormControl: ['',],

      userIdFormControl: ['',],
      supervisorIdFormControl: ['',],
      remaingAmountFormControl:['',],




    });


    this.service.getPOSList().subscribe(
      (data) => {
        this.bill_list = data
        console.log(this.bill_list)
      })

      this.onEvnetChange(this.event);
  }

  calculate_price(): void {

    this.selectedDiscount = 0;
    let total_item_price: any = 0;
    let total_basic_price: any = 0;
    let total_gst_value: any = 0;

    this.invoice_items.forEach(element => {
      console.log('pro ele', element)
      let tot_price: any = (element.price * element.quantity)
      let gst_tot: any = ((tot_price * element.tax) / 100)
      let item_tot = tot_price + gst_tot;

      console.log('tot pri', tot_price)
      console.log('tot gst', gst_tot)
      total_basic_price += tot_price;
      total_gst_value += gst_tot;
      //element.price = parseFloat(tot_price).toFixed(2);
      element.gst_value = parseFloat(gst_tot).toFixed(2);
      element.item_total = parseFloat(item_tot).toFixed(2);


    });

    /*  for(let i=0;i<this.invoice_items.length;i++)
     {
       let price = ((parseFloat(this.invoice_items[i].quantity) * (parseFloat(this.invoice_items[i].sell_price))));
       if(price !=NaN && this.invoice_items[i].quantity != "")
       {
         this.invoice_items[i].price = price;
       }     
     } */

    /*  for(let i=0;i<this.invoice_items.length;i++)
     {
       let gst_price = (((parseInt(this.invoice_items[i].tax)*(parseInt(this.invoice_items[i].price)/100))));
       if(gst_price !=NaN && this.invoice_items[i].tax!= "")
       {
         this.invoice_items[i].gst_value = gst_price * this.invoice_items[i].quantity;
       }     
     } */

    /*   for(var val of this.invoice_items){
        this.subtotal = 0;
        this.gstValue = 0;
        
        this.subtotal += val.item_total ;
        this.gstValue += val.gst_value ;
       // return this.subtotal;
      } */
    /*  this.invoice_items.forEach(val => {
       total_item_price = total_item_price + val.item_total;
       total_gst_value = total_gst_value + val.gst_value;
     }); */
    //this.subtotal = parseFloat(total_item_price).toFixed(2) ;
    this.subtotal = parseFloat(total_basic_price).toFixed(2);
    this.gstValue = parseFloat(total_gst_value).toFixed(2);

    console.log('siub tot', this.subtotal + 'gst', this.gstValue)
    let includeGST: any = (parseFloat(this.subtotal) + parseFloat(this.gstValue));
    this.selectedTotalGst = parseFloat(includeGST).toFixed(2)
    console.log('inc gst', this.selectedTotalGst)

    this.selectedDiscount = this.exchangeForm.get('discountFormControl').value;
    if (this.selectedDiscount >= 0) {

      //let amount :any = this.selectedTotalGst - this.selectedDiscount;

      this.grandTotal = Math.round(this.selectedTotalGst - this.selectedDiscount);
    } else if (this.selectedDiscount === NaN) {
      this.grandTotal = 0;
    }

    if(this.grandTotal > this.amount){
      this.change = 0;
    }else{
      this.change = (parseFloat(this.amount)-parseFloat(this.remaingAmount) )
    }
  }

  add_items(): any {

    const data = {
      item_id: '',
      item_description: '',
      quantity: '',
      unit: '',
      unit_name: '',
      price: '',
      item_total: '',
      gst_value: '',
      tax: ''
    }
    this.invoice_items.push(data)
    // this.calculate_price()
    
    // this.calculate_gst()
    // this.calculate_totalGst()
  }

  open_product_name(dialog: TemplateRef<any>, item) {
    this.inventoryService.getAllProductsList().subscribe(
      (data) => {
        console.log(data)
        this.product_list = data;

        this.dailog_ref = this.dialogService.open(dialog, { context: this.product_list })
          .onClose.subscribe(data => {
            this.searchPro = ""

            this.selected_product = data
            console.log(this.selected_product)

            this.multi_product = []
            this.multi_product.push(this.selected_product.product_price[0])
            console.log(this.multi_product)
            this.open_single_product(this.dialog_single_product, this.selected_product, item);
            this.search.nativeElement.focus()
            //  this.inventoryService.getProductDetails(this.pro_id).subscribe(
            //    (data) =>{
            //      this.selected_product_data = data
            //      console.log(this.selected_product_data)
            //      this.product_id = data.id 
            //      console.log(this.product_id)
            //      data.product_price.forEach(element => {
            //        console.log('ele',element)
            //        {

            //         let sellPrice:any = parseFloat(element.sell_price) * element.qty ;
            //         let gstVal:any = (sellPrice * parseFloat(element.tax) )/100;
            //         let total:any = sellPrice + gstVal;
            //         if(this.invoice_items.some(item => item.item_description == this.selected_product.product_name)){
            //           this.nbtoastService.danger("product name already exist");
            //         }else{
            //           item.item_id=element.product_id,
            //         item.item_description = this.selected_product.product_name

            //         console.log(item.item_id)
            //         //item.price= parseFloat(sellPrice).toFixed(2),
            //         item.price= element.sell_price
            //         item.quantity= element.qty ? element.qty : 0,
            //         item.unit=element.unit.PrimaryUnit,
            //         item.tax=element.tax,
            //         item.item_total = parseFloat(total).toFixed(2),
            //         item.gst_value =  parseFloat(gstVal).toFixed(2)
            //         }
            //       }
            //      });
            //      this.calculate_price()

            //    }
            //  )



          }
          );
      },
      (error) => {
        this.nbtoastService.danger(error.error.detail);
      }
    )

  }

  open_single_product(dialog: TemplateRef<any>, item, dd) {
    this.inventoryService.getProductDetails(item.id).subscribe(
      (data) => {
        console.log(data)
        this.selected_product_data = data
        /*  let aa:any =data
         console.log(aa) */
        this.multi_product_list = []
        data.product_price.forEach(element => {
          this.multi_product_list.push({
            ...element,
          })
        });;
        console.log(this.multi_product_list)

        this.dailog_ref = this.dialogService.open(dialog, { context: this.multi_product_list })
          .onClose.subscribe(data => {
            this.searchProduct = ""
            this.selectedPro = data
            console.log(this.selectedPro)
            this.pro_id = data.product
            console.log(this.selectedPro.sell_price)

            let sellPrice: any = parseFloat(this.selectedPro.unit_price) * this.selectedPro.qty;
            let gstVal: any = (sellPrice * parseFloat(this.selectedPro.tax)) / 100;
            let total: any = sellPrice + gstVal;
            if (this.invoice_items.some(item => item.item_description == this.selected_product.product_name)) {
              this.nbtoastService.danger("product name already exist");
            } else {
              /*  this.invoice_items.push({
                 item_id:this.selectedPro.product_id,
                 item_description : this.selected_product.product_name,
                 
                 // console.log(item.item_id)
                 //item.price= parseFloat(sellPrice).toFixed(2),
                 price: this.selectedPro.sell_price,
                 quantity:this.selectedPro.qty ? this.selectedPro.qty : 0,
                 unit:this.selectedPro.unit.PrimaryUnit,
                 tax:this.selectedPro.tax,
                 item_total: parseFloat(total).toFixed(2),
                 gst_value :  parseFloat(gstVal).toFixed(2)
               }) */
              dd.item_id = this.selectedPro.product,
                dd.item_description = this.selected_product.product_name

              console.log(item.item_id)
              //item.price= parseFloat(sellPrice).toFixed(2),
              dd.price = this.selectedPro.unit_price
              dd.quantity = this.selectedPro.qty ? this.selectedPro.qty : 0.00,
                dd.unit = this.selectedPro.unit,
                dd.unit_name = this.selectedPro.unit__PrimaryUnit,
                dd.tax = this.selectedPro.tax,
                dd.item_total = parseFloat(total).toFixed(2),
                dd.gst_value = parseFloat(gstVal).toFixed(2)
            }


            
            this.calculate_price()
            this.remaingAmount = Math.round(parseFloat(this.selectedTotalGst)- parseFloat(this.includegstremaing)) 



          })
      }
    )
  }


  open_invoice_number(dialog: TemplateRef<any>) {
    this.dailog_ref = this.dialogService.open(dialog, { context: this.bill_list })
      .onClose.subscribe(data => {
        this.invoice_id = data.id
        this.invoice_items=[]
        console.log(data.total_gst_amount)

        this.exchangeForm.controls['invoiceNumberFormControl'].setValue(data.invoice_no)
        this.exchangeForm.controls['customerNameFormControl'].setValue(data.customer__customer_name)
        this.exchangeForm.controls['customerMobileNumberFormControl'].setValue(data.customer__phone_number)
        this.exchangeForm.controls['customerEmailFormControl'].setValue(data.customer__customer_email)
        this.exchangeForm.controls['subTotalFormControl'].setValue(data.sub_total)
        this.exchangeForm.controls['paymentFormControl'].setValue(data.payment_terms)
        this.exchangeForm.controls['upiTypeFormControl'].setValue(data.upi_type)
        this.exchangeForm.controls['discountFormControl'].setValue(data.discount_price)
        this.exchangeForm.controls['gstFormControl'].setValue(data.total_gst_amount)
        this.exchangeForm.controls['TransactionIdFormControl'].setValue(data.transaction_id)
        this.selectedGstPercentage = data.total_gst_amount
        this.selectedTotalGst = data.total_include_gst
        this.includegstremaing = data.total_include_gst
        this.customer_id = data.customer_id
        console.log(data.gst_amount)
        this.grandTotal = data.grand_total
        // this.selectedTotalGst = data.

        // this.selectedPayEvents = data.payment_terms
        // this.selectedUpiEvents = data.upi_type
        data.order_details.forEach(element => {
          console.log('ele', element)
          let sellPrice: any = parseFloat(element.sell_price) * element.qty;
          let gstVal: any = (sellPrice * parseFloat(element.tax)) / 100;
          let total: any = sellPrice + gstVal;
          this.barcode = element.barcode
          this.invoice_items.push({
            item_id: element.product,

            item_description: element.product__product_name,
            //item.price= parseFloat(sellPrice).toFixed(2),
            price: element.unit_price,
            quantity: element.qty ? element.qty : 0.00,
            unit: element.unit_id,
            unit_name: element.unit__PrimaryUnit,
            tax: element.gst,
            item_total: element.subtotal_amount,
            gst_value: element.gst_amount,

          })
        })
        // this.calculate_price()
        //  this.inventoryService.getProductDetails(this.p_id).subscribe(
        //    (data) =>{
        //      this.selected_product_data = data
        //      console.log(this.selected_product_data)
        //      this.product_id = data.id 
        //      console.log(this.product_id)
        //      data.product_price.forEach(element => {
        //        console.log('ele',element)
        //        {

        //         let sellPrice:any = parseFloat(element.sell_price) * element.qty ;
        //         let gstVal:any = (sellPrice * parseFloat(element.tax) )/100;
        //         let total:any = sellPrice + gstVal;
        //         if(this.invoice_items.some(item => item.item_description == this.selected_product.product_name)){
        //           this.nbtoastService.danger("product name already exist");
        //         }else{
        //         this.invoice_items.push( {
        //            item_id:element.product,

        //             item_description :element.product__product_name,
        //             //item.price= parseFloat(sellPrice).toFixed(2),
        //             price: element.sell_price,
        //             quantity: element.qty ? element.qty : 0,
        //             unit:element.unit,
        //             unit_name:element.unit__PrimaryUnit,
        //             tax:element.tax,
        //             item_total :parseFloat(total).toFixed(2),
        //             gst_value :parseFloat(gstVal).toFixed(2),
        //           })
        //         }

        //       }

        //      });
        //      console.log(this.invoice_items)
        //      this.calculate_price()

        //    }
        //  )      

      })
      this.calculate_price()
  }


  remove_item(item): void {
    
    const index: number = this.invoice_items.indexOf(item);
    // this.serviceIds.splice(index, 1)
    // console.log(this.serviceIds)
    if (index !== -1) {
      this.invoice_items.splice(index, 1);
    }
    
    this.refund_items.push(item)
    console.log(this.refund_items)
    
   this.refund_items.forEach(element => {
     this.sum = parseFloat(this.sum) + parseFloat(element.item_total)
     
   });
 
   
   console.log(this.sum)
   this.selectedCupon = this.sum
    // this.selectedCupon = ""
    // this.exchangeForm.controls['discountFormControl'].setValue(0)
    this.calculate_price()
   this.includegst = this.selectedTotalGst

    console.log(this.invoice_items)
    this.remaingAmount = Math.round(parseFloat(this.selectedTotalGst)- parseFloat(this.includegstremaing)) 
    // this.calculate_gst()
    // this.calculate_totalGst()
  }

  onEvnetChange(event) {
    this.event = event.target.value;
    this.calculate_price()
    //  
  }

  bar_code(){
    let serial_no = this.exchangeForm.controls['barCodeFormControl'].value
    console.log(serial_no)
    
    let data = { serial_number:serial_no  }
    this.inventoryService.get_product_by_slno(data).subscribe(
      data =>{
        this.selected_product_data = data
        console.log(this.selected_product_data)
        data.forEach(element => {
          console.log('ele',element)
          {

           let sellPrice:any = parseFloat(element.unit_price) * element.qty ;
           let gstVal:any = (sellPrice * parseFloat(element.tax) )/100;
           let total:any = sellPrice + gstVal;
           if(this.invoice_items.some(item => item.item_description == this.selected_product_data[0].product__product_name)){
             this.nbtoastService.danger("product name already exist");
           }else{
           this.invoice_items.push( {
              item_id:element.product,
              
               item_description :element.product__product_name,
               //item.price= parseFloat(sellPrice).toFixed(2),
               price: element.unit_price,
               quantity: element.qty ? element.qty : 0.00,
               unit:element.unit,
               unit_name:element.unit__PrimaryUnit,
               tax:element.tax,
               item_total :parseFloat(total).toFixed(2),
               gst_value :parseFloat(gstVal).toFixed(2),
             })
           }
           
         }
         
        });
        console.log(this.invoice_items)
        this.calculate_price()
      },
      (error) => {
        this.nbtoastService.danger("Invalid Serial Number");

      }
    )
      this.barcode = ""
  }


  saveBill(): any {

    const formData = new FormData();
    if(this.exchangeForm.controls['invoiceNumberFormControl'].value != ""){
    formData.append('invoice_no',this.invoice_id)
    formData.append('exchange_number', this.exchangeNumber)
    formData.append('exchange_date', this.exchangeDate)
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


    formData.append('store_id', sessionStorage.getItem('store_id'))
    formData.append('grand_total', this.grandTotal)
    // formData.append('card', this.exchangeForm.controls['cardFormControl'].value);
    // formData.append('cash', this.exchangeForm.controls['cashFormControl'].value);
    // formData.append('upi', this.exchangeForm.controls['upiFormControl'].value);

    formData.append('payment_terms', this.exchangeForm.controls['paymentFormControl'].value)
    formData.append('upi_type', this.exchangeForm.controls['upiTypeFormControl'].value)
    formData.append('transaction_id', this.exchangeForm.controls['TransactionIdFormControl'].value)
    formData.append('total_include_gst',this.selectedTotalGst)
    formData.append('total_gst_amount', this.gstValue);

    formData.append('barcode', this.barcode)

    formData.append('discount_price', this.exchangeForm.controls['discountFormControl'].value);
    formData.append('gst_amount', this.exchangeForm.controls['gstFormControl'].value);
    // formData.append('exchange', this.exchangeForm.controls['exchangeFormControl'].value);
    // formData.append('cancel_invoice', this.exchangeForm.controls['cancelinvoiceFormControl'].value);
    

    formData.append('user_id', this.user_name);
    formData.append('supervisor_id', this.exchangeForm.controls['supervisorIdFormControl'].value);
    // formData.append('card_no', this.exchangeForm.controls['cardNoFormControl'].value);
    formData.append('customer_id', this.customer_id)

    formData.append('invoice_items', JSON.stringify(this.invoice_items));
    this.service.save_sales_exchange(formData).subscribe(
      (data) => {
        // this.billPaid()
        console.log(data)
        this.nbtoastService.success("Invoice Saved Successfully")


        



      },
      (error) => {
        this.nbtoastService.danger("unable to save");

      }
    )
    }
  }


  get f() { return this.exchangeForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.exchangeForm.invalid) {
        return;
    }
    if (!this.exchangeForm.invalid){
      return this.submitted = false;
    }

    
  
}


}

