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
  invoice_details: any;

  constructor(private route: ActivatedRoute,
              private orderservice:OrderService) { }

  ngOnInit(): void {

    const printBtn: HTMLElement = document.getElementById('print');
printBtn.onclick = function () {
  printDiv('bill');
};

    let invoice = this.route.snapshot.queryParams['id']

    if(invoice){
      this.orderservice.getPODetails(invoice).subscribe(
        (data)=>{
          this.invoice_details = data
          

        }
      )
    }


  }

}
