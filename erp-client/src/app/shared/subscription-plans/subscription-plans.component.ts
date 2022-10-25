import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import * as moment from 'moment';
import { AdminService } from 'src/app/admin/admin.service';
import { OrderService } from 'src/app/sales/order.service';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-subscription-plans',
  templateUrl: './subscription-plans.component.html',
  styleUrls: ['./subscription-plans.component.scss']
})
export class SubscriptionPlansComponent implements OnInit {


  createFlag = false;
  active = true;


  subscriptionForm: FormGroup;

  pipe = new DatePipe('en-US');
  submitted: boolean = false;
  rowData = [];
  plan_id: any;

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }



  plansSettings = {
    // selectMode: 'multi',
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
      plan_name: {
        title: 'plan name',
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          return `<a href="subscriptionplans?id=${row.id}">${row.plan_name}</a>`;
        }
      },
      Plan_amount: {
        title: 'Plan amount',
      },
      validity_date: {
        title: 'validity date',
        valuePrepareFunction: (cell, row) => {
          let newMomentObj = this.pipe.transform(row.validity_date, 'dd-MM-yyyy')
          const date = new Date();
          let newMomentObj1 = this.pipe.transform(date, 'dd-MM-yyyy')
          if (newMomentObj == newMomentObj1) {
            let data = {
              active: row.active = false
            }
            this.sharedService.updateplan(data, row.id).subscribe((data) => {
            })
          }
          return newMomentObj
        },
      },
    },
  };
  onactive() {
    this.sharedService.getplans().subscribe(
      (data) => {
        let t = data.filter(a => {
          if (a.active) {
            return a;
          }
        })
        this.rowData = t;
        console.log("row data", this.rowData)
      },
      (error) => {
        this.nbtoastService.danger(error);
      }
    )
  }

  onInactive(): void {
    console.log("inactive button clicked")
    this.sharedService.getplans().subscribe(
      (data) => {
        let t = data.filter(a => {
          if (!a.active) {
            return a;
          }
        })
        this.rowData = t;
      },
      (error) => {
        this.nbtoastService.danger(error);
      }
    )
  }


  constructor(private formBuilder: FormBuilder,
    private nbtoastService: NbToastrService,
    private dialogService: NbDialogService,
    private routes: Router,
    private route: ActivatedRoute,
    private adminService: AdminService,
    private sharedService: SharedService,
    private OrderService: OrderService,) {
  }

  ngOnInit(): void {
    this.subscriptionForm = this.formBuilder.group({
      PlanFormControl: ['', [Validators.required]],
      planamountFormControl: ['', [Validators.required]],
      validitydateFormControl: ['', []],
      ActiveFormControl: ['', []],
    })

    this.onactive();
    let param = this.route.snapshot.queryParams['id'];
    if (param) {
      this.sharedService.getplanDetails_by_id(param).subscribe(
        (data) => {
          console.log(data)
          this.plan_id = data.id
          this.createFlag = true;
          this.subscriptionForm.controls['PlanFormControl'].setValue(data.plan_name);
          this.subscriptionForm.controls['planamountFormControl'].setValue(data.Plan_amount);
          this.subscriptionForm.controls['validitydateFormControl'].setValue(moment(data.validity_date));
          this.subscriptionForm.controls['ActiveFormControl'].setValue(data.active);
        })
    }
  }

  saveInfo() {
    this.onactive();
    let formdata = new FormData();
    if (this.plan_id) {
      formdata.append('plan_name', this.subscriptionForm.controls['PlanFormControl'].value);
      formdata.append('Plan_amount', this.subscriptionForm.controls['planamountFormControl'].value);
      formdata.append('validity_date', this.subscriptionForm.controls['validitydateFormControl'].value);
      formdata.append('active', this.subscriptionForm.controls['ActiveFormControl'].value);
      this.sharedService.updateplan(formdata, this.plan_id).subscribe(
        (data) => {
          this.nbtoastService.success("plan Updated Successfully")
          window.location.reload();
          this.routes.navigate(["/subscriptionplans"]);
          this.subscriptionForm.reset();
        }),
        (error) => {
          this.nbtoastService.danger("Failed to update");
        }
    } else {

      formdata.append('plan_name', this.subscriptionForm.controls['PlanFormControl'].value);
      formdata.append('Plan_amount', this.subscriptionForm.controls['planamountFormControl'].value);
      formdata.append('validity_date', this.subscriptionForm.controls['validitydateFormControl'].value);
      formdata.append('active', this.subscriptionForm.controls['ActiveFormControl'].value);
      this.sharedService.saveplan(formdata).subscribe(
        (data) => {
          this.onactive();
          this.nbtoastService.success("Plan Added Successfully")
          window.location.reload();
          this.routes.navigate(["/subscriptionplans"]);
          this.subscriptionForm.reset();
        },
        (error) => {
          this.nbtoastService.danger("Failed to save");
        }
      )
    }
  }

  get f() { return this.subscriptionForm.controls; }
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.subscriptionForm.invalid) {
      return;
    }
    if (!this.subscriptionForm.invalid) {
      // this.membersForm.reset()
      return this.submitted = false;
    }
  }
}
