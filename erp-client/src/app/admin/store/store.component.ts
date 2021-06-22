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
  store_list: [];
  selected_store: any;
  store_location: [];
  searchPinCode: any;
  shipPinCode: any;
  shipLocationName: any;
  loc_id: any;
  createFlag_Loc: boolean = true;
  submitted: boolean = false;

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  omit_special_char(event)
{   
   var k;  
   k = event.charCode;  //         k = event.keyCode;  (Both can be used)
   return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57)); 
}


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
        storePinCodeFormControl: ['',[Validators.required,Validators.pattern('^[0-9]{6}$')]],
        storeCityFormControl: ['',[Validators.required]],
        gstFormControl: ['',[Validators.required,Validators.maxLength(15)]],
        mainBranchFormControl: [''],
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
          this.storeForm.controls['mainBranchFormControl'].setValue(data.is_head_office);

        },
        (error) =>{
          this.nbtoastService.danger("Unable to get Store Information")
        }
      )
    }

    this.get_store_list();
    

  }

  saveStore(): void {
    if (this.storeForm.dirty && this.storeForm.valid){
      let formData = new FormData()
      formData.append("store_name",this.storeForm.get(['storeNameFormControl']).value);
      formData.append("address",this.storeForm.get(['storeAddressFormControl']).value);
      formData.append("pin_code",this.storeForm.get(['storePinCodeFormControl']).value);
      formData.append("city",this.storeForm.get(['storeCityFormControl']).value);
      formData.append("gst_no",this.storeForm.get(['gstFormControl']).value);
      formData.append("is_head_office",this.storeForm.get(['mainBranchFormControl']).value);

      this.adminService.saveStore(formData).subscribe(
        (data) => {
          this.nbtoastService.success("Store Information saved successfully")
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
      formData.append("is_head_office",this.storeForm.get(['mainBranchFormControl']).value);
      
      this.adminService.updateStore(this.store_id, formData).subscribe(
        (data) => {
          this.nbtoastService.success("Store Information saved successfully")
        },
        (error) =>{
          this.nbtoastService.danger("Unable to save store information")
        }
      )

    }
    
  }

  get_store_list(): void{
    const data = ""
    this.adminService.getStore(data).subscribe(
      (data) =>{
        this.store_list = data;
      },
      (error) => {
        this.nbtoastService.danger("unable to get store list");
      }
    )
  }

  get_ship_locations(): void {
    this.adminService.getStoreShipLocations(this.selected_store).subscribe(
      (data) =>{
        this.store_location = data
      },
      (error) =>{
        this.nbtoastService.danger("unable to get store locations list");
      }
    )
  }

  save_location(pin_code, location):any{
    const data = new FormData()
    data.append('pin_code',pin_code)
    data.append('location_name',location)
    data.append('store',this.selected_store)
    this.adminService.saveStoreShipLocations(data).subscribe(
      (data) => {
          this.nbtoastService.success("Shipping location added successfuly")
          this.get_ship_locations();
          this.shipLocationName ='';
          this.shipPinCode ='';
          this.createFlag_Loc = true;
      },
      (error) => {
        this.nbtoastService.danger("Unable to  add shipping location added successfuly")
      }
    )
  }

  get_selected_loc(data): any {
    this.shipLocationName = data.location_name;
    this.shipPinCode = data.pin_code;
    this.loc_id = data.id;
    this.createFlag_Loc = false;
  }

  update_location(pin_code, location):any{
    const data = new FormData()
    data.append('id',this.loc_id)
    data.append('pin_code',pin_code)
    data.append('location_name',location)
    data.append('store',this.selected_store)
    this.adminService.updateStoreShipLocations(this.loc_id,data).subscribe(
      (data) => {
        this.nbtoastService.success("Shipping location updated successfuly")
        this.get_ship_locations();
        this.shipLocationName ='';
        this.shipPinCode ='';
        this.createFlag_Loc = true;
      },
      (error) => {
        this.nbtoastService.danger("Unable to  add shipping location added successfuly")
      }
    )
  }
  delete_location(pin_code, location):any{
    this.adminService.deleteStoreShipLocations(this.loc_id).subscribe(
      (data) => {
        this.nbtoastService.warning("Shipping location deleted successfuly")
      },
      (error) => {
        this.nbtoastService.danger("Unable to remove shipping location")
      }
    )
  }


get f() { return this.storeForm.controls; }

onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.storeForm.invalid) {
        return;
    }
    if (!this.storeForm.invalid){
      return this.submitted = false;
    }

    
  
}

}
