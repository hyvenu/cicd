import { Component, OnInit, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PurchaseService } from '../purchase.service';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { ChangeDetectorRef, TemplateRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { InventoryService } from 'src/app/inventory/inventory.service'
import { SharedService } from 'src/app/shared/shared.service';



@Component({
  selector: 'app-purchase-requisition',
  templateUrl: './purchase-requisition.component.html',
  styleUrls: ['./purchase-requisition.component.scss']
})
export class PurchaseRequisitionComponent implements OnInit {

  IsPRInfo: boolean;
  prForm: FormGroup;
  dailog_ref;
  login_user;
  store_name;
  checked;
  pr_status;

  searchProduct;
  product_list;
  unit_list;
  department_list;
  selectedOption;
  pr_id;

  selected_product_list = [];

  constructor(private formBuilder: FormBuilder,
    private purchaseService: PurchaseService,
    private inventoryService: InventoryService,
    private sharedService: SharedService,
    private nbtoastService: NbToastrService,
    private routes: Router,
    private route: ActivatedRoute,
    private dialogService: NbDialogService,
    private cd: ChangeDetectorRef,) {
    this.sharedService.getDepartmentList().subscribe(
      (dep_data) => {
        this.department_list = dep_data;
        console.log(this.department_list);
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
    this.IsPRInfo = true;
    this.selected_product_list = [];
    console.log(sessionStorage.getItem("first_name"));
    this.login_user = sessionStorage.getItem("first_name");
    this.store_name = sessionStorage.getItem("store_name");
    this.prForm = this.formBuilder.group({
      prNoFormControl: ['', [Validators.required]],
      prDateFormControl: ['', [Validators.required]],
      userFormControl: ['', [Validators.required]],
      departFormControl: ['', [Validators.required]],
      statusFormControl: ['', [Validators.required]],
    });

    this.prForm.controls['userFormControl'].setValue(this.login_user);

    let param1 = this.route.snapshot.queryParams["id"];
    if (param1) {
      this.purchaseService.getPRDetails(param1).subscribe((data) => {
        this.pr_id = data.id
        this.pr_status = data.status
        this.prForm.controls['prNoFormControl'].setValue(data.pr_no);
        this.prForm.controls['prDateFormControl'].setValue(data.pr_date);
        this.prForm.controls['userFormControl'].setValue(data.created_user);
        this.selectedOption = data.dept__id;
        this.prForm.controls['statusFormControl'].setValue(data.status);
        // this.prForm.controls['departFormControl'].setValue(data.dept__department_name);

        this.selected_product_list = data.selected_product_list;

      });
    }
    // this.prForm.controls['departFormControl'].setValue(this.department_list)
    this.inventoryService.getProductList().subscribe(
      (data) => {
        this.product_list = data;
      },
      (error) => {
        this.nbtoastService.danger(error, "Error")
      }
    );


  }

  toggle(event) {
    this.checked = event.target.checked;

  }

  open(dialog: TemplateRef<any>) {
    this.dailog_ref = this.dialogService.open(dialog, { context: this.product_list })
      .onClose.subscribe(data => {
        //  this.product_list = data
        this.selected_product_list.push({
          id: data.id,
          product_code: data.product_code,
          product_name: data.product_name,
          description: '',
          store: this.store_name,
          required_qty: '',
          unit: '',
          expected_date: '',
          active:''
        });
      });
    //  this.subcategoryFrom.controls['categoryNameFormControl'].setValue(data.category_name);
    console.log(this.selectedOption);
  }

  onDepartmentChange() {

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

  approvePR(): any {
    const formData = this.saveFormData();
    formData.append('id', this.pr_id);
    formData.append('approved_by', this.login_user);
    formData.append('approved_date', this.formatDate(new Date()));

    this.purchaseService.approvePR(formData).subscribe(
      (data) => {
        this.nbtoastService.success("PR Details Approved Successfully, PR number is : " + data)
        this.ngOnInit();
      },
      (error) => {
        this.nbtoastService.danger(error.detail);
      }
    );
  }

  delete(item): any {
    const formData = new FormData()
    formData.append('id', item.id);
    this.purchaseService.deleteProductFromPR(formData).subscribe(
      (data) => {
        this.nbtoastService.success("Product deleted from PR Successfully, Product code is : " + data)
        this.ngOnInit();
      },
      (error) => {
        this.nbtoastService.danger(error.detail);
      }
    );
  }

  rejectPR():any {
    const formData = this.saveFormData();
    formData.append('id', this.pr_id);
    formData.append('approved_by', this.login_user);
    formData.append('approved_date', this.formatDate(new Date()));

    this.purchaseService.rejectPR(formData).subscribe(
      (data) => {
        this.nbtoastService.success("PR Details Rejected Successfully, PR number is : " + data)
        this.ngOnInit();
      },
      (error) => {
        this.nbtoastService.danger(error.detail);
      }
    );
  }

  savePR(): any {
    const formData = this.saveFormData();
    this.purchaseService.savePR(formData).subscribe(
      (data) => {
        this.nbtoastService.success("PR Details Saved Successfully, PR number is : " + data)
        this.ngOnInit();
      },
      (error) => {
        this.nbtoastService.danger(error.detail);
      }
    );

  }


  private saveFormData() {
    const formData = new FormData();
    // console.log(this.formatDate(this.prForm.controls['prDateFormControl'].value))
    if (this.pr_id){
      formData.append('id', this.pr_id)
    }
    formData.append('pr_date', this.formatDate(this.prForm.controls['prDateFormControl'].value));
    formData.append('created_user', this.prForm.controls['userFormControl'].value);
    formData.append('dept', this.selectedOption);


    this.selected_product_list.forEach((element) => {
      console.log(element.expected_date);
      element.expected_date = this.formatDate(element.expected_date);
      element.active = element.active.toString();
      console.log(element.expected_date);
    });

    formData.append('product_list', JSON.stringify(this.selected_product_list));
    // for ( const product in this.selected_product_list) {
    //   product.expected_date = this.formatDate(product.expected_date)
    // }
    console.log(this.selected_product_list);
    return formData;
  }
}
