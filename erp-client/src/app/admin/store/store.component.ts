import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {

  storeForm: FormGroup;
  createFlag = true;
  store_id: any;

  constructor(private formBuilder: FormBuilder,
              private nbtoastService: NbToastrService,
              private routes: Router,
              private adminService: AdminService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.createFlag = true;
    this.storeForm = this.formBuilder.group(
      {
        storeNameFormControl: ['',[Validators.required]],
        storeAddressFormControl: ['',[Validators.required]],
        storePinCodeFormControl: ['',[Validators.required]],
        storeCityFormControl: ['',[Validators.required]],
        gstFormControl: ['',[Validators.required]],
      }
    )

    this.store_id = this.route.snapshot.queryParams["id"];
    if(this.store_id){
      this.createFlag = false;
      this.adminService.getStore(this.store_id).subscribe(
        (data) => {
          this.storeForm.controls['storeNameFormControl'].setValue(data.store_name);
          this.storeForm.controls['storeAddressFormControl'].setValue(data.address);
          this.storeForm.controls['storePinCodeFormControl'].setValue(data.pin_code);
          this.storeForm.controls['storeCityFormControl'].setValue(data.city);
          this.storeForm.controls['gstFormControl'].setValue(data.gst_no);

        },
        (error) =>{
          this.nbtoastService.danger("Unable to get Store Information")
        }
      )
    }

  }

  saveStore(): void {
    if (this.storeForm.dirty && this.storeForm.valid){
      let formData = new FormData()
      formData.append("store_name",this.storeForm.get(['storeNameFormControl']).value);
      formData.append("address",this.storeForm.get(['storeAddressFormControl']).value);
      formData.append("pin_code",this.storeForm.get(['storePinCodeFormControl']).value);
      formData.append("city",this.storeForm.get(['storeCityFormControl']).value);
      formData.append("gst_no",this.storeForm.get(['gstFormControl']).value);

      this.adminService.saveStore(formData).subscribe(
        (data) => {
          this.nbtoastService.info("Store Information saved successfully")
          this.ngOnInit();
        },
        (error) =>{
          this.nbtoastService.danger("Unable to save store information")
        }
      )

    }

  }
  updateStore(): void {
    if (this.storeForm.dirty && this.storeForm.valid){
      let formData = new FormData()      
      formData.append("store_name",this.storeForm.controls['storeNameFormControl'].value);
      formData.append("address",this.storeForm.controls['storeAddressFormControl'].value);
      formData.append("pin_code",this.storeForm.controls['storePinCodeFormControl'].value);
      formData.append("city",this.storeForm.controls['storeCityFormControl'].value);
      formData.append("gst_no",this.storeForm.controls['gstFormControl'].value);

      this.adminService.updateStore(this.store_id, formData).subscribe(
        (data) => {
          this.nbtoastService.info("Store Information saved successfully")
        },
        (error) =>{
          this.nbtoastService.danger("Unable to save store information")
        }
      )

    }
    
  }
}
