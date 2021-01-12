import { Component, OnInit, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PurchaseService } from '../purchase.service';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { ChangeDetectorRef, TemplateRef } from '@angular/core';
import { Router,NavigationEnd } from '@angular/router';
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

  searchProduct;
  product_list;
  unit_list;
  department_list;
  selectedOption;
  
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
            // console.log(this.department_list);
        },
        (error) => {
            this.nbtoastService.danger(error,"Error")
        }
      );

      this.inventoryService.getUnitMasterList().subscribe(
        (data) => {
            this.unit_list = data;
        },
        (error) => {
            this.nbtoastService.danger(error,"Error")
        }
      );
    }

  ngOnInit(): void {
    this.IsPRInfo = true;
    console.log(sessionStorage.getItem("first_name"));
    this.login_user = sessionStorage.getItem("first_name");
    this.store_name = sessionStorage.getItem("store_name");
    this.prForm  =  this.formBuilder.group({
      prNoFormControl: ['', [Validators.required]],
      prDateFormControl: ['', [Validators.required]],      
      userFormControl: ['', [Validators.required]],
      departFormControl: ['', [Validators.required]],
    });

    this.prForm.controls['userFormControl'].setValue(this.login_user);
    // this.prForm.controls['departFormControl'].setValue(this.department_list)
    this.inventoryService.getProductList().subscribe(
      (data) => {
          this.product_list = data;
      },
      (error) => {
          this.nbtoastService.danger(error,"Error")
      }
    );

  }

  open(dialog: TemplateRef<any>) {
    this.dailog_ref= this.dialogService.open(dialog, { context: this.product_list})
    .onClose.subscribe(data => {
      //  this.product_list = data
       this.selected_product_list.push({product_code:data.product_code, 
          product_name:data.product_name,
          description: '',
          store_name: '',
          required_qty: '',
          unit: '',
          expected_date: '',
        });
       });
      //  this.subcategoryFrom.controls['categoryNameFormControl'].setValue(data.category_name);
      console.log(this.selectedOption);
    }
    
    onDepartmentChange() {

    }

    savePR():any {
    }
  
}
