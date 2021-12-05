import { isNgTemplate } from '@angular/compiler';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { sub } from 'date-fns';
import { getWeekYearWithOptions } from 'date-fns/fp';
import { AdminService } from 'src/app/admin/admin.service';
import { InventoryService } from 'src/app/inventory/inventory.service';
import { OrderService } from '../order.service';
enum CheckBoxType { CASH,CARD,UPI, NONE };

@Component({
  selector: 'app-sales-bill',
  templateUrl: './sales-bill.component.html',
  styleUrls: ['./sales-bill.component.scss']
})
export class SalesBillComponent implements OnInit {


  check_box_type = CheckBoxType;

  currentlyChecked: CheckBoxType;
  passed_flag:boolean = true;
  customernew_id: any;
  booking_historys: any;
  service_id: any;
  searchProduct
  searchPhoneNo: string;
  searchCus: string;
  serviceIds = [];
  advanceAmount:any=0;
  updateAmount: number;
  submitted: boolean=false;
  barcode: any;
  customerName:any
  searchPro: string;
  multi_product: any[];
  multi_product_list: any[];
  selectedPro: any;
  pro_id: any;

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
    {value:'CARD', name: 'CARD'},
    {value:'CASH', name: 'CASH'},
    {value:'UPI', name: 'UPI'},
   
    // {value:'Long Leave', name: 'Long Leave'},
  ]
  @ViewChild('dialog_single_product', { static: true }) dialog_single_product: TemplateRef<any>;
  @ViewChild('focus') search:ElementRef;
  transaction:any=0;
  selectedGST:any;
  selectedGstEvent:any;
  createFlag = false
  invoiceForm : FormGroup;
  dailog_ref: any;
  booking_history: any;
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
  selectedDiscount:any=0.00;
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
  igst: any="0";
  termsConditions: any="";
  prNumber: string | Blob="";
  poRaised: string | Blob="";
  poDate: string | Blob="";
  other
  cardChecked:any;
  store_name: string;
  user_name: string;
  total_include_tax:any=0;
  balanceAmount:any=0;
  selectedPayEvents:any;
  selectedEvents:any
  amount:any=0;
  change:any=0;
  extra:any;
 desc:any

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
    console.log(this.user_name)


    this.invoiceForm = this.formBuilder.group({
      invoiceCodeFormControl:['',],
      customerNameFormControl: ['',Validators.required],
      barCodeFormControl:['',],
      quantityFormControl:['',],
      subTotalFormControl:['',],
      gstFormControl:['',],
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
      paymentFormControl:['',],
      upiTypeFormControl:['',]

      
      

    });
    this.invoice_items=[];
    this.subtotal=0;
    this.gstValue=0;
    this.grandTotal=0;
    this.totalGst=0;
    this.gstTotal=0;
    
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
      //  this.booking_history = this.booking_historys.find(item => item.customer == data.id)
       console.log(data.id)
       this.get_bookingHistory(this.customer_id)

        }
      )
    }
    
    this.onEvnetChange(this.event); 
  }



  add_items():any {
    
    const data = {
      service_id:'',
      booking_id:'',
      item_id:'',
      item_description:'',
      quantity:'',
      unit:'',
      price:'',
      item_total:'',
      gst_value:'',
      tax:''
    }
    this.invoice_items.push(data)
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
    this.dailog_ref= this.dialogService.open(dialog, { context: this.customer_list })
    .onClose.subscribe(data => {
      this.searchCus = ""
      this.invoice_items = []
       this.customer_object = data 
       console.log(this.customer_object)  
       this.customer_id = data.id; 
       console.log(this.customer_id)   
       this.invoiceForm.controls['customerNameFormControl'].setValue(this.customer_object.customer_name);
       this.invoiceForm.controls['nameFormControl'].setValue(this.customer_object.customer_name);
       this.invoiceForm.controls['customerMobileNumberFormControl'].setValue(this.customer_object.phone_number);
       this.invoiceForm.controls['customerEmailFormControl'].setValue(this.customer_object.customer_email);
       this.invoiceForm.controls['advanceAmountFormControl'].setValue(this.customer_object.advance_amount);
      this.get_bookingHistory(this.customer_object.id)
      
    }
    );
    


  }
  get_bookingHistory(id){
    this.adminService.getBookinHistory(id).subscribe(
      (data2)=>{
        this.serviceIds = []
        this.booking_history = data2
        console.log(this.booking_history)
        this.booking_history.forEach(element => {
          console.log(element)
             this.booking_id= element.id  
             this.serviceIds.push(element.service_details[0].id)
              console.log("servic id" +this.serviceIds) 
            

                         
        });
        // let serviceids:any =this.booking_history.forEach(element => {
        //   console.log(element)
        //      this.booking_id= element.id  
        //      this.service_id = element.service_details[0].service__id
        //        console.log("servic id" +this.service_id)  
                         
        // });
        // console.log(serviceids)
        // this.serviceIds.push(this.serviceIds)
        console.log(this.serviceIds)
        console.log(this.booking_id)
        
        this.booking_history.forEach(element => {
          console.log(element)
          
          this.invoice_items.push(
            {item_id:"",
              booking_id:element.id,
              service_id:element.service_details[0].service__id,
              item_description:element.service_details[0].service__service_name,
              quantity:1,
              unit:"",
              unit_name:"nos",
              price:element.service_details[0].service__price,
              item_total:0,
              tax:element.service_details[0].service__service_gst,
              gst_value:0
            }
          )
          
   
          
          
        });
        this.calculate_price()
       
      }
    )
  }
  onEvnetChange(event) {
    this.event = event.target.value;
    this.calculate_price()
     
  }

  // gstCalculation(){
  //   let gsttotal:number=0;
  //   if(this.selectedGstEvent == "inclusiveGst"){
  //     let subtotalValue = this.invoiceForm.controls['subTotalFormControl'].value
  //     gsttotal = parseInt(subtotalValue) * 10/100;
  //     this.gstTotal = gsttotal
      
      
  //   }else if(this.selectedGstEvent == "exclusiveGst"){
  //     gsttotal = parseInt(this.invoiceForm.controls['subTotalFormControl'].value) * parseInt(this.invoiceForm.controls['gstTotalFormControl'].value)/100;
  //     this.gstTotal = gsttotal
      
  //   }
    
  // }

  calculate_price(): void {
   
    this.selectedDiscount =0;
    let total_item_price:any =0;
    let total_basic_price:any =0;
    let total_gst_value: any =0;

    this.invoice_items.forEach(element => {
      console.log('pro ele',element)
      let tot_price :any = (element.price * element.quantity )
      let gst_tot: any =((tot_price * element.tax)/100)
      let item_tot = tot_price + gst_tot;

      console.log('tot pri',tot_price)
      console.log('tot gst',gst_tot)
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
    this.subtotal = parseFloat(total_basic_price).toFixed(2) ;
    this.gstValue = parseFloat(total_gst_value).toFixed(2) ;

    console.log('siub tot',this.subtotal + 'gst', this.gstValue)
    let includeGST:any = (parseFloat(this.subtotal) + parseFloat(this.gstValue));
    this.selectedTotalGst = parseFloat(includeGST).toFixed(2)
    console.log('inc gst',this.selectedTotalGst)
    
    this.selectedDiscount =this.invoiceForm.get('discountFormControl').value;
    if (this.selectedDiscount >= 0) {
      
      //let amount :any = this.selectedTotalGst - this.selectedDiscount;
     
      this.grandTotal = Math.round(this.selectedTotalGst - this.selectedDiscount)  ;
    }else if(this.selectedDiscount === NaN ){
      this.grandTotal =0;
    }
    if(this.advanceAmount > this.grandTotal){
      this.balanceAmount=0
      this.updateAmount = this.advanceAmount - this.grandTotal
      console.log(this.updateAmount)
    }else{
      this.balanceAmount =parseFloat( this.grandTotal) - parseFloat(this.advanceAmount)
      console.log(this.balanceAmount)
      this.updateAmount = 0
    }
    if(this.balanceAmount > this.amount){
      this.change = 0;
    }else{
      this.change = (parseFloat(this.amount)-parseFloat(this.balanceAmount) )
    }

    // this.calculate_gatVal()
    // this.calculate_totalGst()
    // this.calculateGrandTotal()
  }

  
  // calculate_gst(){
  //   let gstvalue = 0;
  //   for(var val of this.invoice_items){
  //     this.gstValue += val.gst_value ;
  //    // return this.subtotal;
  //   }
  //   this.calculateGrandTotal();
     

  // }
/*   calculateGrandTotal(){
    let amount = parseInt(this.selectedTotalGst) - parseInt(this.selectedDiscount);
    this.grandTotal = amount;
  } */

  // calculate_total(){
  //   let subTotal = 0;
  //   for(var val of this.invoice_items){
  //     this.subtotal += val.item_total ;
  //    // return this.subtotal;
  //   }
  //   this.calculate_totalGst();
    
    
    
  // }
  // open_product_name(dialog: TemplateRef<any>, item) {
  //   this.inventoryService.getProductList().subscribe(
  //     (data) => {
  //         this.product_list = data;
         
  //         this.dailog_ref= this.dialogService.open(dialog, { context: this.product_list })
  //         .onClose.subscribe(data => {
  //           this.searchProduct =""
            
  //            this.selected_product = data  
  //            console.log(this.selected_product)
             
             
             
  //            this.inventoryService.getProduct(this.selected_product.id).subscribe(
  //              (data) =>{
  //                this.selected_product_data = data
  //                console.log(this.selected_product_data)
  //                this.product_id = data.id 
  //                console.log(this.product_id)
  //                data.product_price.forEach(element => {
  //                  console.log('ele',element)
  //                  console.log(element.unit.id)
  //                  {
                   
  //                   let sellPrice:any = parseFloat(element.sell_price) * element.qty ;
  //                   let gstVal:any = (sellPrice * parseFloat(element.tax) )/100;
  //                   let total:any = sellPrice + gstVal;
  //                   if(this.invoice_items.some(item => item.item_description == this.selected_product.product_name)){
  //                     this.nbtoastService.danger("product name already exist");
  //                   }else{
  //                   item.item_description = this.selected_product.product_name
  //                   item.booking_id="",
  //                   item.service_id="",
  //                   item.item_id=element.product_id,
  //                   console.log(item.item_id)
  //                   //item.price= parseFloat(sellPrice).toFixed(2),
  //                   item.price= element.sell_price
  //                   item.quantity= element.qty ? element.qty : 0,
  //                   item.unit_name=element.unit.PrimaryUnit,
  //                   item.unit = element.unit.id
  //                   item.tax=element.tax,
  //                   item.item_total = parseFloat(total).toFixed(2),
  //                   item.gst_value =  parseFloat(gstVal).toFixed(2)
  //                   }
  //                 }
  //                });
  //                this.calculate_price()
                 
  //              }
  //            )
             
             
              
  //         }
  //         );
  //     },
  //     (error) => {
  //       this.nbtoastService.danger(error.error.detail);
  //     }
  //   )

  // }

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
            // this.remaingAmount = Math.round(parseFloat(this.selectedTotalGst)- parseFloat(this.includegstremaing)) 



          })
      }
    )
  }


  bar_code(){
    let serial_no = this.invoiceForm.controls['barCodeFormControl'].value
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
              booking_id:"",
              service_id:"",
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




  open_phone_list(dialog: TemplateRef<any>) {
    this.dailog_ref= this.dialogService.open(dialog, { context: this.customer_list })
    .onClose.subscribe(data => {
      this.searchPhoneNo = ""
      this.invoice_items = []
       this.customer_object = data   
       this.customer_id = data.id;    
       this.invoiceForm.controls['customerNameFormControl'].setValue(this.customer_object.customer_name);
       this.invoiceForm.controls['nameFormControl'].setValue(this.customer_object.customer_name);
       this.invoiceForm.controls['customerMobileNumberFormControl'].setValue(this.customer_object.phone_number);
       this.invoiceForm.controls['customerEmailFormControl'].setValue(this.customer_object.customer_email);
       this.adminService.getBookinHistory(this.customer_object.id).subscribe(
        (data2)=>{
          
          this.booking_history = data2
          
          this.booking_history.forEach(element => {
               this.booking_id= element.id  
               this.service_id = element.service_details.map(item => {item.service__service_id})
               console.log("servic id" +this.service_id)          
          });
          console.log(this.booking_id)
          
          this.booking_history.forEach(element => {
            console.log('ele',element)
            this.invoice_items.push(
              {item_id:"",
                booking_id:element.id,
                service_id:element.service_details[0].service__id,
                item_description:element.service_details[0].service__service_name,
                quantity:1,
                unit:"nos",
                price:element.service_details[0].service__price,
                item_total:0,
                tax:element.service_details[0].service__service_gst,
                gst_value:0
              }
            )
            
            
          });
          this.calculate_price()
         
        }
      )
      
    }
    );
  }



  

  saveBill():any {
   
    const formData = new FormData();
    if(this.invoiceForm.controls['customerNameFormControl'].value != "" ){
    formData.append('po_type',this.poType)
    formData.append('pr_number',this.prNumber)
    formData.append('po_raised_by',this.poRaised)
    formData.append('po_date',this.poDate)
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
    formData.append('exchange', this.invoiceForm.controls['exchangeFormControl'].value);
    formData.append('cancel_invoice',this.invoiceForm.controls['cancelInvoiceFormControl'].value);
    formData.append('refund',this.invoiceForm.controls['refundFormControl'].value);
    formData.append('total_include_gst',this.selectedTotalGst)
    formData.append('total_gst_amount', this.gstValue);

    formData.append('user_id',this.user_name);
    formData.append('supervisor_id',this.invoiceForm.controls['supervisorIdFormControl'].value);
    formData.append('card_no',this.invoiceForm.controls['cardNoFormControl'].value);

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
    let data = {
      'advance_amount':this.updateAmount,
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
