import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import {  ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as moment from 'moment';
import {sortBy} from 'lodash';


import { Color, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, SingleDataSet, BaseChartDirective } from 'ng2-charts';
import { AdminService } from 'src/app/admin/admin.service';
import { OrderService } from 'src/app/sales/order.service';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  custSettings = {
    pager: {
      display: true,
      perPage: 3
    },
    actions: {
      add: false,
      edit: false,
      delete: false,
    },

    columns: {
      id: {
        title: 'id',
        hide: true
      },
      customer_code: {
        title: 'Customer Code',
        hide: true
      },
      customer_name: {
        title: 'Customer Name',
        type: 'html',
        id:'name',
        onclick: "name()",
        valuePrepareFunction: (cell, row) => {
          return `<a href="ManageBooking?id=${row.customer_id}">${row.customer_name}</a>`;
        }
      },
      phone_number:{
        title: 'Phone Number',
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          return `<a href="ManageCustomer?id=${row.id}">${row.phone_number}</a>`;
        }
      },
      // customer_email: {
      //   title: 'Customer Email',
      // },


    },
  };
  orders_data: [];
  options: any;
  headspacount: any;
  monthlySalesList: any;
  monthlyPurchaseList: any;
  dailyStatus: any;

  @ViewChild(BaseChartDirective) baseChart: BaseChartDirective;

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
  barChartLabels: Label[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartData: any =[
    { data: [], label: 'Bookings' },
  ];

  barChartOptions2: ChartOptions = {
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
  barChartLabels2: Label[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul','Aug','Sept','Oct','Nov','Dec'];
  barChartType2: ChartType = 'bar';
  barChartLegend2 = true;
  barChartData2: ChartDataSets[] = [
    { data: [0,0,0,0,0,0,0,0,0,0,0,0], label: 'Sales' },
    { data: [0,0,0,0,0,0,0,0,0,0,0,0], label: 'Purchase' }
  ];

  barChartOptions3: ChartOptions = {
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
  barChartLabels3: Label[] = [];
  barChartType3: ChartType = 'bar';
  barChartLegend3 = true;
  barChartData3: ChartDataSets[] = [
    { data: [], label: 'Top Services' }
  ];

   // Pie
  pieChartOptions: ChartOptions = {
    responsive: true,
  };

  public pieChartLabels: Label[] = [];
  // public pieChartLabels: Label[] = [['Head Spa'], ['Hair ','Straightening'], 'SPA'];
  public pieChartData:any[]=[];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  //Sales Line
  s_lineChartData: any[] = [
    { data: [], label: 'Sales'},
  ];
  s_lineChartLabels: Label[] = [];
  s_lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];
  //Sales Line

  //Store Line
  lineChartData: any[] = [
    { data: [], label: 'Daily Booknig'},
      //  { data: [50,100,200,250,300,400,130], label: 'Daily Booknig',
      // },
    // { data: [10,30,20,50,30,40,10], label: 'Sales',
    //   },
  ];
   lineChartLabels: Label[] = [];
  // public lineChartOptions: (ChartOptions & { annotation: any }) = {
  //   responsive: true,
  // };
   lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];
  //Store Line

   lineChartLegend = true;
   lineChartType = 'line';
   lineChartPlugins = [];

   appointmentlist: any;
   department_list: any;
   customerList: any = [];





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
    this.get_bookingservice();
    this.get_customer_list();

    this.sharedService.getDashboardSalesList().subscribe((data) => {
      this.monthlySalesList = data;
      this.monthlySalesList.forEach(element => {
        this.barChartData2[0]["data"][element.month-1]=element.total_sales;
      });
      //this.baseChart.ngOnChanges({});
    })
    this.sharedService.getDashboardPurchaseList().subscribe((data) => {
      this.monthlyPurchaseList = data;
      this.monthlyPurchaseList.forEach(element => {
        this.barChartData2[1]["data"][element.month-1]=element.total_purchase;
      });
      //this.baseChart.ngOnChanges({});
    })
    console.log("bar chart data",this.barChartData)
    this.sharedService.getDashboardDailyStatusList().subscribe((data) => {
      this.dailyStatus = data;
      console.log("daily stats",data)
    })



    // this.pieChartData = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    //console.log(this.pieChartData)
    // this.barChartData= [
    //   { data:[0,0,0,0,0], label:"Bookings"}
    // ]

  }

  get_customer_list() {
    this.adminService.getCustomerList().subscribe(
      (data) => {
        this.customerList.push(
          ...data
        )
        console.log("Cust List",this.customerList);
        //this.active= this.customerList.filter(item => item.active === true);
        //this.inactive = this.customerList.filter(item => item.active === false);

      },
      (error) => {
        this.nbtoastService.danger("Unable to get customer List")
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
    this.sharedService.getDashboardbookingDetails().subscribe(
      data => {
        console.log("topservices",data)
        let label_data = []
        let price_data = []
        data.forEach(element => {
          label_data.push(element.service_name)
          price_data.push(element.price_value)

        });
        this.barChartLabels3 = label_data
        this.barChartData3[0].data = price_data
      }
    )
  }

  // get_bookingservice(){
  //   this.sharedService.getDashboardbookingDetails().subscribe(
  //     data => {
  //       console.log("topservices",data)
  //       const appointment_details = data.reduce((acc,v) =>{
  //         const label = v.service_list[0].service__service_name
  //         acc[label] = (acc[label] || 0) + 1
  //         return acc
  //       },{})
  //       this.pieChartLabels = Object.keys(appointment_details)
  //       this.pieChartData = Object.values(appointment_details)

  //       const appointment_booking_details = data.reduce((acc,v) =>{
  //         let d = moment(v.booking_date);
  //         const bookdate = d.format('MMM YYYY')
  //         acc[bookdate] = (acc[bookdate] || 0) + 1
  //         return acc
  //       },{})
  //       this.barChartLabels = Object.keys(appointment_booking_details)
  //       this.barChartData.forEach(b_data => {
  //         b_data.data = Object.values(appointment_booking_details)
  //       })
  //      // this.barChartData[0].data =
  //       let sortedData = sortBy(data, 'booking_date');
  //       console.log(sortedData)
  //      const daily_booking_details = sortedData.reduce((acc,v) =>{

  //       let d = moment(v.booking_date);

  //       const bookdate = d.format('MMM DD')
  //       acc[bookdate] = (acc[bookdate] || 0) + 1
  //       return acc
  //     },{})
  //     this.lineChartLabels = Object.keys(daily_booking_details)
  //     this.lineChartData.forEach(l_data => {
  //       l_data.data = Object.values(daily_booking_details)
  //     })
  //     }
  //   )
  // }

  // get_sales_details() {
  //   this.sharedService.getDashboardSalesDetails().subscribe(
  //     data => {
  //       let total = [];
  //       let dates = [];
  //       data.forEach(element => {
  //         console.log("Sales Date",element.date)
  //         //this.s_lineChartData[0].data.push({ data:[element.grand_total], label: element.date})
  //        total.push(element.grand_total)
  //        dates.push(element.date)

  //       });

  //       this.s_lineChartData[0].data = total;
  //       this.s_lineChartLabels= dates;

  //       console.log("Sales Dash Details",data)
  //     }
  //   )
  // }
}



