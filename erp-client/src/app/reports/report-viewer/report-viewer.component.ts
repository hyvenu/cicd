import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { SharedService } from 'src/app/shared/shared.service';
import { FileSaver, saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as xlsx from 'xlsx';
import { Table } from 'primeng/table';
import { DatePipe } from '@angular/common';



import * as  XLSX from "xlsx";





@Component({
  selector: 'app-report-viewer',
  templateUrl: './report-viewer.component.html',
  styleUrls: ['./report-viewer.component.scss']
})
export class ReportViewerComponent implements OnInit {

  report_id: any;
  report_name: any;
  report_main_header: any;
  report_sub_header: any;
  sql_output: any;
  sql_output2: any;
  columnTotal: any;
  column_needs_total: any;
  length: any;
  from_date: any;
  to_date: any;
  from: any;
  to: any;
  filtered_columns: any = [];
  filtered_sql_output2: any = [];
  filtered_obj_columns: any = [];
  columns: any;
  headerColumns: any;
  sales: any;
  selectedRows: any;
  customExportHeader: any;
  to_filter_column: any;
  selectedColumns: any = [];
  filtered_sql_output: any;
  filteredValues: any;
  Excelfile:"list.xlsx"
  
  constructor(private routes: Router,
    private route: ActivatedRoute,
    private nbToasterService: NbToastrService,
    private sharedService: SharedService,private datePipe: DatePipe) { }
   

  ngOnInit(): void {
    
    this.report_id = this.route.snapshot.queryParams['report_id'];
    this.showAllData();
  }

  showAllData() {
    this.sharedService.getReportbyIDAndType(this.report_id, this.from_date='NULL', this.to_date='NULL').subscribe(
      (data) => {
        console.log("Incoming Data : ", data);
        this.report_name = data.report_name;
        this.report_main_header = data.report_main_header;
        this.report_sub_header = data.report_sub_header;

        this.sql_output = data.sql_output;
        this.columns = Object.keys(this.sql_output);
        this.columns.forEach((ele) => {
          this.filtered_obj_columns.push({ name: ele, value: ele })
        })
        console.log("columns header",this.filtered_obj_columns)
        this.to_filter_column = data.sql_output
        this.length = this.sql_output[this.columns[0]].length;
        this.column_needs_total = data.numerical_columns;
        this.length = this.sql_output[this.columns[0]].length;
        this.column_needs_total = data.numerical_columns;

        this.headerColumns = Object.keys(this.sql_output);
        for(let i=0; i < this.headerColumns.length; ++i) {
          let column = this.headerColumns[i];
          column = column.replaceAll('_', ' ');
          this.headerColumns[i] = column.replace(/(?:^|\s)\S/g, (res) => { return res.toUpperCase(); })
        }

        this.columnTotal = [];
        for (let i = 0; i < this.columns.length; i++) {
          let sum: any = 0;
          if(this.column_needs_total.find(element => element == this.columns[i])) {
            for (let j = 0; j < this.sql_output[this.columns[i]].length; j++) {
              sum += Number(this.sql_output[this.columns[i]][j]);
            }
            sum = Math.round(sum * 100)/100;
          }
          else {
            sum = '';
          }
          this.columnTotal.push(sum);
        }
        // this.columnTotal[0] = 'TOTAL';

        // Converting the sql_output for the primeng table
        let converted_sql_output = [[]];
        this.columns = Object.keys(this.sql_output);
        for(let i=0; i < this.length; ++i) {
          let row = [];
          for(let j=0; j < this.columns.length; ++j) {
            row[this.columns[j]] = this.sql_output[this.columns[j]][i];
          }
          converted_sql_output.push(row);
        }
        converted_sql_output.shift();
        this.sql_output = converted_sql_output;
        
        // Converting the sql_output again for the exportPdf() 
        let double_converted_output = [[]];
        this.sql_output2 = this.sql_output;
        for (let i = 0; i < this.length; i++) {
          let row = [];
          for (let j = 0; j < this.columns.length; j++) {
            row[j] = this.sql_output2[i][this.columns[j]];
          }
          double_converted_output.push(row);
        }
        double_converted_output.shift();
        this.sql_output2 = double_converted_output;
      }
    );
  }

  showData() {
    // this.filtered_obj_columns=[];
    this.from_date = this.datePipe.transform(this.from_date, 'yyyy-MM-dd');
    this.to_date = this.datePipe.transform(this.to_date, 'yyyy-MM-dd');
    this.from = this.from_date;
    this.to = this.to_date;
    console.log("From date ", this.from_date, " To Date ", this.to_date);
    
    // After selecting the date range new updated data
    this.sharedService.getReportbyIDAndType(this.report_id, this.from_date, this.to_date).subscribe(
      (data) => {
        this.sql_output = data.sql_output;
        this.columns = Object.keys(this.sql_output);
        this.length = this.sql_output[this.columns[0]].length;
  
        this.columnTotal = [];
        for (let i = 0; i < this.columns.length; i++) {
          let sum: any = 0;
          if(this.column_needs_total.find(element => element == this.columns[i])) {
            for (let j = 0; j < this.sql_output[this.columns[i]].length; j++) {
              sum += Number(this.sql_output[this.columns[i]][j]);
            }
            sum = Math.round(sum * 100)/100;
          }
          else {
            sum = '';
          }
          this.columnTotal.push(sum);
        }
        // this.columnTotal[0] = 'TOTAL';
  
        // Converting the sql_output for the primeng table
        let converted_sql_output = [[]];
        for(let i=0; i < this.length; ++i) {
          let row = [];
          for(let j=0; j < this.columns.length; ++j) {
            row[this.columns[j]] = this.sql_output[this.columns[j]][i];
          }
          converted_sql_output.push(row);
        }
        converted_sql_output.shift();
        this.sql_output = converted_sql_output;
        
        // Converting the sql_output again for the exportPdf() 
        let double_converted_output = [[]];
        this.sql_output2 = this.sql_output;
        for (let i = 0; i < this.length; i++) {
          let row = [];
          for (let j = 0; j < this.columns.length; j++) {
            row[j] = this.sql_output2[i][this.columns[j]];
          }
          double_converted_output.push(row);
        }
        double_converted_output.shift();
        this.sql_output2 = double_converted_output;
      }
    );
  }

  clear(table: Table) {
    table.clear();
    this.showAllData();
  }
  onChangeHandler(event) {
    console.log("sujan", event.value)
    const _ = require('lodash');
    this.filtered_sql_output = _.pick(this.to_filter_column, event.value)
    this.filtered_columns = Object.keys(this.filtered_sql_output);
    //Numerical columns total 
    this.columnTotal = [];
    for (let i = 0; i < this.filtered_columns.length; i++) {
      let sum: any = 0;
      if (this.column_needs_total.find(element => element == this.filtered_columns[i])) {
        for (let j = 0; j < this.filtered_sql_output[this.filtered_columns[i]].length; j++) {
          sum += Number(this.filtered_sql_output[this.filtered_columns[i]][j]);
        }
        sum = Math.round(sum * 100) / 100;
      }
      else {
        sum = '';
      }
      this.columnTotal.push(sum);
      console.log("selected column total",this.columnTotal)
    }
    // this.columnTotal[0] = 'TOTAL';

    // Converting the filtered_sql_output for the primeng table
    let converted_sql_output = [[]];
    for (let i = 0; i < this.length; ++i) {
      let row = [];
      for (let j = 0; j < this.filtered_columns.length; ++j) {
        row[this.filtered_columns[j]] = this.filtered_sql_output[this.filtered_columns[j]][i];
      }
      converted_sql_output.push(row);
    }
    converted_sql_output.shift();
    this.filtered_sql_output = converted_sql_output;
    // Converting the filtered_sql_output again for the exportPdf()
    let double_converted_output = [[]];
    this.filtered_sql_output2 = this.filtered_sql_output;
    for (let i = 0; i < this.length; i++) {
      let row = [];
      for (let j = 0; j < this.filtered_columns.length; j++) {
        row[j] = this.filtered_sql_output2[i][this.filtered_columns[j]];
      }
      double_converted_output.push(row);
    }
    double_converted_output.shift();
    this.filtered_sql_output2 = double_converted_output;
    if (this.selectedColumns.length == 0) {
      this.filtered_sql_output2 = []
    }

  }

  onFilter(event, dt) {
    this.filteredValues = event.filteredValue;
    this.sql_output2 = this.filteredValues;
    this.length = this.sql_output2.length;
  
    // for updating column totals with filtered values
    this.columnTotal = [];
    for (let i = 0; i < this.columns.length; i++) {
      let sum: any = 0;
      if(this.column_needs_total.find(element => element == this.columns[i])) {
        for (let j = 0; j < this.length; j++) {
          sum += Number(this.sql_output2[j][this.columns[i]]);
        }
        sum = Math.round(sum * 100)/100;
      }
      else {
        sum = '';
      }
      this.columnTotal.push(sum);
    }
    // this.columnTotal[0] = 'TOTAL';
  
    // Converting the sql_output again for the exportPdf() 
    let double_converted_output = [[]];
    for (let i = 0; i < this.length; i++) {
      let row = [];
      for (let j = 0; j < this.columns.length; j++) {
        row[j] = this.sql_output2[i][this.columns[j]];
      }
      double_converted_output.push(row);
    }
    double_converted_output.shift();
    this.sql_output2 = double_converted_output;
  }

  exportPdf() {

    const addFooters = doc => {
      const pageCount = doc.internal.getNumberOfPages()
      doc.setFont('helvetica', 'italic')
      doc.setFontSize(5)
      for (var i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.text('Page ' + String(i) + ' of ' + String(pageCount), doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 5, {
          align: 'center'
        })
      }
    }
    
    const doc = new jsPDF({
      orientation: 'landscape'
    });
  
    doc.setFontSize(16);
    let width = doc.internal.pageSize.getWidth();
    doc.text("D5N", width/2, 15, { align: 'center' });
    
    doc.setFontSize(12);
    let report_name = this.report_name.toUpperCase();
    doc.text(report_name, width/2, 23, { align: 'center' });
  
    if(this.from) {
      doc.setFontSize(8);
      let from_to: string = this.from + ' to ' + this.to;
      doc.text(from_to, width/2, 27, { align: 'center'})
    }
    
  
    autoTable(doc, {
      // head: [this.headerColumns],
      head: [this.filtered_columns.length > 0 ? this.filtered_columns : this.headerColumns],
      body: this.filtered_sql_output2.length > 0 ? this.filtered_sql_output2 : this.sql_output2,
      
      // body: this.sql_output2,
      foot: [this.columnTotal],
      showFoot: 'lastPage',
      styles: {
        fontSize: 5
      },
      theme: "grid",
      // tableWidth: 'wrap',
      headStyles: {
        fillColor: [46, 128, 186]
      },
      footStyles: {
        fillColor: [46, 128, 186]
      },
      startY: 30,
      margin: {
        bottom: 10
      },
  
      
    });
    
    addFooters(doc);
    doc.save('report.pdf');
  }
  
  
  exportExcel(): void {
    let element = document.getElementById("data")
  
  console.log("element1",element)
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    console.log("wb",wb)
    console.log("ws",ws)

    XLSX.utils.book_append_sheet(wb,ws, "Sheet1");
    // XLSX.writeFile(wb,this.Excelfile)
    const excelBuffer: any=XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, "products");
    
 
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
    });
    saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
  // exportExcel() {

  //   const worksheet = xlsx.utils.json_to_sheet(this.sql_output2);
  //   const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  //   const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
  //   this.saveAsExcelFile(excelBuffer, "products");
  // }
  
  // saveAsExcelFile(buffer: any, fileName: string): void {
  //   let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  //   let EXCEL_EXTENSION = '.xlsx';
  //   const data: Blob = new Blob([buffer], {
  //       type: EXCEL_TYPE
  //   });
  //   saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  // }

}
