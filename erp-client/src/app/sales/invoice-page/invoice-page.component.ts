import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/admin/admin.service';
import { OrderService } from '../order.service';
import { printDiv } from '../print_div';

@Component({
  selector: 'app-invoice-page',
  templateUrl: './invoice-page.component.html',
  styleUrls: ['./invoice-page.component.scss']
})
export class InvoicePageComponent implements OnInit {
  invoice_details: any=[];
  invoice_data: any;
  grandTotal: any=0.00;
  customer_name: any;
  customer_addr: any;
  store_name: any;
  invoice_no: any;
  invoice_date: any;
  data: any=[];
  discount: any;
  sum: any=0;
  store_id: string;
  store_list: any;
  address: any;
  gst: any;
  invoice_items: any=[];
  store_pincode: any;

  constructor(private route: ActivatedRoute,
              private orderservice:OrderService,
              private adminService: AdminService,) { }

  ngOnInit(): void {

    this.store_id = sessionStorage.getItem('store_id');
    console.log(this.store_id)

//     const printBtn: HTMLElement = document.getElementById('print');
// printBtn.onclick = function () {
//   printDiv('bill');
// };

    let invoice = this.route.snapshot.queryParams['id']

    if(invoice){
      this.orderservice.getPODetails(invoice).subscribe(
        (data)=>{
          
          console.log("invoice details"+data)
          this.invoice_details = data
          this.grandTotal = this.invoice_details.grand_total
          this.customer_name = this.invoice_details.customer__customer_name
          this.customer_addr = this.invoice_details.customer__customer_address
          this.store_name = this.invoice_details.store__store_name
          this.invoice_no = this.invoice_details.invoice_no
          this.invoice_date= this.invoice_details.po_date
          this.data = JSON.stringify(data)
          console.log(this.data)
          let da =JSON.parse(this.data)
          da.forEach(element => {
            console.log(element)
            
            this.sum += element.discount_price;
            
            
          });
          console.log(this.sum)

        
        
          

        }
      )
    }

    this.adminService.getStoreDetails(this.store_id).subscribe(
      data=>{
        console.log(data)
        this.store_list = data
        console.log(this.store_list)
        this.store_name = data[0].store_name
        console.log(this.store_name)
        this.address = data[0].address
        this.gst = data[0].gst_no
        console.log(this.gst)
        this.store_pincode = data[0].pincode
      }
    )


  }
  add_items():any {
    
    const data = {
      item_id:'',
      item_description:'',
      qty:1,
      unit_price:'',
      gst:0,
      discount_price:0,
      subtotal_amount:''
    }
    this.invoice_items.push(data)
    //this.calculate_price()
    // this.calculate_gst()
    // this.calculate_totalGst()
  }

  remove_item(item): void{
  
    const index: number = this.invoice_items.indexOf(item);
    
    if (index !== -1) {
        this.invoice_items.splice(index, 1);
    } 
    this.calculate_price()
  
   console.log(this.invoice_items)
    // this.calculate_gst()
    // this.calculate_totalGst()
  }

  calculate_price(){
    let total_price=0
    let total_amount
    let gst

    this.invoice_items.forEach(element => {
      // console.log(element)
      
        total_price = element.qty * element.unit_price;
        gst = (total_price * element.gst)/100;
        total_price = total_price+ gst
        total_amount = total_price - element.discount_price;
        element.subtotal_amount=total_amount;
      
      
    });
    this.calculate_grandTotal()
    
  }

  calculate_grandTotal(){
    let tot:any=0.00
    let grandTotal:any=0.00
    this.invoice_items.forEach(element => {
      console.log(element.subtotal_amount)
      tot += element.subtotal_amount
     
    })
    this.grandTotal = parseFloat(tot)
    console.log(tot)
    console.log(this.grandTotal)
   this.invoice_details.order_details.forEach(element => {
    grandTotal = parseFloat(grandTotal) + parseFloat(element.subtotal_amount)
   });
   console.log(grandTotal)
   if(tot==0.0){
    this.grandTotal =  parseFloat(grandTotal);
    
   }else{
    this.grandTotal = parseFloat(tot) + parseFloat(grandTotal);
   }
   console.log(this.grandTotal)
     
    
  }


  // CallPrint(bill) {
  //   var prtContent = document.getElementById(bill);
  //   var WinPrint = window.open('', '', 'left=0,top=0,width=600,height=400,toolbar=1,scrollbars=1,status=0');
    // WinPrint.document.write('<html><head><title></title></head>');
    // WinPrint.document.write('<body style="font-family:verdana; font-size:14px;width:110px;height:200px:" >');
    // WinPrint.document.write(prtContent.innerHTML);
    // WinPrint.document.write('</body></html>');
    // WinPrint.document.close();
    // WinPrint.focus();
    // WinPrint.print();
    // WinPrint.close();
    //prtContent.innerHTML = "";
// }
  // printPage(){
  //   window.print()
  // }

}
