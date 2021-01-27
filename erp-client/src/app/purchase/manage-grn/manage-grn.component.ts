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

  sgst: number = 0;
  cgst: number = 0;
  igst: number = 0;
  sub_total: number = 0;
  grand_total: number = 0;
  invoiceDoc: any;
  imgSrc: any;
  grn_id: any;
  vendor_code: any;
  vendor: any;
  vendor_id: any;

  constructor(private formBuilder: FormBuilder,
    private purchaseService: PurchaseService,
    private inventoryService: InventoryService,
    private nbtoastService: NbToastrService,
    private routes: Router,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private dialogService: NbDialogService,) { }

  ngOnInit(): void {
    this.IsGrnInfo = true;
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

  }

  po_open(dialog: TemplateRef<any>) {
    this.purchaseService.getPOList().subscribe(
      (data) => {
        this.po_list = data;
        console.log(this.po_list);
        this.dailog_ref = this.dialogService.open(dialog, { context: this.po_list })
          .onClose.subscribe(data => {
            //  this.product_list = data
            this.grnMasterForm.controls['poNumberFormControl'].setValue(data.po_number);
            this.purchaseService.getVendor(data.vendor_id).subscribe((data2) => {
              this.vendor_code = data2.vendor_code;
              this.vendor_id = data.vendor_id;
              this.grnMasterForm.controls['vendorNameFormControl'].setValue(data2.vendor_name);
              this.grnMasterForm.controls['vendorAddressFormControl'].setValue(data2.branch_ofc_addr);

              this.purchaseService.getPODetails(data.id).subscribe(
                (po_details) => {
                  // this.selected_product_list = po_details.order_details;
                  let i = 1;
                  po_details.order_details.forEach(element => {

                    this.inventoryService.getProduct(element['product_id']).subscribe(
                      (product) => {
                        this.selected_product_list.push({
                          slno: i++,
                          product_id: element['id'],
                          product_code: product['product_code'],
                          product_name: product['product_name'],
                          description: product['description'],
                          hsn_code: product['hsn_code'],
                          amount: element['amount'],
                          po_qty: element['qty'],
                          received_qty: element['qty'],
                          rejected_qty: 0,
                          accepted_qty: 0,
                          unit_id: element['unit_id'],
                          unit_price: element['unit_price'],
                          gst: element['gst'],
                          gst_amount: element['gst_amount'],
                          total: element['amount'] + element['gst_amount'],
                        });
                      });
                    console.log(element['product_id']);
                  });


                }
              );
            });
            console.log(data.po_number);
            this.selected_product_list.forEach(element => {
              this.sub_total = this.sub_total + Number(element['amount']);
              this.sgst = this.sgst + Number(element['gst']);
              console.log("element.amount " + element['amount']);
            });
          });
      }
    );
  }

  calculate(item) {

    item.accepted_qty = item.received_qty - item.rejected_qty;
    item.amount = item.received_qty * item.unit_price;
    item.gst_amount = item.amount * item.gst / 100;
    item.total = item.amount + item.gst_amount;
    this.sub_total = 0;
    let st = 0;
    this.selected_product_list.forEach(element => {
      console.log("chnaged event called " + this.sub_total);

      st = (st + Number(element.amount));
      console.log("chnaged event called " + this.sub_total);
      this.sgst = this.sgst + Number(element.gst);
    });
    this.sub_total = st;
    this.sgst = this.sgst / 2;
    this.cgst = this.sgst;
    this.grand_total = this.sub_total + ((this.sgst + this.cgst) * this.sub_total / 100)
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
    if (this.grn_id) {
      formData.append('id', this.grn_id);
      formData.append('grn_code', this.grnMasterForm.controls['grnNumberFormControl'].value);
    }
    formData.append('grn_date', this.formatDate(this.grnMasterForm.controls['grnDateFormControl'].value));
    formData.append('po_number', this.grnMasterForm.controls['poNumberFormControl'].value);
    formData.append('invoice_number', this.grnMasterForm.controls['invoiceNumberFormControl'].value);
    formData.append('invoice_date', this.formatDate(this.grnMasterForm.controls['invoiceDateFormControl'].value));
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

    this.selected_product_list.forEach((element) => {
      // console.log(element.expected_date);
      element.expected_date = this.formatDate(element.expected_date);
      element.active = element.active;
      // console.log(element.expected_date);

      if (element.accepted_qty == element.po_qty) {
        formData.append('grn_status', 'COMPLETED');
      } else {
        formData.append('grn_status', 'PARTIALLY_COMPLETED');
      }
    });
    
    formData.append('product_list', JSON.stringify(this.selected_product_list));
    formData.append('sub_total', this.sub_total.toString());
    formData.append('grand_total', this.grand_total.toString());

    this.purchaseService.saveGRN(formData).subscribe(
      (data) => {
        this.nbtoastService.success("GRN Details Saved Successfully, grn number is : " + data)
        this.ngOnInit();
      },
      (error) => {
        this.nbtoastService.danger(error.detail);
      }
    );
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
}