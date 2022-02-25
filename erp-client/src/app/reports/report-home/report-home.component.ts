import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { SharedService } from 'src/app/shared/shared.service';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-report-home',
  templateUrl: './report-home.component.html',
  styleUrls: ['./report-home.component.scss']
})
export class ReportHomeComponent implements OnInit {

  REPORT_LIST = [
    // { report_name:'Monthly Salary Paid Report',report_file_name:'RptMonthlySalaryPaid',params:[{key:'',value:'',type:''}]},
    // { report_name:'Monthly LIC Paid Report',report_file_name:'RptMonthlyLICReport',params:[{key:'',value:'',type:''}]},
    // { report_name:'Daily Wages Salary Report',report_file_name:'RptDailyWagesSalaryReport',params:[{key:'',value:'',type:''}]},
    // { report_name:'Monthly PF Report',report_file_name:'RptPFReport',params:[{key:'',value:'',type:''}]},
    // { report_name:'Monthly Gratuity Report',report_file_name:'RptGratuityCalculations',params:[{key:'',value:'',type:''}]},
    // { report_name:'Monthly Employee LOP Report',report_file_name:'RptMonthlyEmployeeLOPReport',params:[{key:'',value:'',type:''}]},
    // { report_name:'Employee Bank Report Format',report_file_name:'RptPermanentEmployeeBankReport',params:[{key:'',value:'',type:''}]},
    // { report_name:'Employee Salary Particulars Report',report_file_name:'RptEmployeeSalaryParticulars',params:[{key:'',value:'',type:''}]},
    // { report_name:'Employee Professional Tax Report',report_file_name:'RptMonthlyProfessionTaxReport',params:[{key:'',value:'',type:''}]},
    // { report_name:'Employee Details Report',report_file_name:'RptEmployeeDetails',params:[{key:'',value:'',type:''}]},
  ]

  REPORT_CREDENTIAL = {
    J_USER_NAME:'',
    J_PASSWORD:'',
    J_SERVER_URL:'',
  }
 

  constructor(
    private shareService:SharedService,
    private route: ActivatedRoute,
    private router: Router,
    private nbToasterService: NbToastrService,
  ) { }

  ngOnInit(): void {
    console.log("hi")
    this.shareService.getAppSettings().subscribe(
      (data) =>{
        console.log(data);
          this.REPORT_CREDENTIAL.J_SERVER_URL = data?.JASPER_SERVER_URL;
          this.REPORT_CREDENTIAL.J_USER_NAME = data?.JASPER_USERNAME;
          this.REPORT_CREDENTIAL.J_PASSWORD = data?.JASPER_PASSWORD;
      },
      (error) => {
          this.nbToasterService.danger("Unable to load report permissions");
      }
    );

    this.shareService.getReports().subscribe(
      (data) => {
        this.REPORT_LIST = data;
      },
      (error) => {
        this.nbToasterService.danger("Unable to load Report list ");
      }

    )
  }

  selected_report_pdf(report):any {

      // var url = '?resource_name=' + report.report_file_name + '.pdf' + '&params='+ report.params;
      // this.router.navigateByUrl('ReportView'+url);
      // alert(report.report_file_name);
      var data =this.REPORT_CREDENTIAL.J_SERVER_URL + "flow.html?_flowId=viewReportFlow&_flowId=viewReportFlow&ParentFolderUri=/ERP/Reports&reportUnit=/ERP/Reports/"+report.report_file_name+"&standAlone=true&decorate=no"
      data = data + "&j_username="+ this.REPORT_CREDENTIAL.J_USER_NAME +'&j_password=' + this.REPORT_CREDENTIAL.J_PASSWORD;
      // console.log(data);
      window.open(data);
  }
}
