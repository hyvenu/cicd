import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { sub } from 'date-fns';
import { AdminService } from 'src/app/admin/admin.service';
import { InventoryService } from 'src/app/inventory/inventory.service';

@Component({
  selector: 'app-sales-bill',
  templateUrl: './sales-bill.component.html',
  styleUrls: ['./sales-bill.component.scss']
})
export class SalesBillComponent implements OnInit {


  gst_list=[
    {name:"InclusiveGst", value:"InclusiveGst"},
    {name:"ExclusiveGst", value:"ExclusiveGst"},

  ]
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
  subtotal: number=0;
  gstTotal:number=0;
  selectedSubTotal:any;
  selectedGstPercentage:any=0;
  event: any;

  constructor(
    private formBuilder: FormBuilder,
    private adminService:AdminService,
    private inventoryService:InventoryService,
    private nbtoastService: NbToastrService,
    private dialogService: NbDialogService,
  ) { }

  ngOnInit(): void {

    this.invoiceForm = this.formBuilder.group({
      salesNewFormControl:['',Validators.required],
      customerNameFormControl:['',Validators.required],
      serviceNameFormControl:['',Validators.required],
      barCodeFormControl:['',Validators.required],
      quantityFormControl:['',Validators.required],
      subTotalFormControl:['',Validators.required],
      gstFormControl:['',Validators.required],
      gstTotalFormControl:['',Validators.required],
      discountFormControl:['',Validators.required],
      grandTotalFormControl:['',Validators.required],
      cardFormControl:['',Validators.required],
      cashFormControl:['',Validators.required],
      upiFormControl:['',Validators.required],
      transactionIdFormControl:['',Validators.required],
      subTotalProductFormControl:['',Validators.required],
      exchangeFormControl:['',Validators.required],
      cancelInvoiceFormControl:['',Validators.required],
      refundFormControl:['',Validators.required],
      nameFormControl:['',Validators.required],
      customerMobileNumberFormControl:['',Validators.required],
      customerEmailFormControl:['',Validators.required],
      cardNoFormControl:['',Validators.required],
      storeIdFormControl:['',Validators.required],
      userIdFormControl:['',Validators.required],
      supervisorIdFormControl:['',Validators.required],
      gstCalculateFormControl:['',Validators.required],

    });
    this.invoice_items=[];
    
    this.calculate_total();
    console.log(this.selectedSubTotal)
    this.adminService.getCustomerList().subscribe(
      (data) => {
        this.customer_list = data;
         
        
      },
      (error) => {
        this.nbtoastService.danger("Unable to get customer List")
      }
    )

    
      
    
  }

  add_items():any {
    
    const data = {item_id:'',item_description:'',quantity:'',unit:'',price:'',item_total:''}
    this.invoice_items.push(data)
    this.calculate_price()
  }

  remove_item(item): void{
    const index: number = this.invoice_items.indexOf(item);
    if (index !== -1) {
        this.invoice_items.splice(index, 1);
    } 
    this.calculate_price()
  }

  open(dialog: TemplateRef<any>) {
    this.dailog_ref= this.dialogService.open(dialog, { context: this.customer_list })
    .onClose.subscribe(data => {
       this.customer_object = data       
       this.invoiceForm.controls['customerNameFormControl'].setValue(this.customer_object.customer_name);
       this.invoiceForm.controls['nameFormControl'].setValue(this.customer_object.customer_name);
       this.invoiceForm.controls['customerMobileNumberFormControl'].setValue(this.customer_object.customer_email);
       this.invoiceForm.controls['customerEmailFormControl'].setValue(this.customer_object.phone_number);
       this.adminService.getBookinHistory(this.customer_object.id).subscribe(
        (data2)=>{
          this.booking_history = data2
          console.log(this.booking_history)
          this.booking_history.forEach(element => {
            this.invoice_items.push(
              {item_id:element.id,
                item_description:element.service__service_name,
                quantity:0,
                unit:1,
                price:element.service__price,
                item_total:0
              }
            )
            
            
          });
          this.calculate_total()
         
        }
      )
      
    }
    );
    


  }
  onEvnetChange(event) {
    this.event = event.target.value;
     
  }

  gstCalculation(){
    let gsttotal:number=0;
    if(this.selectedGstEvent == "inclusiveGst"){
      
      gsttotal += parseInt(this.selectedSubTotal) * 10/100;
      this.gstTotal = gsttotal
      
      
      
    }else if(this.selectedGstEvent == "exclusiveGst"){
      gsttotal += parseInt(this.selectedSubTotal) * parseInt(this.selectedGstPercentage)/100;
      this.gstTotal = gsttotal
      
    }
    
  }

  calculate_price(): void {
    
    for(let i=0;i<this.invoice_items.length;i++)
    {
      let price = parseFloat(this.invoice_items[i].quantity) * (parseFloat(this.invoice_items[i].price));
      if(price !=NaN && this.invoice_items[i].quantity != "")
      {
        this.invoice_items[i].item_total = price;
      }     
    }
    this.calculate_total()
  }


  open_product_name(dialog: TemplateRef<any>, item) {
    this.inventoryService.getProductList().subscribe(
      (data) => {
          this.product_list = data;
          this.dailog_ref= this.dialogService.open(dialog, { context: this.product_list })
          .onClose.subscribe(data => {
            console.log(data);
             this.selected_product = data      
             console.log(this.selected_product.product_name)
             item.item_description = this.selected_product.product_name
             this.inventoryService.getProduct(this.selected_product.id).subscribe(
               (data) =>{
                 this.selected_product_data = data
                 data.product_price.forEach(element => {
                   {item.price=element.sell_price,
                    item.quantity=0,
                    item.unit=element.unit.PrimaryUnit,
                    item.item_total = 0
                    
                  }
                 });
                 this.calculate_total()
                 
               }
             )
             
             
          }
          );
      },
      (error) => {
        this.nbtoastService.danger(error.error.detail);
      }
    )

  }

  calculate_total(){
    let subTotal = 0;
    for(var val of this.invoice_items){
      subTotal += val.item_total ;
     // return this.subtotal;
    }
    
    this.subtotal = subTotal;
    
  }



  

  saveProduct():any {
   
    const formData = new FormData();
   
    formData.append('booking_history', this.booking_id);
    formData.append('qty', this.invoiceForm.controls['quantityFormControl'].value);
    formData.append('subtotal_amount', this.invoiceForm.controls['subTotalFormControl'].value);
    formData.append('gst', this.invoiceForm.controls['gstFormControl'].value);
    formData.append('total', this.invoiceForm.controls['totalFormControl'].value);
    formData.append('disc_amount', this.invoiceForm.controls['discountFormControl'].value);
    formData.append('grand_total', this.invoiceForm.controls['grandTotalFormControl'].value);
    formData.append('card', this.invoiceForm.controls['cardFormControl'].value);
    formData.append('cash', this.invoiceForm.controls['cashFormControl'].value);
    formData.append('upi', this.invoiceForm.controls['upiFormControl'].value);
    formData.append('transaction_id', this.invoiceForm.controls['transactionIdFormControl'].value);
    formData.append('exchange', this.invoiceForm.controls['exchangeFormControl'].value);
    formData.append('cancel_invoice',this.invoiceForm.controls['cancelInvoiceFormControl'].value);
    formData.append('refund',this.invoiceForm.controls['refunfFormControl'].value);
    formData.append('subtotal_product_amount',this.invoiceForm.controls['subTotalProductFormControl'].value)
    formData.append('store',sessionStorage.getItem('store_id'))
    
    formData.append('user_id',this.invoiceForm.controls['userIdFormControl'].value);
    formData.append('supervisor_id',this.invoiceForm.controls['supervisorIdFormControl'].value);
    formData.append('card_no',this.invoiceForm.controls['cardNOFormControl'].value)

    formData.append('invoice_items_list', JSON.stringify(this.invoice_items));
   

    this.adminService.saveInvoice(formData).subscribe(
      (data) => {
        this.nbtoastService.success("invoice Saved Successfully")
        
        
        this.invoiceForm.reset();
        window.location.reload();
        
      },
      (error) =>{
        this.nbtoastService.danger(error.error.detail);
       
      }
    )
  }

 

}
