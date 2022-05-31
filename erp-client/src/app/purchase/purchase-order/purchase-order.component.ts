import { stringify } from '@angular/compiler/src/util';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NbComponentSize, NbDialogService, NbToastrService } from '@nebular/theme';
import * as moment from 'moment';
import { element } from 'protractor';
import { InventoryService } from 'src/app/inventory/inventory.service';
import { PurchaseService } from '../purchase.service';
import { Store } from '../../models/Store';
import { DatepickerComponent } from '../datepicker/datepicker.component';
import { ColDef } from 'ag-grid-community';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss']
})
export class PurchaseOrderComponent implements OnInit {

  @ViewChild('date')
  myInputVariable: ElementRef;
  @ViewChild('date1')
  date1: ElementRef;
  purchaseOrderForm: FormGroup;
  po_type_list = [
    { po_type_value: 'PO', po_type_name: 'Purchase Order' }
  ]
  selectedPOType: any;

  transport_type_list = [
    { key: 'BY_ROAD', value: 'By Road' },
    { key: 'BY_AIR', value: 'By Air' },
    { key: 'BY_SEA', value: 'By Sea' },
    { key: 'OTHERS', value: 'Others' },
  ]

  payments_terms_list = [
    { key: "PAYMENT_TERMS_1", value: '10% advance & 90% after Receipt of materials' },
    { key: "PAYMENT_TERMS_2", value: '100% against material receipt' },
    { key: "PAYMENT_TERMS_3", value: 'Wholese credit for 30 days of material receiptller' },
  ]


  selectedTransportType: any;
  vendor_list: any[];
  selected_vendor;
  selected_product_list = [


  ];
  product: any;
  dailog_ref: any;
  product_list: any;
  unit_list: [];
  total_amount: any = 0.00;
  packing_amount: any = 0.00;
  total_invoice_value: number = 0.0;
  total_order_value: number = 0.00;
  nb_select_size: NbComponentSize[] = ['medium']
  sgst: any = 0;
  cgst: any = 0;
  igst: any = 0;
  sub_total: any;
  invoice_amount: any;
  pr_list= [];
  po_id: any;
  store_id: any;
  vendor_id: any;
  submitted: boolean = false;
  selectedPaymentType: any;
  not_approved: any;
  gst: 0.0;
  pr_id: any;
  searchPR: string;
  searchProduct: string;
  searchVendor: string;
  packpercnt = 0
  dateofdata: Date;
  current_date: any = new Date();
  expiry_date: Date;
  date: boolean = false;
  flag: boolean = false;
  pr_product_array = [];
  selected_List: any;
  selected_pr_data:any;
  pr_products=[];
  pr_products1=[];
  po_status:any;


  /*
            product_id: data.id,
            product_code: data.product_code,
            product_name: data.product_name,
            description: data.product_description,
            qty: 0,
            unit_id: data.product_price__unit,
            delivery_date: '',
            unit_price: data.product_price__unit_price,
            unit_name: data.product_price__unit__PrimaryUnit,
            gst: data.product_price__tax,
            amount: 0.0,
            disc_percent: 0.0,
            disc_amount: 0.0,
            gst_amount: 0.0,
            rejected_qty: 0,
            accepted_qty: 0,
            status: "false",
            order_qty:0,
            finished_qty:0,
            total_amount:0
  */
  columnDefs: ColDef[] = [
    {field: 'product_code', headerName : 'Product Code', sortable: true, filter: true},
    {field: 'product_name', headerName : 'Product Name', sortable: true, filter: true, checkboxSelection: true,pinned: 'left' },
    {field: 'items_per_box', headerName : 'Box Items', sortable: true, filter: true, editable: false,hide:true},
    //{field: 'box_qty', headerName : 'Box Qty', sortable: true, filter: true,editable: true},
    {field: 'qty', headerName : 'Required Qty', sortable: true, filter: true},
    {field: 'order_qty', headerName : 'Order Qty', sortable: true, filter: true,editable: true},
    {field: 'finished_qty', headerName : 'Finished Qty', sortable: true, filter: true},
    {field: 'unit_name', headerName : 'Unit', sortable: true, filter: true},
    {field: 'delivery_date', headerName : 'Delivery Date', sortable: true, filter: true,editable: true, cellEditor: DatepickerComponent, cellEditorPopup: true},
    {field: 'unit_price', headerName : 'Unit Price', sortable: true, filter: true, editable: true},
    {field: 'amount', headerName : 'Amount', sortable: true, filter: true},
    {field: 'disc_percent', headerName : 'Disc %', sortable: true, filter: true, editable: true},
    {field: 'disc_amount', headerName : 'Disc Amount', sortable: true, filter: true},
    {field: 'gst', headerName : 'GST %', sortable: true, filter: true, editable: true},
    {field: 'gst_amount', headerName : 'GST Amt', sortable: true, filter: true},
    {field: 'total_amount', headerName : 'Total Amount', sortable: true, filter: true},

];

  rdata = []
  defaultColDef: { flex: number; sortable: boolean; resizable: boolean; filter: boolean; };
  rowSelection: string;
  private gridApi;
  private gridColumnApi;


  constructor(
    private formBuilder: FormBuilder,
    private purchaseService: PurchaseService,
    private routes: Router,
    private route: ActivatedRoute,
    private nbtoastService: NbToastrService,
    private dialogService: NbDialogService,
    private inventoryService: InventoryService,
  ) {
    this.defaultColDef = {
      flex: 1,
      sortable: true,
      resizable: true,
      filter: true,

    };
    this.rowSelection = 'single';

    this.purchaseOrderForm = this.formBuilder.group(
      {
        poTypeFormControl: [this.po_type_list[0].po_type_value, [Validators.required]],
        poDateFormControl: ['', [Validators.required]],
        poNumberFormControl: ['', []],
        userFormControl: ['', [Validators.required]],
        transportTypeFormControl: [this.transport_type_list[0].key, [Validators.required]],
        vendorCodeFormControl: ['', [Validators.required]],
        vendorNameFormControl: ['', [Validators.required]],
        paymentTermsFormControl: [this.payments_terms_list[0].key, []],
        otherRefFormControl: ['', []],
        termsDeliveryFormControl: [''],
        shipAddressFormControl: ['', [Validators.required]],
        noteFormControl: [''],
        packPrecntFormControl: ['', [Validators.required]],
        termsConditionFormControl: ['', []],
        prNumberFormControl: ['', []]
      }
    );

    this.purchaseService.getVendorList().subscribe(
      (data) => {
        this.vendor_list = data;
      },
      (error) => {
        this.nbtoastService.danger("Error while getting vendor list")
      }
    )

    this.purchaseService.getPRList().subscribe(
      (data) => {
        this.pr_list = data;
      },
      (error) => {
        this.nbtoastService.danger("Error while getting pr list")
      }
    );
    this.inventoryService.getProductList().subscribe(
      (data) => {
        this.product_list = data;
        console.log("ckheck product",this.product_list)
      },
      (error) => {
        this.nbtoastService.danger(error, "Error")
      }
    );

    this.inventoryService.getUnitMasterList().subscribe(
      (data) => {
        this.unit_list = data;
      },
      (error) => {
        this.nbtoastService.danger(error, "Error")
      }
    );
   }

  ngOnInit(): void {





    this.selected_product_list = [];
    this.total_amount = 0.0;
    this.sub_total = 0.0;
    this.cgst = 0.0;
    this.sgst = 0.0;
    this.igst = 0.0;





    this.po_id = this.route.snapshot.queryParams['id'];
    if (this.po_id) {
      this.flag = true
      this.purchaseService.getPODetails(this.po_id).subscribe(
        (data) => {
          console.log("edit info",data)
          this.po_status = data.po_status;
          console.log("STATUS",this.po_status)
          this.purchaseOrderForm.controls['poTypeFormControl'].setValue(data.po_type);
          this.purchaseOrderForm.controls['poDateFormControl'].setValue(moment(data.po_date));
          this.purchaseOrderForm.controls['poNumberFormControl'].setValue(data.po_number);
          this.purchaseOrderForm.controls['userFormControl'].setValue(data.po_raised_by);
          this.purchaseOrderForm.controls['transportTypeFormControl'].setValue(data.transport_type);
          this.purchaseOrderForm.controls['vendorCodeFormControl'].setValue(data.vendor__vendor_code);
          this.purchaseOrderForm.controls['vendorNameFormControl'].setValue(data.vendor__vendor_name);
          this.purchaseOrderForm.controls['paymentTermsFormControl'].setValue(data.payment_terms);
          this.purchaseOrderForm.controls['otherRefFormControl'].setValue(data.other_reference);
          this.purchaseOrderForm.controls['termsDeliveryFormControl'].setValue(data.terms_of_delivery);
          this.purchaseOrderForm.controls['shipAddressFormControl'].setValue(data.shipping_address);
          this.purchaseOrderForm.controls['noteFormControl'].setValue(data.note);
          this.purchaseOrderForm.controls['prNumberFormControl'].setValue(data.pr_number);


          this.purchaseOrderForm.controls['packPrecntFormControl'].setValue(data.packing_perct);
          this.purchaseOrderForm.controls['termsConditionFormControl'].setValue(data.terms_conditions);
          this.store_id = data.store_id;
          console.log(this.store_id)
          this.vendor_id = data.vendor_id;
          // this.selected_vendor = this.vendor_list.find(item => item.id == data.vendor_id)
          // this.not_approved = this.pr_list.find(item => item.pr_no == data.pr_number)
         this.selected_List = this.pr_list.find(item => item.pr_no == data.pr_number);
        //  this.pr_list = this.pr_list.find(item => item.pr_no == data.pr_number)
          // console.log("pr list",this.pr_list);

          // console.log("not",this.not_approved)
          // console.log(this.selected_vendor)
          for (let i = 0; i < data.order_details.length; i++) {
            console.log(moment(data.order_details[i].delivery_date))
            data.order_details[i].delivery_date = moment(data.order_details[i].delivery_date)
            data.qty = parseInt(data.order_details[i].qty)
          };
          //this.selected_product_list = data.order_details;
          console.log(data.order_details)
          data.order_details.forEach(element => {
            let obj = this.product_list.find(o => o.product_name === element.product_name);
                  console.log("prod obj",obj )
                //  let items_per_box = 1;
                //   if(obj.product_price__box_qty) { //if product item exits
                //       items_per_box = obj.product_price__box_qty;
                //       console.log("check qty",items_per_box)
                //   }

            //if(element.qty != element.order_qty){
            this.selected_product_list.push({
              ...element,

              status: element.status.toString(),
              unit_name: element.unit__PrimaryUnit,
              items_per_box :obj.product_price__box_qty,

            })

            //}

          });
          this.updateGrid();
          // this.calculate(null);
          // this.selected_pr_data = {
          //   ...this.not_approved,
          //   selected_product_list:this.selected_product_list,
          //   store_id:data.store_id

          // }

          // this.pr_product_array = this.not_approved.pr_list.map(item => ({
          //   ...item,
          //   expected_date:moment(item.expected_date).format("YYYY-MM-DD")
          // }));
          // console.log("product array",this.pr_product_array)
          // this.pr_products1 = this.not_approved.pr_list.map(item => ({
          //   ...item,
          //   expected_date:moment(item.expected_date).format("YYYY-MM-DD")
          // }));
          this.packing_amount = parseFloat(data.packing_amount);
          this.total_amount = parseFloat(data.sub_total) + parseFloat(data.packing_amount)
          this.sub_total = parseFloat(data.sub_total);
          this.cgst = parseFloat(data.cgst);
          this.sgst = parseFloat(data.sgst);
          this.igst = parseFloat(data.igst);
          this.invoice_amount = parseFloat(data.invoice_amount);

        },
        (error) => {
          this.nbtoastService.danger("Unable to get PO data");
        }
      )
    } else {
      //this.purchaseOrderForm.controls['userFormControl'].setValue(sessionStorage.getItem('first_name'));
      this.purchaseOrderForm.controls['userFormControl'].setValue(sessionStorage.getItem('first_name'));
      console.log(this.purchaseOrderForm.controls['userFormControl'].setValue(sessionStorage.getItem('first_name')))
    }

      //this.purchaseOrderForm.controls['userFormControl'].setValue(sessionStorage.getItem('first_name'));
    this.purchaseOrderForm.controls['userFormControl'].setValue(sessionStorage.getItem('first_name'));
    console.log(this.purchaseOrderForm.controls['userFormControl'].value)

    this.calculate_total();
    if(!this.po_id){
      this.onChange()
    }

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
    this.rdata = this.selected_product_list
    this.gridApi.refreshCells({force : true});
  }

  deleteSelection() {
      const selectedRows = this.gridApi.getSelectedRows();
      console.info("SELECTED ROWS",selectedRows);
      selectedRows.forEach(element => {
        const index: number = this.selected_product_list.indexOf(element);
        if (index !== -1) {
          this.selected_product_list.splice(index, 1);
        }
      });
      this.gridApi.applyTransaction({ remove: selectedRows });
      this.calculate(event)
      this.updateGrid()
      console.info("SELECTED ROWS AFTER REMOVE",this.rdata);
      //return true;
  }

  onChange() {
    this.purchaseOrderForm.controls['poDateFormControl'].valueChanges.subscribe(
      (data) => {
        console.log(new Date(data))
        this.dateofdata = new Date(data)
        console.log(this.dateofdata)
        console.log(this.current_date)
        if (moment(this.dateofdata).format("yyyy-MM-DD") < moment(this.current_date).format("yyyy-MM-DD")) {
          this.nbtoastService.danger("Date Of Request  Allows Only Present Or Future Date");
          this.myInputVariable.nativeElement.value = "";
        }

      })

  }

  onChanges(date, item) {
    let dd: any = new Date(date)
    this.expiry_date = new Date(date.delivery_date)
    console.log(new Date(date))
    console.log(item)
    console.log((this.expiry_date))
    console.log(this.current_date)
    if (moment(dd).format("yyyy-MM-DD") < moment(this.current_date).format("yyyy-MM-DD")) {
      this.nbtoastService.danger("Date Of Request  Allows Only Present Or Future Date");
      this.date1.nativeElement.value = "";

    }
  }

  vendor_open(dialog: TemplateRef<any>) {
    this.dailog_ref = this.dialogService.open(dialog, { context: this.vendor_list })
      .onClose.subscribe(data => {
        this.searchVendor = ""
        this.selected_vendor = data;
        this.vendor_id = this.selected_vendor.id;
        this.purchaseOrderForm.controls['vendorCodeFormControl'].setValue(data.vendor_code);
        this.purchaseOrderForm.controls['vendorNameFormControl'].setValue(data.vendor_name);
        this.purchaseOrderForm.controls['paymentTermsFormControl'].setValue(data.payment_terms?data.payment_terms:this.payments_terms_list[0].key);

      }
      );
  }

  product_open(dialog: TemplateRef<any>) {
    this.dailog_ref = this.dialogService.open(dialog, { context: this.product_list })
      .onClose.subscribe(data => {
        this.searchProduct = ""
        //  this.product_list = data
        console.log(data)
        if (this.selected_product_list.some(element => element.product_name == data.product_name)) {
          this.nbtoastService.danger("product name already exist");
        } else {
          console.log(data)
          const item = {
            id: '',
            product_id: data.id,
            product_code: data.product_code,
            product_name: data.product_name,
            description: data.product_description,
            qty: 0,
            unit_id: data.product_price__unit,
            delivery_date: '',
            unit_price: data.product_price__purchase_price,
            unit_name: data.product_price__unit__PrimaryUnit,
            gst: data.product_price__tax,
            amount: 0.0,
            disc_percent: 0.0,
            disc_amount: 0.0,
            gst_amount: 0.0,
            rejected_qty: 0,
            accepted_qty: 0,
            status: "false",
            order_qty:0,
            finished_qty:0,
            total_amount:0
            //finished_qty: data.product_price__qty,

          }
          this.selected_product_list.push(item);
          this.updateGrid()
          //this.calculate_sub_total(item)
          this.calculate(event)
          this.gridApi.updateRowData({add:[item], addIndex:0});
          // this.gridApi.rowData.push(item)
          // this.gridApi.setRowData(this.gridApi.rowData)
        }
      });


    console.log("this is pushed data", this.selected_product_list)
    //  this.subcategoryFrom.controls['categoryNameFormControl'].setValue(data.category_name);

  }

  calculate_sub_total(item): any {
    console.log(item)
    if(!(item.order_qty > item.qty)){
      // item.finished_qty = item.order_qty;
    if (item.unit_price > 0 && item.order_qty > 0)
    {
      // let addQty:any = item.finished_qty +item.order_qty;
      item.amount = (item.unit_price * item.order_qty) * 1.00
      item.disc_amount = ((item.amount * item.disc_percent) / 100.00).toFixed(2)
      item.amount = item.amount - item.disc_amount
      item.gst_amount = ((item.amount * item.gst) / 100.00).toFixed(2)
      item.total_amount = ((parseFloat(item.amount) +parseFloat(item.gst_amount))- parseFloat(item.disc_amount)).toFixed(2)
      item.total_amount = (parseFloat(item.amount) +parseFloat(item.gst_amount))
      // item.finished_qty =addQty;
      this.calculate_total();
    }

    this.pr_products1.forEach(pr=>{
      console.log(pr)
      if(pr.product == item.product_id)
      {
        console.log("added prod name",pr.product_name)
        console.log("req qty",pr.required_qty)
        console.log("ord qty",pr.order_qty)
        console.log("fin qty",pr.finished_qty)
        let qt = pr.required_qty - pr.finished_qty
        console.log(qt)
        let addQty = pr.finished_qty + item.order_qty;
        console.log("aaa",addQty)
        if(qt >= item.order_qty)
        {
          item.finished_qty =addQty;
        }
        // else
        // {
        //   this.nbtoastService.danger('order quantity should not be greater than required quantity');
        // }
      }

    })



    this.pr_product_array = []
    this.selected_product_list.forEach(element1 => {
      console.log("first for each", element1)

      this.pr_products1.forEach(element => {
        console.log("second for each", element)

        if (element1.product_id == element.product) {
          this.pr_product_array.push({
            ...element,
            finished_qty: element1.finished_qty,

          })
        }

      });
    });
    console.log("hhhh",this.pr_product_array)
  }
  // else
  // {
  //   this.nbtoastService.danger('order quantity should not be greater than required quantity');
  // }

  }


//   calculate($event) {
//     this.selected_product_list.forEach(item => {
//       console.log(item)
//       if(item.order_qty > 0){
//         // item.finished_qty = item.order_qty;
//       if (item.unit_price > 0 && item.order_qty > 0)
//       {
//         // let addQty:any = item.finished_qty +item.order_qty;
//         item.amount = (item.unit_price * item.order_qty) * 1.00
//         item.disc_amount = ((item.amount * item.disc_percent) / 100.00).toFixed(2)
//         item.amount = item.amount - item.disc_amount
//         item.gst_amount = ((item.amount * item.gst) / 100.00).toFixed(2)
//         item.total_amount = ((parseFloat(item.amount) +parseFloat(item.gst_amount))- parseFloat(item.disc_amount)).toFixed(2)
//         item.total_amount = (parseFloat(item.amount) +parseFloat(item.gst_amount))
//     //     item.finished_qty =addQty;
//         //this.calculate_total();
//       }


//     this.pr_product_array = []
//     this.selected_product_list.forEach(element1 => {
//       console.log("first for each", element1)

//       this.pr_products1.forEach(element => {
//         console.log("second for each", element)

//         if (element1.product_id == element.product) {
//           this.pr_product_array.push({
//             ...element,
//             finished_qty: element1.finished_qty,

//           })
//         }

//       });
//     });
//     console.log("hhhh",this.pr_product_array)
//   }
//   // else
//   // // {
//   // //   this.nbtoastService.danger('order quantity should not be greater than required quantity');
//   // //     return; //break out of loop
//   // //   }
// });
//     this.calculate_total();
//     this.gridApi.refreshCells({force : true});
//   }
calculate(event) {
  let changedData = event.data.box_qty;
  console.log(event);
  console.log("check"+changedData);
  console.info("COLNAME",event.colDef.field);
  console.info("items box",event.data.items_per_box);

   if(event.colDef.field == "box_qty") {
    event.data.qty = parseInt(changedData) * (parseInt(event.data.items_per_box));
    event.data.order_qty = event.data.qty;
    }

    if(event.data.order_qty > 0){
      // item.finished_qty = item.order_qty;
    if (event.data.unit_price > 0 && event.data.order_qty > 0)
    {
      let addQty:any = event.data.finished_qty +event.data.order_qty;
      event.data.amount = (event.data.unit_price * event.data.order_qty) * 1.00
      event.data.disc_amount = ((event.data.amount * event.data.disc_percent) / 100.00).toFixed(2)
      event.data.amount = event.data.amount - event.data.disc_amount
      event.data.gst_amount = ((event.data.amount * event.data.gst) / 100.00).toFixed(2)
      event.data.total_amount = ((parseFloat(event.data.amount) +parseFloat(event.data.gst_amount))- parseFloat(event.data.disc_amount)).toFixed(2)
      event.data.total_amount = (parseFloat(event.data.amount) +parseFloat(event.data.gst_amount))
      event.data.finished_qty =addQty;
      this.calculate_total();

    }



  this.pr_product_array = []
  this.selected_product_list.forEach(element1 => {
    console.log("first for each", element1)

    this.pr_products1.forEach(element => {
      console.log("second for each", element)

      if (element1.product_id == element.product) {
        this.pr_product_array.push({
          ...element,
          finished_qty: element1.finished_qty,

        })
      }

    });
  });
  console.log("hhhh",this.pr_product_array)

}

    this.gridApi.refreshCells({force : true});
    //this.updateGrid();
  // event.data.required_qty = 0;

  //console.info("COLNAME",event.colDef.field);
  // if(event.colDef.field == "box_qty") { //calculate only if box_qty value is changed
  //   this.selected_product_list.forEach(element => {
  //     element.required_qty = (parseInt(element.items_per_box) * parseInt(element.box_qty));

  //   });
  //   this.updateGrid();
  // }

}
// calculate(event) {
//   this.selected_product_list.forEach(item => {
//     console.log("sss",item)
//     if(item.order_qty > 0){
//       // item.finished_qty = item.order_qty;
//     if (item.unit_price > 0 && item.order_qty > 0)
//     {
//       // let addQty:any = item.finished_qty +item.order_qty;
//       item.amount = (item.unit_price * item.order_qty) * 1.00
//       item.disc_amount = ((item.amount * item.disc_percent) / 100.00).toFixed(2)
//       item.amount = item.amount - item.disc_amount
//       item.gst_amount = ((item.amount * item.gst) / 100.00).toFixed(2)
//       item.total_amount = ((parseFloat(item.amount) +parseFloat(item.gst_amount))- parseFloat(item.disc_amount)).toFixed(2)
//       item.total_amount = (parseFloat(item.amount) +parseFloat(item.gst_amount))
//   //     item.finished_qty =addQty;
//       //this.calculate_total();
//     }
//     let changedData = item.box_qty;
//     console.log(event);
//     console.log("check",changedData);
//     // console.info("COLNAME",event.colDef.field);
//     console.info("items box",item.items_per_box);

//      if(event.colDef.field == "box_qty") {
//       item.required_qty = parseInt(changedData) * (parseInt(item.items_per_box));
//       }


//   this.pr_product_array = []
//   this.selected_product_list.forEach(element1 => {
//     console.log("first for each", element1)

//     this.pr_products1.forEach(element => {
//       console.log("second for each", element)

//       if (element1.product_id == element.product) {
//         this.pr_product_array.push({
//           ...element,
//           finished_qty: element1.finished_qty,

//         })
//       }

//     });
//   });
//   console.log("hhhh",this.pr_product_array)
// }
// // else
// // // {
// // //   this.nbtoastService.danger('order quantity should not be greater than required quantity');
// // //     return; //break out of loop
// // //   }
// });
//   this.calculate_total();
//   this.gridApi.refreshCells({force : true});
// }


  calculate_total(): any {
    this.sub_total = 0;
    console.log(this.selected_product_list);
    this.selected_product_list.forEach(element => {
      this.sub_total = parseFloat(this.sub_total) + parseFloat(element.amount)
    });
    this.calculate_packing();

  };

  calculate_packing(): any {
    let packing_percnt = this.purchaseOrderForm.controls['packPrecntFormControl'].value;
    if (packing_percnt > 0) {
      this.packing_amount = ((parseFloat(this.sub_total) * parseFloat(packing_percnt)) / 100.00)
      this.total_amount = (parseFloat(this.sub_total) + parseFloat(this.packing_amount)).toFixed(2);
      this.calculate_gst();
    } else {
      this.total_amount = this.sub_total
      this.calculate_gst();
    }
  }

  calculate_gst(): any {
    let total_gst: any = 0
    this.selected_product_list.forEach(element => {
      if (this.total_amount > 0) {
        total_gst = (parseFloat(total_gst) + parseFloat(element.gst_amount)).toFixed(2);
      } else {
        total_gst = 0
      }
    });
    if (this.selected_vendor !== undefined) {
      if (this.selected_vendor.state_code == '29') {
        this.sgst = total_gst / 2;
        this.cgst = total_gst / 2;
        this.igst = 0
      } else {
        this.igst = total_gst;
        // this.cgst = total_gst/2;
      }
    } else {
      this.igst = total_gst;
      ;
    }

    this.invoice_amount = (parseFloat(this.igst) + parseFloat(this.cgst) + parseFloat(this.sgst) + parseFloat(this.total_amount)).toFixed(2);

  }

  pr_open(dialog: TemplateRef<any>) {

    this.pr_products = []
    this.purchaseService.getPRList().subscribe(
      (data) => {
        // if(data.)
        this.pr_list = data;

        this.dailog_ref = this.dialogService.open(dialog, { context: this.pr_list })
          .onClose.subscribe(data => {
            //  this.product_list = data

            this.selected_product_list = []
            this.searchPR = ""
            this.selected_List = data;
            console.log("this is selected pr list", this.selected_List)
            console.log("this is pr list", data)
            // this.not_approved = data
            // console.log("not app",this.not_approved);

            this.pr_id = this.selected_List.id
            console.log(this.pr_id)
            this.purchaseOrderForm.controls['prNumberFormControl'].setValue(data.pr_no);
            if (data.status == 'WAITING_FOR_APPROVAL')
            {
              this.nbtoastService.warning("Selected PR is  Not Approved");
              return;
            }
            else if(data.status == 'REJECTED')
            {
              this.nbtoastService.warning("Selected PR is  REJECTED");
              return;
            }
            this.purchaseService.getPRDetails(this.pr_id).subscribe(
              (pr_data) => {
                console.log(pr_data)
                console.log(pr_data.selected_product_list[0].product__product_price__unit_price)
                this.store_id = pr_data.store_id;
                this.pr_products1 = pr_data['selected_product_list']
                console.log("Slected Prod:",this.pr_products1)
                this.pr_products1.forEach(element => {
                  console.log("pr element",element)
                  if(element.finished_qty != element.required_qty){
                    // let item = element;

                    this.pr_products.push({...element,})

                  }
                });
                this.pr_products = this.pr_products1;
                console.log("filtered list", this.pr_products)
                if(this.pr_products.length == 0)
                {
                  console.log("All the purchase request satisfied")
                  this.nbtoastService.warning("All the purchase request satisfied");
                  return;
                }
                this.selected_pr_data = pr_data;


                console.log("selected pr data",this.selected_pr_data)
                console.log(this.pr_products1)
                this.pr_products.forEach(element => {
                  console.log('element',element)
                  let items_per_box = 1;
                  let obj = this.product_list.find(o => o.product_name === element.product_name);
                  console.log("prod obj",obj )

                  if(obj.product_price__box_qty) { //if product item exits
                      items_per_box = obj.product_price__box_qty;
                  }
                  const item = {
                    id: '',
                    product_id: element.product,
                    product_code: element.product_code,
                    product_name: element.product_name,
                    description: element.product_description,
                    qty: element.required_qty,
                    items_per_box:items_per_box,
                    box_qty:element.box_qty,
                    order_qty:element.required_qty,
                    finished_qty:element.finished_qty,
                    unit_id: element.unit,
                    unit_name: element.unit__PrimaryUnit,
                    //delivery_date: moment(element.expected_date),
                    delivery_date: element.expected_date,
                    unit_price: element.product__product_price__purchase_price,
                    gst: element.product__product_price__tax,
                    amount : element.product__product_price__purchase_price * element.required_qty,
                    disc_percent: 0.0,
                    disc_amount: 0.0,
                    gst_amount: 0.0,
                    total_amount: 0.0,
                    rejected_qty: 0,
                    accepted_qty: 0,
                    status: "false"

                  };
                  console.log(item.finished_qty)
                  console.log(item.qty)
                  console.log(item.order_qty)
                  this.selected_product_list.push(item);
                  this.calculate_sub_total(item);

                  // this.pr_product_array = []
                  // this.selected_product_list.forEach(element1 => {
                  //   // console.log("first for each", element1)
                  //   this.pr_products.forEach(element => {
                  //     // console.log("second for each", element)
                  //     if (element1.product_id == element.product) {
                  //       this.pr_product_array.push({
                  //         ...element,
                  //         finished_qty: element1.finished_qty,

                  //       })
                  //     }


                  //   });


                  // });
                  // this.pr_product_array.push(pr_products)
                  console.log("SELECTED LIST", this.selected_product_list)
                  console.log(this.pr_product_array)
                });
                  this.updateGrid()
                  this.calculate(event)
              },
              (error) => {
                this.nbtoastService.danger("Unable to get PR details")
              }

            )

          });
      },
      (error) => {
        this.nbtoastService.danger("Unable to get PR List");
      }
    )
    //  this.subcategoryFrom.controls['categoryNameFormControl'].setValue(data.category_name);

  }

  save() {
    this.onSubmit()


      const formdata = new FormData()

          if (this.po_id)
          {
            formdata.append('id', this.po_id);
          }
          formdata.append('po_type', this.purchaseOrderForm.controls['poTypeFormControl'].value);
          formdata.append('pr_number', this.purchaseOrderForm.controls['prNumberFormControl'].value);
          console.log(this.purchaseOrderForm.controls['poDateFormControl'].value);
          console.log(moment(this.purchaseOrderForm.controls['poDateFormControl'].value));
          formdata.append('po_date', moment(this.purchaseOrderForm.controls['poDateFormControl'].value).format("YYYY-MM-DD"));
          formdata.append('po_raised_by', this.purchaseOrderForm.controls['userFormControl'].value);
          formdata.append('shipping_address', this.purchaseOrderForm.controls['shipAddressFormControl'].value);
          formdata.append('transport_type', this.purchaseOrderForm.controls['transportTypeFormControl'].value);
          formdata.append('vendor_id', this.vendor_id);
          formdata.append('payment_terms', this.purchaseOrderForm.controls['paymentTermsFormControl'].value);
          formdata.append('other_reference', this.purchaseOrderForm.controls['otherRefFormControl'].value);
          formdata.append('terms_of_delivery', this.purchaseOrderForm.controls['termsDeliveryFormControl'].value);
          formdata.append('note', this.purchaseOrderForm.controls['noteFormControl'].value);
          formdata.append('sub_total', this.sub_total.toString());
          formdata.append('packing_perct', this.purchaseOrderForm.controls['packPrecntFormControl'].value);
          formdata.append('packing_amount', this.packing_amount.toString());
          // formdata.append('total_amount', this.total_amount.toString());
          formdata.append('sgst', this.sgst.toString());
          formdata.append('cgst', this.cgst.toString());
          formdata.append('igst', this.igst.toString());
          formdata.append('invoice_amount', this.invoice_amount);
          if(this.purchaseOrderForm.controls['poNumberFormControl'].value){
            formdata.append('store_id', this.store_id);
          }else{
            formdata.append('store_id', sessionStorage.getItem("store_id"));
          }

          formdata.append('terms_conditions', this.purchaseOrderForm.controls['termsConditionFormControl'].value);

          this.selected_product_list.forEach(element => {
            // let tres = (parseInt(element.qty) + parseInt(element.finished_qty))
            // if(parseInt(element.order_qty) > tres){
            //   this.nbtoastService.danger('order quantity should not be greater than required quantity');
            //   break if qty is greater
            //   return;
            // }
            element = moment(element.delivery_date).format("YYYY-MM-DD")
          });
          formdata.append('po_products', JSON.stringify(this.selected_product_list))

          this.purchaseService.savePO(formdata).subscribe(
            (data) =>
            {
              console.log(data)
              if (this.po_id)
              {
                this.nbtoastService.success(`PO Updated SuccessFully ${data}`);
              }
              else
              {
                this.nbtoastService.success(`PO Created SuccessFully ${data}`);
              }
              this.routes.navigateByUrl("/PurchaseInvoicePage?id=" + data)
            },
            (error) =>
            {
              this.nbtoastService.danger(error);
            })

  }


  // save_po(): any {
  //   this.onSubmit()


  //       if (!this.selected_product_list.length)
  //         {
  //           this.nbtoastService.danger('Please Enter At Least ONE Product in Details Section')
  //         }
  //         else
  //         {
  //           let dd: boolean;
  //           this.selected_product_list.forEach(
  //           a =>
  //           {
  //             if (!a.delivery_date)
  //             {
  //               dd = false
  //               this.nbtoastService.danger('Please Provide Product delivery Details Section');
  //             }
  //             else
  //             {
  //               dd = true
  //             }
  //           })
  //           console.log(dd)
  //           if (dd)
  //           {
  //            console.log(this.purchaseOrderForm.valid)
  //            console.log(this.purchaseOrderForm)
  //             // pr save
  //             if (this.purchaseOrderForm.valid){
  //             // const formData = this.update_pr_data();
  //             if (!this.pr_product_array.length )
  //             {
  //               this.nbtoastService.danger('Please Enter At Least ONE Product in Details Section')
  //             }
  //             else
  //             {
  //               let dd:boolean;
  //               this.pr_product_array.forEach(
  //                 a =>{
  //                   if(!a.expected_date && !a.product_code && !a.product_name && !a.required_quantity)
  //                   {
  //                     dd=false
  //                     this.nbtoastService.danger('Please Provide Product  Details Section');
  //                   }else if(a.expected_date == "NaN-NaN-NaN")
  //                   {
  //                     dd=false
  //                     this.nbtoastService.danger('Please Provide Required Date in Details Section');
  //                   }
  //                   else
  //                   {
  //                     dd=true
  //                   }
  //                 })
  //               console.log(dd)
  //               if(dd){

  //             // this.purchaseService.savePR(formData).subscribe(
  //             //   (data) => {
  //             //   this.save();
  //             //   this. approvePR();
  //             //   },
  //             //   (error) => {
  //             //     this.nbtoastService.danger("Failed to Save");
  //             //   }
  //             // );
  //               }
  //             }


  //             // end pr save
  //           }
  //           }
  //           else
  //           {
  //             this.nbtoastService.danger(`PO is Not approved`);
  //           }
  //         }




  // }

  // update_pr_data(){
  //   // this.onSubmit();
  //   // if(this.prForm.controls['qtyFormControl'].value != ""){
  //   const formData = new FormData();
  //   // console.log(this.formatDate(this.prForm.controls['prDateFormControl'].value))
  //   if (this.selected_pr_data.id){
  //     formData.append('id', this.selected_pr_data.id)
  //   }
  //   formData.append('pr_date', this.selected_pr_data.pr_date);
  //   formData.append('created_user', this.selected_pr_data.created_user);
  //   formData.append('dept',this.selected_pr_data.dept__id);
  //   formData.append('store_id', this.selected_pr_data.store_id);

  //   this.pr_product_array.forEach((element) => {
  //     console.log(element.expected_date);
  //     element.expected_date = this.formatDate(element.expected_date);
  //     element.active =element.active.toString();
  //     console.log(element.expected_date);
  //   });

  //   formData.append('product_list', JSON.stringify(this.pr_product_array));
  //   // for ( const product in this.selected_product_list) {
  //   //   product.expected_date = this.formatDate(product.expected_date)
  //   // }
  //   console.log(this.selected_product_list);
  //   return formData;
  // // }
  // }

  // approvePR():any
  // {
  //   const formData = this.update_pr_data();
  //   formData.append('id', this.selected_pr_data.id);
  //   formData.append('approved_by', this.selected_pr_data.approved_by);
  //   formData.append('approved_date', this.formatDate(new Date()));
  //   formData.append('approved_date', this.selected_pr_data.approved_date);

  //   this.purchaseService.approvePR(formData).subscribe(
  //     (data) => {
  //       this.nbtoastService.success("PR Details Approved Successfully, PR number is : " + data)
  //       // this.ngOnInit();
  //       // this.routes.navigate(['/PurchaseRequisitionList'])
  //     },
  //     (error) => {
  //       this.nbtoastService.danger(error.detail);
  //     }
  //   );
  // }

  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  // delete_product(id, item): any {

  //   const data = { 'id': id }
  //   if (id !== "") {
  //     this.purchaseService.deleteProductFromPO(data).subscribe(
  //       (data) => {
  //         this.nbtoastService.info("Item Removed");
  //         this.selected_product_list = this.selected_product_list.filter(item =>
  //           item.id != id
  //         )

  //         //remove from pr_products1
  //         const index2: number = this.pr_products1.indexOf(item);
  //         if (index2 !== -1) {
  //           this.pr_products1.splice(index2, 1);
  //         }

  //         this.selected_product_list.forEach(item =>
  //           this.calculate_sub_total(item))
  //         },
  //       (error) => {
  //         this.nbtoastService.danger("Unable remove product");
  //       }
  //     )
  //   } else {
  //     const index: number = this.selected_product_list.indexOf(item);
  //     if (index !== -1) {
  //       this.selected_product_list.splice(index, 1);
  //     }
  //     //remove from pr_products1
  //     const index2: number = this.pr_products1.indexOf(item);
  //     if (index2 !== -1) {
  //       this.pr_products1.splice(index2, 1);
  //     }
  //   }
  // }


  get f() { return this.purchaseOrderForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.purchaseOrderForm.invalid) {
      return;
    }
    if (!this.purchaseOrderForm.invalid) {
      return this.submitted = false;
    }



  }

}
