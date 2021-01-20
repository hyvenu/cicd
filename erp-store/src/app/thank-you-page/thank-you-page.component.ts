import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-thank-you-page',
  templateUrl: './thank-you-page.component.html',
  styleUrls: ['./thank-you-page.component.scss']
})
export class ThankYouPageComponent implements OnInit {
  OrderId: any;
  error_flag: any;

  constructor(private route:ActivatedRoute) { }

  ngOnInit(): void {
    console.log(this.error_flag);
    this.OrderId = this.route.snapshot.queryParams["order_number"];
    this.error_flag = this.route.snapshot.queryParams["error"];
   
     
  }

}
