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
  state:{name:string,value:string}[] =[
    {name:"Andaman and Nicobar Islands", value:"35"},
    {name:"Andhra Pradesh", value:"28"},
    {name:"Andhra Pradesh (New)", value:"37"},
    {name:"Arunachal Pradesh", value:"12"},
    {name:"Assam ", value:"18"},
    {name:"Bihar", value:"10"},
    {name:"Chandigarh ", value:"04"},
    {name:"Chattisgarh ", value:"22"},
    {name:"Dadra and Nagar Haveli", value:"26"},
    {name:"Daman and Diu", value:"25"},
    {name:"Delhi", value:"07"},
    {name:"Goa", value:"30"},
    {name:"Gujarat", value:"24"},
    {name:"Haryana", value:"06"},
    {name:"Himachal Pradesh", value:"02"},
    {name:"Jammu and Kashmir", value:"01"},
    {name:"Jharkhand", value:"20"},
    {name:"Karnataka", value:"29"},
    {name:"Kerala", value:"32"},
    {name:"Lakshadweep Islands", value:"31"},
    {name:"Madhya Pradesh", value:"23"},
    {name:"Maharashtra", value:"27"},
    {name:"Manipur", value:"14"},
    {name:"Meghalaya", value:"17"},
    {name:"Mizoram", value:"15"},
    {name:"Nagaland", value:"13"},
    {name:"Odisha", value:"21"},
    {name:"Pondicherry", value:"34"},
    {name:"Punjab", value:"03"},
    {name:"Rajasthan", value:"08"},
    {name:"Sikkim", value:"11"},
    {name:"Tamil Nadu", value:"33"},
    {name:"Telangana", value:"36"},
    {name:"Tripura", value:"16"},
    {name:"Uttar Pradesh ", value:"09"},
    {name:"Uttarakhand", value:"05"},
    {name:"West Bengal", value:"19"},
  ]
  stateCode:any;
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
        storePhoneNumberFormControl:['',[Validators.required,Validators.pattern('^[0-9]{10}$')]],
        storeEmailFormControl:['',[Validators.required,Validators.email]],
        storePinCodeFormControl: ['',[Validators.required,Validators.pattern('^[0-9]{6}$')]],
        storeCityFormControl: ['',[Validators.required]],
        gstFormControl: ['',[Validators.required,Validators.minLength(15),Validators.maxLength(15)]],
        mainBranchFormControl: [''],
        stateNameFormControl: ['', [Validators.required]],
        stateCodeFormControl: ['', [Validators.required]],
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
          this.storeForm.controls['storePhoneNumberFormControl'].setValue(data.store_number);
          this.storeForm.controls['storeEmailFormControl'].setValue(data.email);
          this.storeForm.controls['stateCodeFormControl'].setValue(data.state_code);
          this.storeForm.controls['stateNameFormControl'].setValue(data.state_name);

        },
        (error) =>{
          this.nbtoastService.danger("Unable to get Store Information")
        }
      )
      this.onChange();
    }

    this.get_store_list();
    

  }
  onChange(){
    this.storeForm.get('stateNameFormControl').valueChanges.subscribe(
      tt=>{
        if(tt){
          let searchInState=this.state.filter(s=>s.name===tt)[0];
          this.storeForm.get(['stateCodeFormControl']).setValue(searchInState.value);
        }
      });
  }
  saveStore(): void {
    if (this.storeForm.dirty && this.storeForm.valid){
      let formData = new FormData()
      formData.append("store_name",this.storeForm.get(['storeNameFormControl']).value);
      formData.append("store_number",this.storeForm.get(['storePhoneNumberFormControl']).value);
      formData.append("email",this.storeForm.get(['storeEmailFormControl']).value);
      formData.append("address",this.storeForm.get(['storeAddressFormControl']).value);
      formData.append("pin_code",this.storeForm.get(['storePinCodeFormControl']).value);
      formData.append("city",this.storeForm.get(['storeCityFormControl']).value);
      formData.append("gst_no",this.storeForm.get(['gstFormControl']).value);
      formData.append("is_head_office",this.storeForm.get(['mainBranchFormControl']).value);
      formData.append("state_code",this.storeForm.get(['stateCodeFormControl']).value);
      formData.append("state_name",this.storeForm.get(['stateNameFormControl']).value);

      this.adminService.saveStore(formData).subscribe(
        (data) => {
          this.nbtoastService.success("Store Information saved successfully")
          this.storeForm.reset();
          this.routes.navigate(["/ManageStoreList"]);
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
      formData.append("store_number",this.storeForm.get(['storePhoneNumberFormControl']).value);
      formData.append("email",this.storeForm.get(['storeEmailFormControl']).value);
      formData.append("pin_code",this.storeForm.controls['storePinCodeFormControl'].value);
      formData.append("city",this.storeForm.controls['storeCityFormControl'].value);
      formData.append("gst_no",this.storeForm.controls['gstFormControl'].value);
      formData.append("is_head_office",this.storeForm.get(['mainBranchFormControl']).value);
      formData.append("state_code",this.storeForm.get(['stateCodeFormControl']).value);
      formData.append("state_name",this.storeForm.get(['stateNameFormControl']).value);
      
      this.adminService.updateStore(this.store_id, formData).subscribe(
        (data) => {
          this.nbtoastService.success("Store Information Updated successfully")
          this.storeForm.reset()
          this.routes.navigate(["/ManageStoreList"]);
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
