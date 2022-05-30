import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { PurchaseService } from '../purchase.service';
import { NbSelectModule } from '@nebular/theme';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef, TemplateRef } from '@angular/core';
import { Router,NavigationEnd } from '@angular/router';
import { State } from 'src/app/models/state';


@Component({
  selector: 'app-manage-vendor',
  templateUrl: './manage-vendor.component.html',
  styleUrls: ['./manage-vendor.component.scss']
})
export class ManageVendorComponent implements OnInit {





  vendorMasterForm: FormGroup;
  vendor_code: any;
  vendor_name: any;
  vendor_type: any;
  vendorTypeStr: any;
  paymentTermsStr: any;
  vendor_id:any;
  searchState;

  IsVendorInfo: boolean;
  options = [

    { value: "FARMER", name: 'FARMER' },
    { value: "WHOLESELLER", name: 'WHOLESELLER' },

  ];
  selectedOption;

  paymentTermsOption = [
    { value: "PAYMENT_TERMS_1", name: '10% advance &90% after Receipt of materials' },
    { value: "PAYMENT_TERMS_2", name: '100% against material receipt' },
    { value: "PAYMENT_TERMS_3", name: 'Wholesale credit for 30 days of material receiptller' },
  ]
  paymentTermsSelected;

  creditDaysOption = [
    { value: '30', name: '30' },
    { value: '40', name: '45' },
    { value: '90', name: '90' },
    { value: '120', name: '120' },
  ]
  creditDaysSelected;

  approvedTransporterOption =  [
    { value: 'APPROVED_TRANSPORTER_1', name: 'Self' },
    { value: 'APPROVED_TRANSPORTER_2', name: 'vendor scope/ third party' },
  ]
  approvedTransporterSelected;


  tdsApplicableOption = [
    {value:'NO', name:'No'},
    {value:'YES', name:'Yes'},
  ]
  tdsApplicableSelected;

  accountTypeOption = [
    {value:'ACCOUNT_TYPE_1', name:'Company'},
    {value:'ACCOUNT_TYPE_2', name:'Firm'},
    {value:'ACCOUNT_TYPE_3', name:'Individual'},
  ]
  accountTypeSelected;

  dedcuteeTypeOption =[
    {value:'DEDUCTEE_TYPE_1', name:'Commission'},
    {value:'DEDUCTEE_TYPE_2', name:'Professional'},
    {value:'DEDUCTEE_TYPE_3', name:'Rent'},
    {value:'DEDUCTEE_TYPE_4', name:'Sub-Contract'},
  ]

  dedcuteeTypeSelected;

  panDoc = [];
  adharDoc = [];
  gstDoc = [];
  imgSrcPan: string;
  imgSrcGst: string;
  imgSrcadhar:string;
  submitted: boolean=false;
  selectionModel:any;
  dailog_ref: any;
  state: State[]=[];
  state_list: any;
  states: string;
  state_name;
  FileName1:String;
  FileName2:String;
  FileName3:String;
  GstDocFileExist:boolean=false;
  AdharFileExist:boolean=false;
  PanFileExist:boolean=false;
  // GstDocFileExist:boolean=false;

  constructor(private formBuilder: FormBuilder,
    private purchaseService: PurchaseService,
    private nbtoastService: NbToastrService,
    private dialogService: NbDialogService,
    private routes: Router,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,) {
      // this.selectedOption = this.options[1];
      // this.paymentTermsSelected = this.paymentTermsOption[0];
      // this.creditDaysSelected = this.creditDaysOption[0];

     }

     onVendorTypeChange(event) {
       this.getVendorCode();
     }
     getVendorCode():void {
      try{
        if (!this.vendor_id){
          if (this.vendorMasterForm.controls['vendorTypeFormControl'].value === "SUPPLIER")
          {
            const data =
            {
              vendor_type: "SUPPLIER",
            }



            this.purchaseService.getVendorCode(data).subscribe(
              (data) =>{
                this.vendorMasterForm.controls['vendorCodeFormControl'].setValue(data)
              },
              (error) => {
                this.nbtoastService.danger('Error while getting product code');
              }
              )

             }
            else if(this.vendorMasterForm.controls['vendorTypeFormControl'].value === "WHOLESELLER")
            {
              const data = {
                vendor_type: "WHOLESELLER",
              }
              this.purchaseService.getVendorCode(data).subscribe(
                (data) =>{
                  this.vendorMasterForm.controls['vendorCodeFormControl'].setValue(data)
                },
                (error) => {
                  this.nbtoastService.danger('Error while getting product code');
                }
                )
              }
              else
              {
                const data = {
                  vendor_type: "FARMER",
                }
                this.purchaseService.getVendorCode(data).subscribe(
                  (data) =>{
                    this.vendorMasterForm.controls['vendorCodeFormControl'].setValue(data)
                  },
                  (error) => {
                    this.nbtoastService.danger('Error while getting product code');
                  }
                  )
                }

             }

            }catch(e){
        console.log(e);
    }
    };


  ngOnInit(): void {


    this.IsVendorInfo = true;
    this.vendorMasterForm  =  this.formBuilder.group({
      // vendorStateCodeFormControl: ['', [Validators.required]],
      vendorStateNameFormControl: ['', [Validators.required]],
      vendorStateCodeFormControl: ['', [Validators.required]],
      corporateOfficeFormControl: ['', []],
      branchOfficeFormControl: ['', []],
      vendorTypeFormControl:['', [Validators.required]],
      vendorRegionFormControl: ['', [Validators.required]],
      vendoremailId:['',[]],
      postalCode: ['', [Validators.required,Validators.pattern('^[0-9]{6}$')]],
      vendorCodeFormControl:['',[]],
      vendorNameFormControl:['', [Validators.required]],
      vendorAadharNo:['',[]],
     imageVendorPanNo:['',[]],
      vendorGSTNo:['',[]],
     vendorPOCName:['',[]],
      vendorDesignation:['',[]],
      vendorMobileNo:['',[Validators.required,Validators.pattern('^[0-9]{10}$')]],
      // vendorMobileNo:['',[]],
      MobileNo:['',[Validators.pattern('^[0-9]{10}$')]],
      vendorPanNo:['',[Validators.minLength(10)]],
      emailId:['',[Validators.email,]],
      pcEmailId:['',[Validators.email,]],
     vendorLandLine:['',[Validators.pattern('^[0-9]{6}$')]],
      paymentTermsFormControl:['',[]],
      alternative:['',[]],
      creditDaysFormControl:['',[]],
      tdsApplicableFormControl:['',[]],
      approvedTransporterFormControl:['',[]],
      accountTypeFormControl:['',[]],
      dedcuteeTypeFormControl:['',[]],
      ifscCodeFormControl:['',[]],
      bankNameFormControl:['',[]],
      accountNumberFormControl:['',[]],
      micrCodeFormControl:['',[]],
      beneficiaryNameFormControl:['',[]],
      imageVendorGSTNo:['',[]],
      imageVendoradharNo:['',[]],

      // vendorDesignation:['',[Validators.required]],
      // vendorDesignation:['',[Validators.required]],
      // vendorDesignation:['',[Validators.required]],
      // vendorDesignation:['',[Validators.required]],

    });



    let param1 = this.route.snapshot.queryParams["id"];

    if (param1) {
      this.purchaseService.getVendor(param1).subscribe(
        (data) => {
          console.log("data ", data)
          this.vendor_id = data.id;
          this.vendorMasterForm.controls['vendorCodeFormControl'].setValue(data.vendor_code);
          this.vendorMasterForm.controls['vendorNameFormControl'].setValue(data.vendor_name);
          this.vendorMasterForm.controls['vendorTypeFormControl'].setValue(data.vendor_type);
          this.vendorMasterForm.controls['vendorStateCodeFormControl'].setValue(data.state_code);
          this.vendorMasterForm.controls['vendorStateNameFormControl'].setValue(data.state_name);
          this.vendorMasterForm.controls['vendorRegionFormControl'].setValue(data.region);
          this.vendorMasterForm.controls['emailId'].setValue(data.vendor_email);
          this.vendorMasterForm.controls['corporateOfficeFormControl'].setValue(data.corp_ofc_addr);
          this.vendorMasterForm.controls['branchOfficeFormControl'].setValue(data.branch_ofc_addr);
          this.vendorMasterForm.controls['postalCode'].setValue(data.postal_code);
          this.vendorMasterForm.controls['vendorPanNo'].setValue(data.pan_no);
          this.vendorMasterForm.controls['imageVendorPanNo'].setValue(data.panDoc);
          this.vendorMasterForm.controls['vendorAadharNo'].setValue(data.aadhar_no);
          this.vendorMasterForm.controls['vendorGSTNo'].setValue(data.gst_no);
          this.vendorMasterForm.controls['imageVendorGSTNo'].setValue(data.gstDoc);
          this.vendorMasterForm.controls['vendorPOCName'].setValue(data.poc_name);
          this.vendorMasterForm.controls['vendorDesignation'].setValue(data.designation);
          this.vendorMasterForm.controls['vendorMobileNo'].setValue(data.mobile_no);
          this.vendorMasterForm.controls['MobileNo'].setValue(data.mobile_num);
          this.vendorMasterForm.controls['vendorLandLine'].setValue(data.land_line_no);
          this.vendorMasterForm.controls['pcEmailId'].setValue(data.email_id);
          this.state_name = data.state_name
          this.vendorMasterForm.controls['alternative'].setValue(data.alternative);
          this.vendorMasterForm.controls['paymentTermsFormControl'].setValue(data.payment_terms);
          this.vendorMasterForm.controls['creditDaysFormControl'].setValue(data.credit_days);
          this.vendorMasterForm.controls['approvedTransporterFormControl'].setValue(data.approved_transporter);
          this.vendorMasterForm.controls['tdsApplicableFormControl'].setValue(data.tds_applicable);
          this.vendorMasterForm.controls['accountTypeFormControl'].setValue(data.account_type);
          this.vendorMasterForm.controls['dedcuteeTypeFormControl'].setValue(data.dedcutee_type);

          this.vendorMasterForm.controls['bankNameFormControl'].setValue(data.bank_name);
          this.vendorMasterForm.controls['ifscCodeFormControl'].setValue(data.ifsc_code);
          this.vendorMasterForm.controls['micrCodeFormControl'].setValue(data.micr_code);
          this.vendorMasterForm.controls['accountNumberFormControl'].setValue(data.account_no);
          this.vendorMasterForm.controls['beneficiaryNameFormControl'].setValue(data.beneficiary_name);


          if (data.gst_doc == null || data.gst_doc == ""){
            this.imgSrcGst ="";
          }
          else
          {
            let namePath = data.gst_doc
            this.FileName1 = namePath.slice(51, namePath.length);
            // console.log("this is die maker file path", namePath)
            console.log("this is name of file", this.FileName1)
            this.imgSrcGst =  data.gst_doc
            console.log("loaded file",this.imgSrcGst)
            this.GstDocFileExist=true;
          }

          if (data.adhar_doc == null || data.adhar_doc == ""){
            this.imgSrcadhar ="";

          }
          else
          {
            let namePath = data.adhar_doc
            this.FileName2 = namePath.slice(53, namePath.length);
            // console.log("this is die maker file path", namePath)
            console.log("this is name of file", this.FileName2)
            this.imgSrcadhar =  data.adhar_doc
            console.log("loaded file",this.imgSrcadhar)
            this.AdharFileExist=true;
          }


          if (data.pan_doc == null || data.pan_doc == ""){
            this.imgSrcPan ="";

          }
          else
          {
            let namePath = data.pan_doc
            this.FileName3 = namePath.slice(51, namePath.length);
            // console.log("this is die maker file path", namePath)
            console.log("this is name of file", this.FileName3)
            this.imgSrcPan = data.pan_doc
            console.log("loaded file",this.imgSrcPan)
            this.PanFileExist=true;
          }


          });
        }
        // this.onChange()
      this.state = this.purchaseService.getSate()




  }

  state_open(dialog: TemplateRef<any>) {
    this.dailog_ref = this.dialogService.open(dialog, { context: this.state})
      .onClose.subscribe(data => {
        this.searchState = ""
        console.log(data)
        this.state_list = data
        console.log(this.state_list)
        this.state_name = data.name
        this.vendorMasterForm.controls['vendorStateCodeFormControl'].setValue(data.value);
        this.vendorMasterForm.controls['vendorStateNameFormControl'].setValue(data.name);



      }
      );
  }


  onChange(){
  //   this.stateCode = this.selectionModel.value;
  //   For one Result use find method

  //    this.showRate=this.rateData.find((o)=>o.name == this.selectionModel.name));

  //   For more Result use filter method
  //    this.showRate=this.rateData.filter((o)=>o.name == this.selectionModel.name))
  //  let d=this.customerForm.get(['stateNameFormControl']).value;
  //   console.log(this.stateCode);
  //   console.log(d)/* ; */

    this.vendorMasterForm.get('vendorStateCodeFormControl').valueChanges.subscribe(
      tt=>{
        if(tt){
          let searchInState=this.state.filter(s=>s.name===tt)[0];
          this.vendorMasterForm.get(['vendorStateCodeFormControl']).setValue(searchInState.value);
        }


      });

  }



  change_tab() {
    if(this.vendorMasterForm.valid) {
      this.IsVendorInfo = !this.IsVendorInfo;
    }
  }
  onFileChangePan(event, field) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      // just checking if it is an image, ignore if you want
      for(let i=0 ; i < event.target.files.length ;i++){
        this.panDoc.push(<File>event.target.files[i]);
      }
      reader.readAsDataURL(file);
      reader.onload = () => {

        this.imgSrcPan = reader.result as string;

        this.vendorMasterForm.patchValue({
          fileSource: reader.result
        });

      };

    }
  }

  onFileChangeadhar(event, field) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      // just checking if it is an image, ignore if you want
      for(let i=0 ; i < event.target.files.length ;i++){
        this.adharDoc.push(<File>event.target.files[i]);
      }
      reader.readAsDataURL(file);
      reader.onload = () => {

        this.imgSrcadhar = reader.result as string;

        this.vendorMasterForm.patchValue({
          fileSource: reader.result
        });

      };

    }
  }

  onFileChangeGst(event, field) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      // just checking if it is an image, ignore if you want
      for(let i=0 ; i < event.target.files.length ;i++){
        this.gstDoc.push(<File>event.target.files[i]);
      }
      reader.readAsDataURL(file);
      reader.onload = () => {

        this.imgSrcGst = reader.result as string;

        this.vendorMasterForm.patchValue({
          fileSource: reader.result
        });

      };

    }
  }

  saveProduct():any {
    if(this.vendorMasterForm.valid){
    const formData = new FormData();
    if (this.vendor_id){
      formData.append('id', this.vendor_id)
    }

    formData.append('vendor_code', this.vendorMasterForm.controls['vendorCodeFormControl'].value)
    formData.append('vendor_name', this.vendorMasterForm.controls['vendorNameFormControl'].value)
    if (this.vendorMasterForm.controls['vendorTypeFormControl'].value === "SUPPLIER") {
      this.vendorTypeStr = "SUPPLIER"
    }
    if (this.vendorMasterForm.controls['vendorTypeFormControl'].value === "WHOLESELLER"){
      this.vendorTypeStr = "WHOLESELLER"
    }
    if (this.vendorMasterForm.controls['vendorTypeFormControl'].value === "FARMER"){
      this.vendorTypeStr = "FARMER"
    }

    formData.append('vendor_type', this.vendorTypeStr)
    formData.append('state_code', this.vendorMasterForm.controls['vendorStateCodeFormControl'].value)
    formData.append('state_name', this.state_name)
    formData.append('region', this.vendorMasterForm.controls['vendorRegionFormControl'].value)
    formData.append('vendor_email', this.vendorMasterForm.controls['emailId'].value)

    formData.append('corp_ofc_addr', this.vendorMasterForm.controls['corporateOfficeFormControl'].value)
    formData.append('branch_ofc_addr', this.vendorMasterForm.controls['branchOfficeFormControl'].value)
    formData.append('postal_code', this.vendorMasterForm.controls['postalCode'].value)
    formData.append('pan_no', this.vendorMasterForm.controls['vendorPanNo'].value)
    formData.append('aadhar_no', this.vendorMasterForm.controls['vendorAadharNo'].value)
    formData.append('gst_no', this.vendorMasterForm.controls['vendorGSTNo'].value)
    formData.append('poc_name', this.vendorMasterForm.controls['vendorPOCName'].value)
    formData.append('designation', this.vendorMasterForm.controls['vendorDesignation'].value)
    formData.append('mobile_no', this.vendorMasterForm.controls['vendorMobileNo'].value)
    formData.append('mobile_num', this.vendorMasterForm.controls['MobileNo'].value)
    formData.append('land_line_no', this.vendorMasterForm.controls['vendorLandLine'].value)
    formData.append('email_id', this.vendorMasterForm.controls['pcEmailId'].value)
    formData.append('alternative', this.vendorMasterForm.controls['alternative'].value)
    formData.append('bank_name', this.vendorMasterForm.controls['bankNameFormControl'].value)
    formData.append('ifsc_code', this.vendorMasterForm.controls['ifscCodeFormControl'].value)
    formData.append('micr_code', this.vendorMasterForm.controls['micrCodeFormControl'].value)
    formData.append('account_no', this.vendorMasterForm.controls['accountNumberFormControl'].value)
    formData.append('beneficiary_name', this.vendorMasterForm.controls['beneficiaryNameFormControl'].value)

    formData.append('payment_terms', this.vendorMasterForm.controls['paymentTermsFormControl'].value)
    formData.append('credit_days', this.vendorMasterForm.controls['creditDaysFormControl'].value)
    formData.append('approved_transporter', this.vendorMasterForm.controls['approvedTransporterFormControl'].value)
    formData.append('tds_applicable', this.vendorMasterForm.controls['tdsApplicableFormControl'].value)
    formData.append('account_type', this.vendorMasterForm.controls['accountTypeFormControl'].value)
    formData.append('dedcutee_type', this.vendorMasterForm.controls['dedcuteeTypeFormControl'].value)

    if(this.panDoc.length){
      for(let i=0 ; i < this.panDoc.length ; i++)
        formData.append('panDoc[]', this.panDoc[i],this.panDoc[i].name);
    }
    if(this.adharDoc.length){
      for(let i=0 ; i < this.adharDoc.length ; i++)
        formData.append('adharDoc[]', this.adharDoc[i],this.adharDoc[i].name);
    }

    if(this.gstDoc.length){
      for(let i=0 ; i < this.gstDoc.length ; i++)
        formData.append('gstDoc[]', this.gstDoc[i],this.gstDoc[i].name);
    }


  this.purchaseService.saveVendor(formData).subscribe(
    (data) => {
      if(this.vendor_id){
        this.nbtoastService.success("Vendor Details Updated Successfully")
      }
      else{
      this.nbtoastService.success("Vendor Details Saved Successfully")
      }
      this.ngOnInit();
      this.routes.navigate(['/ManageVendortMaster'])
    },
    (error) =>{
      this.nbtoastService.danger(error.error.detail);
    }
  )
}
  }

get f() { return this.vendorMasterForm.controls; }

onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.vendorMasterForm.invalid) {
        return;
    }
    if (!this.vendorMasterForm.invalid){
      return this.submitted = false;
    }



}

}
