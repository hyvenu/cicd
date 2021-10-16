import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  grandTotal: any;
  customer_name: any;
  customer_addr: any;
  store_name: any;
  invoice_no: any;
  invoice_date: any;
  data: any=[];
  discount: any;
  sum: any=0;

  constructor(private route: ActivatedRoute,
              private orderservice:OrderService) { }

  ngOnInit(): void {

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
          this.data = JSON.stringify(this.invoice_details)
          let da =JSON.parse(this.data)
          da.forEach(element => {
            console.log(element)
            
            this.sum += element.discount_price;
            
            
          });
          console.log(this.sum)

        
        
          

        }
      )
    }


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
