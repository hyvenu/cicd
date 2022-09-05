import { isNgTemplate } from '@angular/compiler';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { sub } from 'date-fns';
import { getWeekYearWithOptions } from 'date-fns/fp';
import * as moment from 'moment';
import { AdminService } from 'src/app/admin/admin.service';
import { InventoryService } from 'src/app/inventory/inventory.service';
import { OrderService } from '../order.service';
enum CheckBoxType { CASH,CARD,UPI,CREDIT,SPLIT, NONE };

@Component({
  selector: 'app-sales-bill',
  templateUrl: './sales-bill.component.html',
  styleUrls: ['./sales-bill.component.scss']
})

export class SalesBillComponent implements OnInit {
  state_code= localStorage.getItem('state_code');
  
  check_box_type = CheckBoxType;

  currentlyChecked: CheckBoxType;
  passed_flag:boolean = true;
  customernew_id: any;
  app_id: any = "";
  booking_historys: any;
  service_id: any;
  searchProduct;
  searchPhoneNo: string;
  searchCus: string;
  serviceIds = [];
  advanceAmount:any=0;
  updateAmount: number;
  submitted: boolean=false;
  barcode: any;
  customerName:any;
  searchPro: string;
  multi_product: any[];
  multi_product_list: any[];
  multi_service_list: any[];
  selectedPro: any;
  pro_id: any;
  tot_price: any;

  selectCheckBox(targetType: CheckBoxType) {
    // If the checkbox was already checked, clear the currentlyChecked variable
    if(this.currentlyChecked === targetType) {
      this.currentlyChecked = CheckBoxType.NONE;
      return;
    }

    this.currentlyChecked = targetType;
  }

  gst_list=[
    {name:"InclusiveGst", value:"InclusiveGst"},
    {name:"ExclusiveGst", value:"ExclusiveGst"},
  ]

  Upi = [
    {value:'Phone Pay', name: 'Phone Pay'},
    {value:'Google Pay', name: 'Google Pay'},
    {value:'Amazon Pay', name: 'Amazon Pay'},
    {value:' Others', name: ' Others'},

    // {value:'Long Leave', name: 'Long Leave'},
  ]

  Events = [
    {value:'CASH', name: 'CASH'},
    {value:'CARD', name: 'CARD'},
    {value:'UPI', name: 'UPI'},
    {value:'CREDIT', name: 'CREDIT'},
    {value:'SPLIT', name: 'SPLIT'},
    // {value:'Long Leave', name: 'Long Leave'},
  ]

  @ViewChild('dialog_single_product', { static: true }) dialog_single_product: TemplateRef<any>;
  @ViewChild('focus') search:ElementRef;
  transaction:any=0;
  selectedGST:any;
  selectedGstEvent:any;
  createFlag = false;
  invoiceForm : FormGroup;
  dailog_ref: any;
  appointment_obj: any;
  booking_id: any;
  invoice_items: any;
  customer_object: any;
  customer_list: any;
  store_id: string | Blob;
  store_list: any;
  booking_data: any;
  product_list: any;
  selected_product: any;
  selected_product_data: any;
  subtotal: any=0;
  gstTotal:any=0;
  selectedSubTotal:any=0.00;
  selectedGstPercentage:any=0;
  event: any;
  //selectedDiscount:any=0.00;
  totalDiscount:any=0;
  grandTotal:any=0;
  customer_id: any;
  product_id: any;
  gstValue: any=0;
  totalGst: any = 0;
  selectedTotalGst:any=0.00;
  poType: string | Blob="";
  shippingAddress: string | Blob="";
  transportType: string | Blob="";
  paymentTerms: any="";
  otherRefrence: any="";
  termsOfDelivery: any="";
  note: any="";
  packingPerct: any="0";
  packingAmount: any="0";
  sgst: any="0";
  cgst: any="0";
  igst: any="0.0";
  termsConditions: any="";
  prNumber: string | Blob="";
  poRaised: string | Blob="";
  poDate: string | Blob="";
  other;
  cardChecked:any;
  store_name: string;
  user_name: string;
  total_include_tax:any=0;
  balanceAmount:any=0;
  selectedPayEvents:any;
  selectedEvents:any;
  amount:any=0;
  change:any=0;
  extra:any;
  desc:any;

  constructor(
    private formBuilder: FormBuilder,
    private adminService:AdminService,
    private service:OrderService,
    private routes: Router,
    private route: ActivatedRoute,
    private inventoryService:InventoryService,
    private nbtoastService: NbToastrService,
    private dialogService: NbDialogService,
  ) { }

  ngOnInit(): void {
    this.user_name = sessionStorage.getItem('first_name');
    console.log(this.user_name);
    this.invoiceForm = this.formBuilder.group({
      invoiceCodeFormControl:['',],
      customerNameFormControl: ['',Validators.required],
      barCodeFormControl:['',],
      quantityFormControl:['',],
      subTotalFormControl:['',],
      gstFormControl:['',],
      sgstFormControl:['',],
      cgstFormControl:['',],
      igstFormControl:['',],
      gstTotalFormControl:['',],
      discountFormControl:['',],
      grandTotalFormControl:['',],
      cardFormControl:['',],
      cashFormControl:['',],
      upiFormControl:['',],
      TransactionIdFormControl:['',Validators.required],

      exchangeFormControl:['',],
      cancelInvoiceFormControl:['',],
      refundFormControl:['',],
      nameFormControl:['',],
      customerMobileNumberFormControl:['',],
      customerEmailFormControl:['',],
      cardNoFormControl:['',],

      userIdFormControl:['',],
      supervisorIdFormControl:['',],
      advanceAmountFormControl:['',],
      balanceAmountFormControl:['',],
      amountFormControl:['',],
      changeFormControl:['',],
      paymentFormControl:[this.Events[0].value,Validators.required],
      SplitFormControl:['',],
      CreditFormControl:['',],
      billDateFormControl:['',[]],
      upiTypeFormControl:['',]

    });
    this.invoice_items=[];
    this.subtotal=0;
    this.gstValue=0;
    this.grandTotal=0;
    this.totalGst=0;
    this.gstTotal=0;
    this.invoiceForm.controls['billDateFormControl'].setValue(moment(new Date()).format("YYYY-MM-DD"));

    // this.calculate_total();
    //this.calculate_price();
    // this.calculate_totalGst();
    // this.calculate_gst();
    console.log(this.selectedSubTotal)
    this.adminService.getCustomerList().subscribe(
      (data) => {
        this.customer_list = data;
        console.log("customer_list", this.customer_list)
        // this.customernew_id = data.id
        // console.log(this.customernew_id)
      },
      (error) => {
        this.nbtoastService.danger("Unable to get customer List")
      }
    )

    this.app_id = this.route.snapshot.queryParams['app_id']
    if(this.app_id) {
      this.get_app_bookingHistory(this.app_id)
    }else {
      this.app_id = "";
    }

    /*
    let customer = this.route.snapshot.queryParams['id']
    if(customer){
      this.adminService.getCustomerDetails(customer).subscribe(
        (data)=>{
          console.log(data)
        this.invoiceForm.controls['customerNameFormControl'].setValue(data.customer_name);
       this.invoiceForm.controls['customerMobileNumberFormControl'].setValue(data.phone_number);
       this.invoiceForm.controls['customerEmailFormControl'].setValue(data.customer_email);
       this.invoiceForm.controls['advanceAmountFormControl'].setValue(data.advance_amount);
       this.customer_id = data.id;
      //  this.appointment_obj = this.appointment_objs.find(item => item.customer == data.id)
       console.log(data.id)
       this.get_bookingHistory(this.customer_id)
        }
      )
    }
    */
    this.state_code =  sessionStorage.getItem('state_code')
    console.log("state code",this.state_code)
    this.onEvnetChange(this.event);
  }

  add_items_product(dialog):any {

    const data = {
      service_id:'',
      booking_id:'',
      item_id:'',
      item_name:'',
      item_description:'',
      quantity:'',
      unit_id:'',
      unit:'',
      price:'',
      item_total:'',
      gst_value:'',
      tax:''
    }
    this.invoice_items.push(data)

    this.open_product_name(dialog, data)
    //this.calculate_price()
    // this.calculate_gst()
    // this.calculate_totalGst()
  }

  add_items_service(dialog):any {
    const data = {
      service_id:'',
      booking_id:'',
      item_id:'',
      item_name:'',
      item_description:'',
      quantity:'',
      unit_id:'',
      unit:'',
      price:'',
      item_total:'',
      gst_value:'',
      tax:''
    }
    this.invoice_items.push(data)

    this.open_service_name(dialog, data)
    //this.calculate_price()
    // this.calculate_gst()
    // this.calculate_totalGst()
  }

  remove_item(item): void{

    const index: number = this.invoice_items.indexOf(item);
    this.serviceIds.splice(index, 1)
    console.log(this.serviceIds)
    if (index !== -1) {
        this.invoice_items.splice(index, 1);
    }
    this.calculate_price()

   console.log(this.invoice_items)
    // this.calculate_gst()
    // this.calculate_totalGst()
  }

//  calculate_totalGst(){
//    this.totalGst = (parseInt(this.selectedSubTotal) + parseInt(this.selectedGstPercentage))
//    this.cgst = this.totalGst/2;
//    this.sgst = this.totalGst/2;
//    this.calculateGrandTotal();
//  }

  get_value(event,item){

    this.desc = event.target.value
    console.log(`change event be:${this.desc}`)
    console.log(`change event after: ${item.item_description}`)
    console.log(`change event ${JSON.stringify(this.invoice_items)}`)
  }

  open(dialog: TemplateRef<any>) {
    //Do not open if app_id is set
    if(this.app_id){ return; }
    this.dailog_ref= this.dialogService.open(dialog, { context: this.customer_list })
    .onClose.subscribe(data => {
      this.searchCus = ""
      this.invoice_items = []
       this.customer_object = data
       this.customer_id = data.id;

       this.invoiceForm.controls['customerNameFormControl'].setValue(this.customer_object.customer_name);
       this.invoiceForm.controls['nameFormControl'].setValue(this.customer_object.customer_name);
       this.invoiceForm.controls['customerMobileNumberFormControl'].setValue(this.customer_object.phone_number);
       this.invoiceForm.controls['customerEmailFormControl'].setValue(this.customer_object.customer_email);
       this.invoiceForm.controls['advanceAmountFormControl'].setValue(this.customer_object.advance_amount);

       this.get_bookingHistory(this.customer_id)

    }
    );



  }

  get_app_bookingHistory(app_id) {
    console.log("Called APP DEts");
    this.adminService.getAppBookinHistory(app_id).subscribe(
      (data)=>{
        console.log("App Booking Obj: ")
        console.log(data)
        if(data.length > 0) {
          this.serviceIds = []
          this.appointment_obj = data[0]

          this.invoiceForm.controls['customerNameFormControl'].setValue(this.appointment_obj.customer__customer_name);
          this.invoiceForm.controls['customerMobileNumberFormControl'].setValue(this.appointment_obj.customer__phone_number);
          this.invoiceForm.controls['customerEmailFormControl'].setValue(this.appointment_obj.customer__customer_email);
          this.invoiceForm.controls['advanceAmountFormControl'].setValue(this.appointment_obj.customer__advance_amount);
          this.customer_id = this.appointment_obj.customer__id;



          let services = this.appointment_obj.service_list
            services.forEach(element => {
            console.log("Service List: ")
            console.log(element)

            this.invoice_items.push(
              { item_id:"",
                booking_id: this.appointment_obj.id,
                service_id: element.service__id,
                item_name: element.service__service_name,
                item_description: element.service__service_desc,
                quantity: 1,
                unit_id: element.service__unit,
                unit: element.service__unit__PrimaryUnit,
                price: element.service__price,
                discount: 0,
                item_total: 0,
                tax: element.service__service_gst,
                gst_value: 0
              }
            )

          });

      }

        console.log("invoice items list: ")
        console.log(this.invoice_items)

        this.calculate_price()

      }
    )
  }

  get_bookingHistory(id) {
    console.log("Called APP DEts");
    this.adminService.getBookinHistory(id).subscribe(
      (data)=>{
        console.log("Booking Obj: ")
        console.log(data)
        if(data.length > 0) {
          this.serviceIds = []
          this.appointment_obj = data[0]

          this.invoiceForm.controls['customerNameFormControl'].setValue(this.appointment_obj.customer__customer_name);
          this.invoiceForm.controls['customerMobileNumberFormControl'].setValue(this.appointment_obj.customer__phone_number);
          this.invoiceForm.controls['customerEmailFormControl'].setValue(this.appointment_obj.customer__customer_email);
          this.invoiceForm.controls['advanceAmountFormControl'].setValue(this.appointment_obj.customer__advance_amount);
          this.customer_id = this.appointment_obj.customer__id;



          let services = this.appointment_obj.service_list
            services.forEach(element => {
            console.log("Service List: ")
            console.log(element)

            this.invoice_items.push(
              { item_id:"",
                booking_id: this.appointment_obj.id,
                service_id: element.service__id,
                item_name: element.service__service_name,
                item_description: element.service__service_desc,
                quantity: 1,
                unit_id: element.service__unit,
                unit: element.service__unit__PrimaryUnit,
                price: element.service__price,
                discount: 0,
                item_total: 0,
                tax: element.service__service_gst,
                gst_value: 0
              }
            )

          });

      }

        console.log("invoice items list: ")
        console.log(this.invoice_items)

        this.calculate_price()

      }
    )
  }

  onEvnetChange(event) {
    this.event = event.target.value;
    this.calculate_price()

  }


  calculate_price(): void {

    let total_gross:any =0;
    let total_discount:any =0;
    let total_grand:any =0;
    let total_basic_price:any =0;
    let total_gst_value: any =0;
    this.invoice_items.forEach(element => {

      let net_price:any = (element.price)
      let tot_price:any = (net_price * element.quantity )
      let item_tot = tot_price;
      if (element.discount > 0){
        item_tot = item_tot - element.discount;
      }
      // let gst_tot:any =((tot_price * element.tax)/100)
      let gst_tot:any=this.calculate_gst_amount(item_tot,element.tax);
      // let item_tot:any = tot_price + gst_tot;

      // total_gross += parseFloat(element.price);
      
      total_basic_price += item_tot;
      total_gst_value +=parseFloat(gst_tot);

      total_discount += parseFloat(element.discount);
      total_grand += item_tot;

      element.gst_value = parseFloat(gst_tot).toFixed(2);
      element.item_total = parseFloat(item_tot).toFixed(2);

    });
    this.subtotal = parseFloat(total_basic_price) - parseFloat(total_gst_value);
    // this.subtotal = parseFloat(total_gross).toFixed(2);
    this.gstValue = parseFloat(total_gst_value).toFixed(2);

    if(this.state_code == '29'){
    this.sgst = this.gstValue/ 2;
    this.cgst = this.gstValue/ 2;
    this.igst = 0;
    console.log("sgst",this.sgst)
    console.log("cgst",this.cgst)
    console.log("igst",this.igst)
    }else{
      this.sgst = 0;
      this.cgst = 0;
      this.igst = this.gstValue;
      console.log("igst",this.igst)
    }
    console.log("sgst",this.sgst)
    console.log("cgst",this.cgst)
    console.log("igst",this.igst)

    this.totalDiscount = parseFloat(total_discount).toFixed(2);
    this.grandTotal = parseFloat(total_grand) ;
    this.cgst = (parseFloat(this.gstValue)/2).toFixed(2)
    this.sgst = (parseFloat(this.gstValue)/2).toFixed(2)
    this.igst = 0

    console.log('siub tot',this.subtotal + 'gst', this.gstValue)
   
    console.log('inc gst',this.selectedTotalGst)

    if(parseFloat(this.advanceAmount) > parseFloat(this.grandTotal)){
      this.balanceAmount = 0
      this.balanceAmount = parseFloat( this.advanceAmount) - parseFloat(this.grandTotal)
      if(this.balanceAmount < 0)
      {
        this.balanceAmount = this.balanceAmount*-1; // multiply by -1
      }
    }else{
      this.balanceAmount = parseFloat( this.grandTotal) - parseFloat(this.advanceAmount)
      console.log(this.balanceAmount)
      this.updateAmount = 0
    }
    if(this.balanceAmount > this.amount){
      this.change = 0;
    }else{
      this.change = (parseFloat(this.amount)-parseFloat(this.balanceAmount) )
    }

    this.change = Math.ceil(this.change)
    this.balanceAmount = Math.ceil(this.balanceAmount);
    

  }
  calculate_gst_amount(total_amount,tax) {
    let i = (100+parseFloat(tax));
    let j = 100 / i;
    return  total_amount =  (total_amount -  (total_amount * j)).toFixed(2);
    console.log("gst amount", total_amount)
    // if (this.selected_vendor !== undefined) {
    //   if (this.selected_vendor.state_code == '29') {
    //     this.sgst = total_gst / 2;
    //     this.cgst = total_gst / 2;
    //     this.igst = 0
    //   } else {
    //     this.igst = total_gst;
    //     // this.cgst = total_gst/2;
    //   }
    // } else {
    //   this.igst = total_gst;
    //   ;
    // }
  }

  open_product_name(dialog: TemplateRef<any>, dd) {
    this.inventoryService.getAllProductsList().subscribe(
      (data) => {

        console.log(data)
        this.product_list = data;

        this.multi_product_list = []
        data.forEach(element => {
          element.product_price.forEach(item => {
            this.multi_product_list.push({
              ...item,
            })
          });
        });

        console.log("Multiproduct",  this.multi_product_list)

        this.dailog_ref = this.dialogService.open(dialog, { context: this.multi_product_list })
          .onClose.subscribe(data => {
            this.searchProduct = ""
            if(!data) {
              const index: number = this.invoice_items.indexOf(dd);
              if(this.invoice_items[index].item_name == "") {
                this.remove_item(dd);
              }
              return;
            }
            this.selectedPro = data
            console.log("selected product",this.selectedPro)
            this.pro_id = data.product
            console.log("selected product unitprice",this.selectedPro.unit_price)

            let sellPrice: any = parseFloat(this.selectedPro.sell_price) * this.selectedPro.qty;
            let gstVal: any = (this.selectedPro.sell_price * parseFloat(this.selectedPro.tax)) / 100;
            let total: any = sellPrice;
            if (this.invoice_items.some(item => item.item_name == this.selectedPro.product__product_name)) {
              const index: number = this.invoice_items.indexOf(dd);
              if(this.invoice_items[index].item_name == "") {
                this.remove_item(dd);
              }
              this.nbtoastService.danger("product name already exist");
            } else {
              let app_id = "";
              if(this.appointment_obj) {
                app_id = this.appointment_obj.id
              }
              dd.item_id = this.selectedPro.product,
              dd.booking_id = app_id,
              dd.item_name = this.selectedPro.product__product_name
              dd.item_description = this.selectedPro.product__description
              dd.quantity = this.selectedPro.qty ? this.selectedPro.qty : 0.00,
              dd.unit_id = this.selectedPro.unit,
              dd.unit = this.selectedPro.unit__PrimaryUnit,
              dd.price = this.selectedPro.sell_price
              dd.discount = 0,
              dd.item_total = parseFloat(total).toFixed(2),
              dd.tax = this.selectedPro.tax,
              dd.gst_value = parseFloat(gstVal).toFixed(2)
            }



            this.calculate_price()



          })



      },
      (error) => {
        this.nbtoastService.danger(error.error.detail);
      }
    )

  }

  open_service_name(dialog: TemplateRef<any>, dd) {
    this.adminService.getServiceList().subscribe(
      (data) => {

        console.log("Service LIST",data)
        this.multi_service_list = []
        data.forEach(item => {
            this.multi_service_list.push({
              ...item,
              qty: 1
            })
        });

        console.log("Multi Service",  this.multi_service_list )

        this.dailog_ref = this.dialogService.open(dialog, { context: this.multi_service_list })
          .onClose.subscribe(data => {
            this.searchProduct = ""
            if(!data) {
              const index: number = this.invoice_items.indexOf(dd);
              if(this.invoice_items[index].item_name == "") {
                this.remove_item(dd);
              }
              return;
            }
            this.selectedPro = data
            console.log("selected service",this.selectedPro)

            let sellPrice: any = parseFloat(this.selectedPro.price) * this.selectedPro.qty;
            let gstVal: any = (this.selectedPro.price * parseFloat(this.selectedPro.service_gst)) / 100;
            let total: any = sellPrice;
            if (this.invoice_items.some(item => item.item_name == this.selectedPro.service_name)) {
              const index: number = this.invoice_items.indexOf(dd);
              if(this.invoice_items[index].item_name == "") {
                this.remove_item(dd);
              }
              this.nbtoastService.danger("service name already exist");
            } else {
              let app_id = "";
              if(this.appointment_obj) {
                app_id = this.appointment_obj.id
              }
              dd.service_id = this.selectedPro.id,
              dd.booking_id = app_id,
              dd.item_name = this.selectedPro.service_name
              dd.item_description = this.selectedPro.service_desc
              dd.quantity = this.selectedPro.qty ? this.selectedPro.qty : 0.00,
              dd.unit_id = this.selectedPro.unit__id,
              dd.unit = this.selectedPro.unit__PrimaryUnit,
              dd.price = this.selectedPro.price
              dd.discount = 0,
              dd.item_total = parseFloat(total).toFixed(2),
              dd.tax = this.selectedPro.service_gst,
              dd.gst_value = parseFloat(gstVal).toFixed(2)
            }



            this.calculate_price()



          })



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
        });
        console.log(this.multi_product_list)

        this.dailog_ref = this.dialogService.open(dialog, { context: this.multi_product_list })
          .onClose.subscribe(data => {
            this.searchProduct = ""
            this.selectedPro = data
            console.log(this.selectedPro)
            this.pro_id = data.product
            console.log(this.selectedPro.unit_price)

            let sellPrice: any = parseFloat(this.selectedPro.sell_price) * this.selectedPro.qty;
            let gstVal: any = (this.selectedPro.sell_price * parseFloat(this.selectedPro.tax)) / 100;
            let total: any = sellPrice;
              if (this.invoice_items.some(item => item.item_description == this.selected_product.product_name)) {
                const index: number = this.invoice_items.indexOf(dd);
                if(this.invoice_items[index].item_description == "") {
                  this.remove_item(dd);
                }
                this.nbtoastService.danger("product name already exist");
            } else {

              let app_id = "";
              if(this.appointment_obj) {
                app_id = this.appointment_obj.id
              }
              dd.item_id = this.selectedPro.product,
              dd.booking_id = app_id,
              dd.item_description = this.selected_product.product_name
              dd.quantity = this.selectedPro.qty ? this.selectedPro.qty : 0.00,
              dd.unit_id = this.selectedPro.unit,
              dd.unit = this.selectedPro.unit__PrimaryUnit,
              dd.price = this.selectedPro.sell_price
              dd.discount = 0,
              dd.item_total = parseFloat(total).toFixed(2),
              dd.tax = this.selectedPro.tax,
              dd.gst_value = parseFloat(gstVal).toFixed(2)
            }



            this.calculate_price()



          })
      }
    )
  }

  // open_single_product(dialog: TemplateRef<any>, item, dd) {
  //   this.inventoryService.getProductDetails(item.id).subscribe(
  //     (data) => {
  //       console.log(data)
  //       this.selected_product_data = data
  //       /*  let aa:any =data
  //        console.log(aa) */
  //       this.multi_product_list = []
  //       data.product_price.forEach(element => {
  //         this.multi_product_list.push({
  //           ...element,
  //         })
  //       });
  //       console.log(this.multi_product_list)

  //       this.dailog_ref = this.dialogService.open(dialog, { context: this.multi_product_list })
  //         .onClose.subscribe(data => {
  //           this.searchProduct = ""
  //           if(!data) {
  //             const index: number = this.invoice_items.indexOf(dd);
  //             if(this.invoice_items[index].item_description == "") {
  //               this.remove_item(dd);
  //             }
  //             return
  //           }
  //           this.selectedPro = data
  //           console.log(this.selectedPro)
  //           this.pro_id = data.product
  //           console.log(this.selectedPro.sell_price)

  //           let sellPrice: any = parseFloat(this.selectedPro.unit_price) * this.selectedPro.qty;
  //           let gstVal: any = (sellPrice * parseFloat(this.selectedPro.tax)) / 100;
  //           let total: any = sellPrice + gstVal;
  //           if (this.invoice_items.some(item => item.item_description == this.selected_product.product_name)) {
  //             const index: number = this.invoice_items.indexOf(dd);
  //             if(this.invoice_items[index].item_description == "") {
  //               this.remove_item(dd);
  //             }
  //             this.nbtoastService.danger("product name already exist");
  //           } else {
  //              let app_id = "";
  //              if(this.appointment_obj) {
  //                 app_id = this.appointment_obj.id
  //              }
  //             dd.item_id = this.selectedPro.product,
  //             dd.booking_id = app_id,
  //             dd.item_description = this.selected_product.product_name
  //             dd.quantity = this.selectedPro.qty ? this.selectedPro.qty : 0.00,
  //             dd.unit_id = this.selectedPro.unit,
  //             dd.unit = this.selectedPro.unit__PrimaryUnit,
  //             dd.price = this.selectedPro.unit_price
  //             dd.discount = 0,
  //             dd.item_total = parseFloat(total).toFixed(2),
  //             dd.tax = this.selectedPro.tax,
  //             dd.gst_value = parseFloat(gstVal).toFixed(2)

  //           }

  //           this.calculate_price()

  //         })
  //     }
  //   )
  // }


  bar_code(){
    let serial_no = this.invoiceForm.controls['barCodeFormControl'].value
    console.log(serial_no)
    let app_id = "";
            if(this.appointment_obj) {
               app_id = this.appointment_obj.id
            }
    let data = { serial_number:serial_no  }
    this.inventoryService.get_product_by_slno(data).subscribe(
      data =>{
        this.selected_product_data = data
        console.log(this.selected_product_data)
        data.forEach(element => {
          console.log('ele', element)
          {

           let sellPrice:any = parseFloat(element.sell_price) * element.qty ;
           let gstVal:any = (sellPrice * parseFloat(element.tax) )/100;
           let total:any = sellPrice + gstVal;
           if(this.invoice_items.some(item => item.item_name == this.selected_product_data[0].product__product_name)){

             this.nbtoastService.danger("product name already exist");
           }else{

           this.invoice_items.push( {
               item_id:element.product,
               booking_id:app_id,
               service_id:"",
               item_name :element.product__product_name,
               item_description :element.product__description,
               quantity: element.qty ? element.qty : 0.00,
               unit_id: element.unit,
               unit:element.unit__PrimaryUnit,
               price: element.sell_price,
               discount: 0,
               item_total :parseFloat(total).toFixed(2),
               tax:element.tax,
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


  // open_phone_list(dialog: TemplateRef<any>) {
  //   //Do not open if app_id is set
  //   if(this.app_id){ return; }
  //   this.dailog_ref= this.dialogService.open(dialog, { context: this.customer_list })
  //   .onClose.subscribe(data => {
  //     this.searchPhoneNo = ""
  //     if(!data) { return }
  //     this.invoice_items = []
  //      this.customer_object = data
  //      this.customer_id = data.id;

  //      this.invoiceForm.controls['customerNameFormControl'].setValue(this.customer_object.customer_name);
  //      this.invoiceForm.controls['nameFormControl'].setValue(this.customer_object.customer_name);
  //      this.invoiceForm.controls['customerMobileNumberFormControl'].setValue(this.customer_object.phone_number);
  //      this.invoiceForm.controls['customerEmailFormControl'].setValue(this.customer_object.customer_email);

  //      this.get_bookingHistory(this.customer_id)

  //       }
  //       );

  // }


  saveBill():any {

    const formData = new FormData();
    if(this.invoiceForm.controls['customerNameFormControl'].value != "" ){
    formData.append('app_id',this.app_id)
    formData.append('po_type',this.poType)
    formData.append('pr_number',this.prNumber)
    formData.append('po_raised_by',this.poRaised)
    formData.append('po_date', moment(this.invoiceForm.controls['billDateFormControl'].value).format("YYYY-MM-DD"))
    // formData.append('po_date',this.poDate)
    formData.append('shipping_address',this.shippingAddress)
    formData.append('transport_type',this.transportType)
    formData.append('payment_terms',this.paymentTerms)
    formData.append('other_reference',this.otherRefrence)
    formData.append('terms_of_delivery',this.termsOfDelivery)
    formData.append('note',this.note)
    formData.append('sub_total', this.subtotal);

    formData.append('packing_perct',this.packingPerct)
    formData.append('packing_amount',this.packingAmount)
    formData.append('sgst',this.sgst)
    formData.append('cgst',this.cgst)
    formData.append('igst',this.igst)
    formData.append('terms_conditions',this.termsConditions)


    formData.append('store_id',sessionStorage.getItem('store_id'))
    formData.append('grand_total', this.grandTotal)
    // formData.append('card', this.invoiceForm.controls['cardFormControl'].value);
    // formData.append('cash', this.invoiceForm.controls['cashFormControl'].value);
    // formData.append('upi', this.invoiceForm.controls['upiFormControl'].value);

    formData.append('payment_terms',this.invoiceForm.controls['paymentFormControl'].value)
    formData.append('upi_type',this.invoiceForm.controls['upiTypeFormControl'].value)
    formData.append('transaction_id', this.invoiceForm.controls['TransactionIdFormControl'].value)

    formData.append('customer',this.customer_id)

    formData.append('barcode',this.invoiceForm.controls['barCodeFormControl'].value)

    formData.append('discount_price', this.invoiceForm.controls['discountFormControl'].value);
    formData.append('gst_amount', this.invoiceForm.controls['gstFormControl'].value);
    // formData.append('sgst', this.invoiceForm.controls['sgstFormControl'].value);
    // formData.append('cgst', this.invoiceForm.controls['cgstFormControl'].value);
    // formData.append('igst', this.invoiceForm.controls['igstFormControl'].value);
    formData.append('exchange', this.invoiceForm.controls['exchangeFormControl'].value);
    formData.append('cancel_invoice',this.invoiceForm.controls['cancelInvoiceFormControl'].value);
    formData.append('refund',this.invoiceForm.controls['refundFormControl'].value);
    formData.append('total_include_gst',this.selectedTotalGst)
    formData.append('total_gst_amount', this.gstValue);

    formData.append('user_id',this.user_name);
    formData.append('supervisor_id',this.invoiceForm.controls['supervisorIdFormControl'].value);
    formData.append('card_no',this.invoiceForm.controls['cardNoFormControl'].value);
    formData.append('credit_type',this.invoiceForm.controls['CreditFormControl'].value);
    formData.append('split_type',this.invoiceForm.controls['SplitFormControl'].value);
    formData.append('advance_amount',this.invoiceForm.controls['advanceAmountFormControl'].value);
    formData.append('balance_amount',this.invoiceForm.controls['balanceAmountFormControl'].value);
    formData.append('amount',this.invoiceForm.controls['amountFormControl'].value);
    formData.append('change',this.invoiceForm.controls['changeFormControl'].value);

    formData.append('invoice_items',JSON.stringify(this.invoice_items));
    this.service.savePO(formData).subscribe(
      (data) => {
        this.billPaid()
        this.advanceAmountUpdate()
        console.log(data)
        this.nbtoastService.success("Invoice Saved Successfully")


        this.routes.navigateByUrl("/InvoicePage?id=" + data)



      },
      (error) =>{
        this.nbtoastService.danger("unable to save");

      }
    )
    }
  }

  billPaid(){
    let data = {
      'is_paid':new Boolean(this.passed_flag).toString(),
      'id':this.customer_id,
      'service_id':this.serviceIds

    }
    this.adminService.updateIsPaid(data).subscribe(
      (data)=>{
        this.nbtoastService.success("Bill Paid")
      }
    )

  }

  advanceAmountUpdate(){
    let remainingAdvanceAmount = 0.0;
    //if(parseFloat(this.advanceAmount) > 0) {

      if(parseFloat(this.advanceAmount) > (parseFloat(this.grandTotal))) {
        remainingAdvanceAmount = (parseFloat(this.advanceAmount) - parseFloat(this.grandTotal)) ;
      }
   // }

    let data = {
      'advance_amount': remainingAdvanceAmount,
      'id':this.customer_id
    }
    this.adminService.updateAdvanceAmount(data).subscribe(
      data =>{
        this.nbtoastService.success("amount updated")
      }
    )
  }

  get f() { return this.invoiceForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.invoiceForm.invalid) {
        return;
    }
    if (!this.invoiceForm.invalid){
      return this.submitted = false;
    }



}




}
