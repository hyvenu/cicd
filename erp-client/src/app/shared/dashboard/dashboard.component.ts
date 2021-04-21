import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import {  ChartDataSets, ChartOptions, ChartType } from 'chart.js';


import { Color, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, SingleDataSet } from 'ng2-charts';
import { OrderService } from 'src/app/sales/order.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  orders_data: [];
  options: any;

  barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    // scales: { xAxes: [{}], yAxes: [{}] },
    // plugins: {
    //   datalabels: {
    //     anchor: 'end',
    //     align: 'end',
    //   }
    // }
  };
  barChartLabels: Label[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  

  barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Booking' },
    // { data: [28, 48, 40, 19, 86, 27, 90], label: 'Cancel' }
  ];

   // Pie
  pieChartOptions: ChartOptions = {
    responsive: true,
  };
  pieChartLabels: Label[] = [['Hair Cut', ''], ['Hair Straightening'], 'SPA'];
  pieChartData: SingleDataSet = [300, 500, 100];
  pieChartType: ChartType = 'pie';
  pieChartLegend = true;
  pieChartPlugins = [];
  
  // Line 
   lineChartData: ChartDataSets[] = [
    { data: [50,100,200,250,300,400,130], label: 'Daily Booknig',
       },
    { data: [10,30,20,50,30,40,10], label: 'Sales',
      },
  ];
   lineChartLabels: Label[] = ['1', '2', '3', '4', '5', '6', '7'];
  // public lineChartOptions: (ChartOptions & { annotation: any }) = {
  //   responsive: true,
  // };
   lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];
   lineChartLegend = true;
   lineChartType = 'line';
   lineChartPlugins = [];
  
  constructor(
    private orderService: OrderService,
    private nbtoastService: NbToastrService,
    private dialogService: NbDialogService,
    private routes: Router
  ) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
   }

  ngOnInit(): void {
    this.get_orders_data();
  }

  get_orders_data(){
    const order_data  = { 'store_id': sessionStorage.getItem('store_id')}
    this.orderService.getOrderList(order_data).subscribe(
      (data) => {
          if(data.length > 0){
          this.orders_data = data;
          }else{
            this.orders_data = []
          }
      },
      (error) => {
          this.nbtoastService.danger(error.error.detail);
      }
    )
  }
}
