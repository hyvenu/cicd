import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { SharedService } from 'src/app/shared/shared.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.scss']
})
export class ReportsListComponent implements OnInit {
  REPORT_LIST = [
    // { id:'1', report_name:'Monthly Salary Paid Report',report_file_name:'RptMonthlySalaryPaid',params:[{key:'',value:'',type:''}]},
    // { id:'2', report_name:'Monthly LIC Paid Report',report_file_name:'RptMonthlyLICReport',params:[{key:'',value:'',type:''}]},
    // { id:'3', report_name:'Daily Wages Salary Report',report_file_name:'RptDailyWagesSalaryReport',params:[{key:'',value:'',type:''}]},
    // { id:'4', report_name:'Monthly PF Report',report_file_name:'RptPFReport',params:[{key:'',value:'',type:''}]},
    // { id:'5', report_name:'Monthly Gratuity Report',report_file_name:'RptGratuityCalculations',params:[{key:'',value:'',type:''}]},
    // { id:'6', report_name:'Monthly Employee LOP Report',report_file_name:'RptMonthlyEmployeeLOPReport',params:[{key:'',value:'',type:''}]},
    // { id:'7', report_name:'Employee Bank Report Format',report_file_name:'RptPermanentEmployeeBankReport',params:[{key:'',value:'',type:''}]},
    // { id:'8', report_name:'Employee Salary Particulars Report',report_file_name:'RptEmployeeSalaryParticulars',params:[{key:'',value:'',type:''}]},
    // { id:'9', report_name:'Employee Professional Tax Report',report_file_name:'RptMonthlyProfessionTaxReport',params:[{key:'',value:'',type:''}]},
    // { id:'10', report_name:'Employee Details Report',report_file_name:'RptEmployeeDetails',params:[{key:'',value:'',type:''}]},
  ]

  constructor(private shareService:SharedService,
    private route: ActivatedRoute,
    private router: Router,
    private nbToasterService: NbToastrService,) { }

  ngOnInit(): void {
    this.shareService.getReportsNew().subscribe((data) => {
      let t = data.filter(a => {
        if(a.is_active) {
          return a;
        }
      })
      this.REPORT_LIST = t;
      console.log("REPORT LIST : ", this.REPORT_LIST);
    })
  }

  goToReportViewer(report): any {
    if(report) {
      let report_id = report.id;
      console.log("This is the selected Report : ", report);
      this.router.navigateByUrl('\ReportViewer?report_id='+report_id);
    }
    else {
      this.nbToasterService.info("No Report's Selected!");
    }
  }

}
