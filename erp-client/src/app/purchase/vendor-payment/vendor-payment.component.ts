


import { Component, ElementRef, OnInit, ViewChild, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PurchaseService } from '../purchase.service';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { ChangeDetectorRef, TemplateRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';
import * as moment from 'moment';
import {
  ColDef,
  GridReadyEvent,
  ICellEditorComp,
  ICellEditorParams,
} from 'ag-grid-community';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

@Component({
  selector: 'app-vendor-payment',
  templateUrl: './vendor-payment.component.html',
  styleUrls: ['./vendor-payment.component.scss']
})
export class VendorPaymentComponent implements OnInit {

  prForm: FormGroup;
  dailog_ref;

  searchProduct;
  vendor_list = [];
  po_list = [];
  grn_list = [];
  grn_amount_list = [];
  v_id:any;
  selected_item: any;
  selected_vendor_code;
  selected_vendor_name;

  deleterow = false;
  selected_list = [];
  submitted: boolean = false;
  flag: boolean = true;

  columnDefs: ColDef[] = [
    {field: 'vendor_name', headerName : 'Vendor Name', sortable: true, filter: true, checkboxSelection: true,pinned: 'left' },
    {field: 'vendor_code', headerName : 'Vendor Code', sortable: true, filter: true},
    {field: 'po_number', headerName : 'PO Number', sortable: true, filter: true},
    {field: 'po_date', headerName : 'PO Date', sortable: true, filter: true},
    {field: 'grn_code', headerName : 'Grn Number', sortable: true, filter: true},
    {field: 'grn_date', headerName : 'Grn Date', sortable: true, filter: true},
    {field: 'invoice_number', headerName : 'Invoice Number', sortable: true, filter: true},
    {field: 'invoice_date', headerName : 'Invoice Date', sortable: true, filter: true},
    {field: 'invoice_amount', headerName : 'Invoice Amount', sortable: true, filter: true},
    {field: 'payment_amount', headerName : 'Payment Amount', sortable: true, filter: true, editable: true},
    {field: 'remaining_amount', headerName : 'Remaining Amount', sortable: true, filter: true},
    {field: 'payment_method', headerName : 'Payment Method', sortable: true, filter: true, editable: true, cellEditor: SelectComponent, cellEditorPopup: true},
    {field: 'payment_details', headerName : 'Payment Details', sortable: true, filter: true, editable: true},
  ];

  rdata = []
  defaultColDef: { flex: number; sortable: boolean; resizable: boolean; filter: boolean; };
  rowSelection: string;
  private gridApi;
  private gridColumnApi;

  constructor(private formBuilder: FormBuilder,
    private purchaseService: PurchaseService,
    private sharedService: SharedService,
    private nbtoastService: NbToastrService,
    private routes: Router,
    private route: ActivatedRoute,
    private dialogService: NbDialogService,
    private cd: ChangeDetectorRef,) {

      this.defaultColDef = {
        flex: 1,
        sortable: true,
        resizable: true,
        filter: true,

      };
      this.rowSelection = 'single';

      this.selected_item = {
          vendor_code: '',
          vendor_name: '',
          po_number: '',
          po_date: '',
          grn_code: '',
          grn_date: '',
          invoice_number: '',
          invoice_date: '',
          invoice_amount: '',
          payment_amount: '',
          remaining_amount: '',
          payment_method: '',
          payment_details: ''
      }
  }

  ngOnInit(): void {
    this.selected_list = [];

    this.prForm = this.formBuilder.group({
      vendorNameFormControl: ['', [Validators.required]],
      poFormControl: ['', [Validators.required]],
      grnFormControl: ['', [Validators.required]]
    });

    this.v_id = this.route.snapshot.queryParams["id"];
    if (this.v_id) {
      this.flag = false
      this.purchaseService.getVendorPaymentListById(this.v_id).subscribe((data) => {
        console.log("VENDOR PAYMENT LIST",data)
        this.prForm.controls['vendorNameFormControl'].setValue(data.vendor_name);
        this.selected_vendor_code = data.vendor_code;
        this.selected_vendor_name = data.vendor_name;

        data.v_list.forEach(element => {
          const item = {
            vendor_code: this.selected_vendor_code,
            vendor_name: this.selected_vendor_name,
            po_number: element.po_number,
            po_date: element.po_date,
            grn_code: element.grn_code,
            grn_date: element.grn_date,
            invoice_number: element.invoice_number,
            invoice_date: element.invoice_date,
            invoice_amount: element.invoice_amount,
            payment_amount: element.payment_amount,
            remaining_amount: element.remaining_amount,
            payment_method: element.payment_method,
            payment_details: element.payment_details,
          }
          this.selected_list.push(item);
          this.gridApi.updateRowData({add:[item], addIndex:0});
          })

         console.log("SELECTED_LIST AFTER GET", this.selected_list)


         this.updateGrid()

      });
    }

    this.purchaseService.getVendorList().subscribe(
      (data) => {
        this.vendor_list = data;
        console.log("Vendor List",data)
      },
      (error) => {
        this.nbtoastService.danger(error, "Error")
      }
    );

  }

  onRowClick(event: any): void {
    console.log("ROWWWW",event.rowIndex);
  }

  onCellClick(event: any): void {
    console.log("CELLL",event.column.getId());
  }

  onGridReady(params) {
    console.log("GRID READY");
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    var allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(function (column) {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds, false);
    //this.gridApi.sizeColumnsToFit();
  }

  updateGrid() {
    //this.rdata = this.selected_list
    this.gridApi.refreshCells({force : true});
  }

  open_vendor(dialog: TemplateRef<any>) {
    this.dailog_ref = this.dialogService.open(dialog, { context: this.vendor_list })
      .onClose.subscribe(data => {
        this.searchProduct = ""
        if(!data) {
          return;
        }

        console.log("Vendor Dialog Data",data)

        this.selected_vendor_code = data.vendor_code //for master
        this.selected_vendor_name = data.vendor_name //for master

        this.selected_item.vendor_code = data.vendor_code //for child
        this.selected_item.vendor_name = data.vendor_name //for child

        this.prForm.controls['vendorNameFormControl'].setValue(this.selected_vendor_name)

        this.po_list = []
        this.purchaseService.getVendorPoList(data.id).subscribe(
          (data) => {
            this.po_list = data;
            console.log("PO List",data)
          },
          (error) => {
            this.nbtoastService.danger(error, "Error")
          }
        );

      });

  }

  open_po(dialog: TemplateRef<any>) {
    this.dailog_ref = this.dialogService.open(dialog, { context: this.po_list })
      .onClose.subscribe(data => {
        this.searchProduct = ""
        if(!data) {
          return;
        }


        console.log("PO Dialog Data",data)

        this.selected_item.po_number = data.po_number
        this.selected_item.po_date = data.po_date

        this.prForm.controls['poFormControl'].setValue(data.po_number)

        this.grn_amount_list = []
        this.purchaseService.getVendorGrnAmount(this.selected_item.vendor_code).subscribe(
          (data) => {
            this.grn_amount_list = data;
            console.log("GRN Amount List",data)
          },
          (error) => {
            this.nbtoastService.danger(error, "Error")
          }
        );

        this.grn_list = []
        this.purchaseService.getVendorGrnList(data.id).subscribe(
          (data) => {
            this.grn_list = data;
            console.log("GRN List",data)
          },
          (error) => {
            this.nbtoastService.danger(error, "Error")
          }
        );

      });

  }

  open_grn(dialog: TemplateRef<any>) {
    this.dailog_ref = this.dialogService.open(dialog, { context: this.grn_list })
      .onClose.subscribe(data => {
        this.searchProduct = ""
        if(!data) {
          return;
        }
        console.log("GRN Dialog Data",data)
        if (this.selected_list.some(element => element.grn_code== data.grn_code)) {
          this.nbtoastService.danger("Grn already exist");
          return;
        }
        let paymentAmountAll:number = 0;
        let remainingAmount:number = 0;

        this.grn_amount_list.forEach(element => {
          if(element.grn_code == data.grn_code) {
            paymentAmountAll += Number(element.payment_amount)
          }
        });

        remainingAmount = (Number(data.grand_total) - Number(paymentAmountAll))

        console.log("GRN code",data.grn_code)
        console.log("Payment amt all: " + remainingAmount)
        console.log("Remaining amt: " + remainingAmount)

        this.selected_item.grn_code = data.grn_code
        this.selected_item.grn_date = data.grn_date
        this.selected_item.invoice_number = data.invoice_number
        this.selected_item.invoice_date = data.invoice_date
        this.selected_item.invoice_amount = data.grand_total
        this.selected_item.remaining_amount = remainingAmount

        this.prForm.controls['grnFormControl'].setValue(data.grn_code)

      });

  }

  addToList() {
    if(!this.prForm.valid) {
      if(this.prForm.controls['vendorNameFormControl'].value == '') {
        this.nbtoastService.danger('Select vendor to add')
        return
      }
      if(this.prForm.controls['poFormControl'].value == '') {
        this.nbtoastService.danger('Select po to add')
        return
      }
      if(this.prForm.controls['grnFormControl'].value == '') {
        this.nbtoastService.danger('Select grn to add')
        return
      }

    }
        const item = {
          vendor_code: this.selected_item.vendor_code,
          vendor_name: this.selected_item.vendor_name,
          po_number: this.selected_item.po_number,
          po_date: this.selected_item.po_date,
          grn_code: this.selected_item.grn_code,
          grn_date: this.selected_item.grn_date,
          invoice_number: this.selected_item.invoice_number,
          invoice_date: this.selected_item.invoice_date,
          invoice_amount: this.selected_item.invoice_amount,
          payment_amount: 0,
          remaining_amount: this.selected_item.remaining_amount,
          payment_method: '',
          payment_details: ''
      }
      this.selected_list.push(item);
      console.log("Selected LIST", this.selected_list)
      this.updateGrid()
      this.gridApi.updateRowData({add:[item], addIndex:0});
      this.prForm.controls['grnFormControl'].setValue("")
  }

  deleteSelection() {
      const selectedRows = this.gridApi.getSelectedRows();
      console.info("SELECTED ROWS",selectedRows);
      selectedRows.forEach(element => {
        const index: number = this.selected_list.indexOf(element);
        if (index !== -1) {
          this.selected_list.splice(index, 1);
        }
      });
      this.gridApi.applyTransaction({ remove: selectedRows });
      //this.calculate(event)
      this.updateGrid()
      console.info("SELECTED ROWS AFTER REMOVE",this.selected_list);
      //return true;
  }


  calculate($event) {
    this.selected_list.forEach(item => {
      console.log("item GRN:",item.grn_code)
      if (item.payment_amount > 0 && item.payment_amount <= item.remaining_amount)
      {
        console.log("Calulate on:",item.payment_amount)
        if (item.remaining_amount > 0 ){
          item.remaining_amount = (parseFloat(item.remaining_amount) - parseFloat(item.payment_amount))
        }else{
          item.remaining_amount = (parseFloat(item.invoice_amount) - parseFloat(item.payment_amount))
        }
        
      }else{
        item.payment_amount = 0
        this.nbtoastService.danger('Payment amount cannot be greater than remaining amount')
      }
    });
    this.gridApi.refreshCells({force : true});
    }


  saveVP(): any {

    const formData = this.saveFormData();
    if (!this.selected_list.length ) {
      this.nbtoastService.danger('Please Add At Least One Entry')
    }else{
      let dd:boolean;
      this.selected_list.forEach(
        a =>{
          if(a.payment_method == '') {
            dd=false
            this.nbtoastService.danger('Please Enter Payment Methods');
          }
          else{
            dd=true
          }
        }
      )

      if(dd){

        this.purchaseService.saveVendorPayment(formData).subscribe(
          (data) => {
            this.nbtoastService.success("Vendor Payment Saved Successfully, VP number is : " + data)

            this.routes.navigateByUrl("/VendorPage?id=" + data)

            this.prForm.reset()

          },
          (error) => {
            this.nbtoastService.danger("Failed to Save");
          }
        );
          }
    }



  }

  // print() {
  //   this.routes.navigateByUrl("/PrInvoice?id=" +this.pr_id)
  // }


  private saveFormData() {
    this.onSubmit();
    const formData = new FormData();
      if (this.v_id){
        formData.append('v_id', this.v_id)
      }
    // formData.append('pr_date', this.prForm.controls['prDateFormControl'].value);
    // formData.append('created_user', this.prForm.controls['userFormControl'].value);
    // formData.append('dept', this.selectedOption);
    // formData.append('store_id', this.store_id);
    formData.append('vendor_code', this.selected_vendor_code);
    formData.append('vendor_name', this.selected_vendor_name);

    this.selected_list.forEach((element) => {
      //console.log(element.expected_date);
      //element.expected_date = element.expected_date;
      //element.active = element.active.toString();
      element.po_date = moment(element.po_date).format("yyyy-MM-DD")
      element.grn_date = moment(element.grn_date).format("yyyy-MM-DD")
      element.invoice_date = moment(element.invoice_date).format("yyyy-MM-DD")
      //console.log(element.expected_date);
    });

    formData.append('v_list', JSON.stringify(this.selected_list));

    console.log("V_list",this.selected_list);
    return formData;

  }

  get f() { return this.prForm.controls; }

onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.prForm.invalid) {
        return;
    }
    if (!this.prForm.invalid){
      return this.submitted = false;
    }

}
}

export class SelectComponent implements ICellEditorComp {
  eInput!: HTMLSelectElement;
  selectOptions = ["CHEQUE","BANK TRANSFER","CASH"];

  // gets called once before the renderer is used
  init(params: ICellEditorParams) {
    // create the cell
    this.eInput = document.createElement('select');
    this.eInput.classList.add('nb-input');
    this.eInput.style.backgroundColor = 'white';
    this.eInput.style.height = '100%';

    //this.selectOptions = ["CHEQUE","BANK TRANSFER","CASH"];
    //Create and append the options
for (var i = 0; i < this.selectOptions.length; i++) {
  var option = document.createElement("option");
  option.value = this.selectOptions[i];
  option.text = this.selectOptions[i];
  this.eInput.appendChild(option);
}

  }

  // gets called once when grid ready to insert the element
  getGui() {
    return this.eInput;
  }

  // focus and select can be done after the gui is attached
  afterGuiAttached() {
    this.eInput.focus();
    //this.eInput.onselect();
  }

  // returns the new value after editing
  getValue() {
    return this.eInput.value;
  }

  // any cleanup we need to be done here
  destroy() {
    // but this example is simple, no cleanup, we could
    // even leave this method out as it's optional
  }

  // if true, then this editor will appear in a popup
  isPopup() {
    // and we could leave this method out also, false is the default
    return false;
  }
}
