import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { PurchaseService } from '../purchase.service';
import { NbSelectModule } from '@nebular/theme';
import { InventoryService } from 'src/app/inventory/inventory.service';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef, TemplateRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Identifiers } from '@angular/compiler';
import * as moment from 'moment';
import { parse } from 'date-fns';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-manage-grn',
  templateUrl: './manage-grn.component.html',
  styleUrls: ['./manage-grn.component.scss']
})
export class ManageGrnComponent implements OnInit {

  grn_date: any;
  IsGrnInfo: boolean;
  grnMasterForm: FormGroup;
  po_list: [];
  dailog_ref: any;
  vendor_details: [];
  selected_product_list = [

  ];

  sgst: any = 0;
  cgst: any = 0;
  igst: any = 0;
  sub_total: any = 0;
  grand_total: number = 0;
  invoiceDoc = [];
  imgSrc: any;
  grn_id: any;
  vendor_code: any;
  vendor_state_code;
  vendor: any;
  vendor_id: any;
  unit_list: [];
  store_id;
  grndate: any;
  invoicedate: any;
  submitted: boolean=false;
  total_gst: number;
  vendor_list: any;
  select_code: any;
  url = `${environment.BASE_SERVICE_URL}/`;
  dateofdata: any =[];
  current_date :any = new Date();
  searchPO: string;
  qty_recived: any;
  qty_rejected: any;

  constructor(private formBuilder: FormBuilder,
    private purchaseService: PurchaseService,
    private inventoryService: InventoryService,
    private nbtoastService: NbToastrService,
    private routes: Router,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private dialogService: NbDialogService,) { }

  ngOnInit(): void {

    this.purchaseService.getVendorList().subscribe(
      (data) => {
        this.vendor_list = data;
      },
      (error) => {
        this.nbtoastService.danger("Error while getting vendor list")
      }
    )
    this.IsGrnInfo = true;
    this.selected_product_list = [];
    this.sub_total = 0;
    this.sgst = 0;
    this.cgst = 0;
    this.igst = 0;
    this.grand_total = 0;
    this.grnMasterForm = this.formBuilder.group({
      grnNumberFormControl: ['', [Validators.required]],
      grnDateFormControl: ['', [Validators.required]],
      invoiceNumberFormControl: ['', [Validators.required]],
      invoiceDateFormControl: ['', [Validators.required]],
      poNumberFormControl: ['', [Validators.required]],
      vendorNameFormControl: ['', [Validators.required]],
      vendorAddressFormControl: ['', [Validators.required]],
      vehicleNumberFormControl: ['', [Validators.required]],
      timeInFormControl: ['', [Validators.required]],
      timeOutFormControl: ['', [Validators.required]],
      transporterNameFormControl: ['', [Validators.required]],
      statutoryDetailsFormControl: ['', [Validators.required]],
      noteFormControl: ['', [Validators.required]],
      invoiceDocumentFormControl: ['', [Validators.required]],
    });

    let param = this.route.snapshot.queryParams['id'];
    
    this.store_id = sessionStorage.getItem('store_id');
    if (param) {
      this.purchaseService.getGRNDetails(param).subscribe(
        (data) => {
          console.log(data)
          this.grn_id = data.id
          // this.purchaseOrderForm.controls['poTypeFormControl'].setValue(data.po_type);
          this.grnMasterForm.controls['poNumberFormControl'].setValue(data.po_number);
          this.grnMasterForm.controls['grnNumberFormControl'].setValue(data.grn_code);
          this.grnMasterForm.controls['grnDateFormControl'].setValue(moment(data.grn_date));
          this.grnMasterForm.controls['poNumberFormControl'].setValue(data.po_number);
          this.grnMasterForm.controls['invoiceNumberFormControl'].setValue(data.invoice_number);
          this.grnMasterForm.controls['invoiceDateFormControl'].setValue(moment(data.invoice_date));
          this.grnMasterForm.controls['vendorNameFormControl'].setValue(data.vendor_name);
          this.grnMasterForm.controls['vendorAddressFormControl'].setValue(data.vendor_address);
          this.grnMasterForm.controls['vehicleNumberFormControl'].setValue(data.vehicle_number);
          this.grnMasterForm.controls['timeInFormControl'].setValue(data.time_in);
          this.grnMasterForm.controls['timeOutFormControl'].setValue(data.time_out);
          console.log("grn status"+ data.grn_status);
          this.grnMasterForm.controls['transporterNameFormControl'].setValue(data.transporter_name);
          this.grnMasterForm.controls['statutoryDetailsFormControl'].setValue(data.statutory_details);
          this.grnMasterForm.controls['noteFormControl'].setValue(data.note);
          // this.grnMasterForm.controls['invoiceDocumentFormControl'].setValue(data.invoice_doc);
          this.imgSrc = this.url+ data.invoice_doc;
          this.vendor_id=data.vendor
          this.store_id = data.store_id;
          this.select_code = this.vendor_list.find(item => item.id == this.vendor_id)
          this.vendor_state_code= this.select_code.state_code
          console.log(this.vendor_state_code)
          console.log(this.store_id)
          
          
          this.sub_total = data.sub_total;
          this.grand_total = (data.grand_total);
          this.sgst = parseFloat(data.sgst);
          this.cgst = parseFloat(data.cgst);
          this.igst = parseFloat(data.igst);
          // this.selected_product_list = data.product_list;
          
          // this.selected_product_list.forEach((element) => {
          //   element.expiry_date = moment(element.expiry_date);
          //   // console.log("expiry " + element.expiry_date);
          // });

          data.product_list.forEach(element => {
            console.log(element)
            this.selected_product_list.push({
              ...element,
              expiry_date:moment(element.expiry_date),
              product_id:element.product,
              active:'',
   
           });
            })

        });
    }

   
    
    this.inventoryService.getUnitMasterList().subscribe(
      (data) => {
        this.unit_list = data;
      },
      (error) => {
        this.nbtoastService.danger(error, "Error")
      }
    );
    this.onChange()
  }

  onChange(){
    this.selected_product_list.forEach(element => {
      console.log(element)
      this.dateofdata = new Date(element.expiry_date)
      console.log(this.dateofdata)
        console.log(this.current_date)
        if(moment(this.dateofdata).format("yyyy-MM-DD") < moment(this.current_date).format("yyyy-MM-DD") ){
          this.nbtoastService.danger("Date Of Request  Allows Only Present Or Future Date"); 
        }
    });
    // this.purchaseOrderForm.controls['poDateFormControl'].valueChanges.subscribe(
    //   (data)=> {  
    //     console.log(new Date(data))
    //     this.dateofdata = new Date(data)
    //     console.log(this.dateofdata)
    //     console.log(this.current_date)
    //     if(moment(this.dateofdata).format("yyyy-MM-DD") < moment(this.current_date).format("yyyy-MM-DD") ){
    //       this.nbtoastService.danger("Date Of Request  Allows Only Present Or Future Date"); 
    //     }

    //   })
     
    }

    check_acc_rej(item){
    
    this.qty_recived = item.received_qty
    this.qty_rejected = item.rejected_qty
    if(this.qty_rejected > this.qty_recived){
      this.nbtoastService.danger('Out of Limit') 
    }

    }


    po_open(dialog: TemplateRef<any>) {
      this.purchaseService.getPOList().subscribe(
        (data) => {
          this.po_list = data;
          console.log(this.po_list);
          this.dailog_ref = this.dialogService.open(dialog, { context: this.po_list })
            .onClose.subscribe(data => {
              this.searchPO=""
              //  this.product_list = data
              this.grnMasterForm.controls['poNumberFormControl'].setValue(data.po_number);
              this.purchaseService.getVendor(data.vendor_id).subscribe((data2) => {
                console.log(data2)
                this.vendor_code = data2.vendor_code;
                this.vendor_id = data2.id;
                this.vendor_state_code = data2.state_code;
                
                this.store_id = data.store_id;
                this.grnMasterForm.controls['vendorNameFormControl'].setValue(data2.vendor_name);
                this.grnMasterForm.controls['vendorAddressFormControl'].setValue(data2.branch_ofc_addr);
  
                this.purchaseService.getPODetails(data.id).subscribe(
                  (po_details) => {
                    // this.selected_product_list = po_details.order_details;
                    this.selected_product_list = [];
                    let i = 1;
                    po_details.order_details.forEach(element => {
  
                      this.inventoryService.getProduct(element['product_id']).subscribe(
                        (product) => {
                         
                           const item ={
                            slno: i++,
                            product_id: product['id'],
                            product_code: product['product_code'],
                            product_name: product['product_name'],
                            description: product['description'],
                            hsn_code: product['hsn_code'],
                            amount: element['amount'],
                            po_qty: element['qty'],
                            received_qty: element['qty'],
                            rejected_qty: 0,
                            accepted_qty: element['qty'],
                            unit_id: element['unit_id'],
                            unit_price: element['unit_price'],
                            gst: element['gst'],
                            gst_amount: element['gst_amount'],
                            total: (Number(element['amount']) + Number(element['gst_amount'])),
                            batch_code: '',
                            expiry_date: null,
                           };
                           this.selected_product_list.push(item)
                          this.calculate(item)
                        });
                      console.log(element['product_id']);
                    });
  
  
                  }
                );
              });
              
              // this.sub_total = parseFloat(data.sub_total)
              // this.sgst = data.sgst
              // this.cgst = data.cgst
              // this.igst = data.igst
              // this.grand_total = (parseFloat(this.sub_total) +parseFloat(this.sgst)+ parseFloat(this.cgst) + parseFloat(this.igst))
             
              console.log('grand total ' + this.grand_total)
              if (this.vendor_state_code == '29') {
                this.sgst = data.sgst
                this.cgst = data.cgst
              } else {
                this.igst = data.igst
  
              }
            });
  
  
        }
      );
    }
  date_check(){
    this.grndate = this.grnMasterForm.controls['grnDateFormControl'].value;
    this.invoicedate = this.grnMasterForm.controls['invoiceDateFormControl'].value;
    let Gdate = new Date(this.grndate)

    console.log(this)
    let Idate = new Date(this.invoicedate)

    if(Gdate < Idate){
      this.nbtoastService.danger("Error:Date is Invalid");
    }
  }

  calculate(item) {

    item.accepted_qty = item.received_qty - item.rejected_qty;
    item.amount = item.accepted_qty * item.unit_price;
    item.gst_amount = item.amount * item.gst / 100;
    item.total = item.amount + item.gst_amount;
    this.sub_total = 0;
    this.total_gst = 0;
    let st = 0;
    
    this.selected_product_list.forEach(element => {
      console.log("chnaged event called " + this.sub_total);

      st = (st + Number(element.total));
      console.log("chnaged event called " + this.sub_total);
      this.total_gst = this.total_gst + Number(element.gst_amount);
    });
    this.sub_total = st;
    if (this.vendor_state_code == '29') {
        this.sgst = this.total_gst / 2;
        this.cgst = this.total_gst/2;
    } else {
      this.igst = this.total_gst;
      this.sgst = 0;
      this.cgst = 0;
    }
    this.grand_total = (parseFloat(this.sub_total)+parseFloat(this.sgst) + parseFloat(this.cgst) + parseFloat(this.igst))
    console.log(this.grand_total)
    this.check_acc_rej(item)
  }



  onFileChange(event, field) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      // just checking if it is an image, ignore if you want      
      for (let i = 0; i < event.target.files.length; i++) {
        this.invoiceDoc.push(<File>event.target.files[i]);
      }
      reader.readAsDataURL(file);
      reader.onload = () => {

        this.imgSrc = reader.result as string;

        this.grnMasterForm.patchValue({
          fileSource: reader.result
        });

      };

    }
  }

  saveGRN(): any {
    
    const formData = new FormData();
    if (!this.selected_product_list.length ) {
      this.nbtoastService.danger('Please Enter At Least ONE Product in Details Section')
    }else{
      let dd:boolean;
      this.selected_product_list.forEach(
        a =>{
          if(!a.expiry_date){
            dd=false
            this.nbtoastService.danger('Please Provide Product Expiry Date Details Section');
          }
          else{
            dd=true
          }
        }
      )
      console.log(dd)
      if(dd){
    if (this.grn_id) {
      formData.append('id', this.grn_id);
      formData.append('grn_code', this.grnMasterForm.controls['grnNumberFormControl'].value);
    }
    formData.append('grn_date', moment(this.grnMasterForm.controls['grnDateFormControl'].value).format("YYYY-MM-DD"));
    formData.append('po_number', this.grnMasterForm.controls['poNumberFormControl'].value);
    formData.append('invoice_number', this.grnMasterForm.controls['invoiceNumberFormControl'].value);
    formData.append('invoice_date', moment(this.grnMasterForm.controls['invoiceDateFormControl'].value).format("YYYY-MM-DD"));
    formData.append('vendor_code', this.vendor_code);
    formData.append('vendor', this.vendor_id);
    formData.append('vendor_name', this.grnMasterForm.controls['vendorNameFormControl'].value);
    formData.append('vendor_address', this.grnMasterForm.controls['vendorAddressFormControl'].value);
    formData.append('vehicle_number', this.grnMasterForm.controls['vehicleNumberFormControl'].value);
    formData.append('time_in', this.grnMasterForm.controls['timeInFormControl'].value);
    formData.append('time_out', this.grnMasterForm.controls['timeOutFormControl'].value);
    formData.append('transporter_name', this.grnMasterForm.controls['transporterNameFormControl'].value);
    formData.append('statutory_details', this.grnMasterForm.controls['statutoryDetailsFormControl'].value);
    formData.append('note', this.grnMasterForm.controls['noteFormControl'].value);
    formData.append('store_id', this.store_id);
    
    if(this.invoiceDoc.length){
      for(let i=0 ; i < this.invoiceDoc.length ; i++)
        formData.append('invoiceDoc[]', this.invoiceDoc[i],this.invoiceDoc[i].name);
    }

    let flag = false;
    this.selected_product_list.forEach((element) => {
      
      element.expiry_date = moment(element.expiry_date).format("YYYY-MM-DD");

      if (element.accepted_qty == element.po_qty) {
        formData.append('grn_status', 'COMPLETED');
      } else {
        formData.append('grn_status', 'PARTIALLY_COMPLETED');
      }
      if (element.po_qty < element.received_qty) {
        flag = true;
      }
    });

    formData.append('product_list', JSON.stringify(this.selected_product_list));
    formData.append('sub_total', this.sub_total.toString());
    formData.append('grand_total', this.grand_total.toString());
    formData.append('sgst', this.sgst.toString());
    formData.append('cgst', this.cgst.toString());
    formData.append('igst', this.igst.toString());


    if (flag) {
      this.nbtoastService.danger("Error: Received quantity is more than PO quantity");
    } else {
      this.purchaseService.saveGRN(formData).subscribe(
        (data) => {
          this.nbtoastService.success("GRN Details Saved Successfully, grn number is : " + data)
          this.ngOnInit();
          this.routes.navigate(['/GrnList'])
        },
        (error) => {
          this.nbtoastService.danger(error.detail);
        }
      );
    }
  }
}
  }

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

get f() { return this.grnMasterForm.controls; }

onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.grnMasterForm.invalid) {
        return;
    }
    if (!this.grnMasterForm.invalid){
      return this.submitted = false;
    }

    
  
}
}