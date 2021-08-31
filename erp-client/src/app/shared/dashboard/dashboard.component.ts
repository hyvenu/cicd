import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import {  ChartDataSets, ChartOptions, ChartType } from 'chart.js';


import { Color, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, SingleDataSet } from 'ng2-charts';
import { AdminService } from 'src/app/admin/admin.service';
import { OrderService } from 'src/app/sales/order.service';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  orders_data: [];
  options: any;
  headspacount: any;
  

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
  
  public pieChartLabels: Label[] = [];
  // public pieChartLabels: Label[] = [['Head Spa'], ['Hair ','Straightening'], 'SPA'];
  public pieChartData:ChartDataSets[];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  
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
  appointmentlist: any;
  department_list: any;
  
  
  constructor(
    private orderService: OrderService,
    private sharedService: SharedService,
    private adminService:AdminService,
    private nbtoastService: NbToastrService,
    private dialogService: NbDialogService,
    private routes: Router
  ) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
    
   }

  ngOnInit(): void {
    this.get_orders_data();
    this.get_bookingservice();
    
    
    this.pieChartData = [0,0,0];
    console.log(this.pieChartData)

  }

  get_orders_data(){
    const order_data  = { 'store_id': sessionStorage.getItem('store_id')}
    this.orderService.getOrderList(order_data).subscribe(
      (data) => {
        console.log(data)
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

  get_department(){
    this.sharedService.getDepartmentList().subscribe(
      data =>{
        this.department_list = data

      }
    )
  }


  get_bookingservice(){
    this.adminService.getAppointmentList().subscribe(
      data=>{
        this.appointmentlist = data
        console.log(this.appointmentlist)
        let count = this.appointmentlist.filter(item=> item.service__service_name == "head spa").length;
        this.headspacount = count; 
        console.log(this.headspacount)
        this.pieChartData = [100, this.headspacount, 100]
        this.pieChartLabels = this.appointmentlist.reduce((acc,v) =>{
          const label = v.service__service_name
          if(!acc.includes(label)){
            return [...acc,label]
          }
          return acc
        },[])
        // const labels = this.appointmentlist.map(item => item.service__service_name)
        
      }
    )
  }
}


head spa = 4
