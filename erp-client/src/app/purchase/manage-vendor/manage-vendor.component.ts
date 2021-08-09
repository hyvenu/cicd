import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { PurchaseService } from '../purchase.service';
import { NbSelectModule } from '@nebular/theme';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef, TemplateRef } from '@angular/core';
import { Router,NavigationEnd } from '@angular/router';


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
  

  IsVendorInfo: boolean;
  options = [
    { value: "SUPPLIER", name: 'SUPPLIER' },
   
  ];
  selectedOption;

  paymentTermsOption = [
    { value: "PAYMENT_TERMS_1", name: '10% advance &90% after Receipt of materials' },
    { value: "PAYMENT_TERMS_2", name: '100% against material receipt' },
    { value: "PAYMENT_TERMS_3", name: 'Wholesecredit for 30 days of material receiptller' },
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
    { value: 'APPROVED_TRANSPORTER_1', name: 'saffran scope' },
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
  gstDoc = [];
  imgSrcPan: string;
  imgSrcGst: string;
  submitted: boolean=false;

  constructor(private formBuilder: FormBuilder,
    private purchaseService: PurchaseService,
    private nbtoastService: NbToastrService,
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
          if (this.vendorMasterForm.controls['vendorTypeFormControl'].value === "SUPPLIER") {
            const data = {
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
            // else {
            //   const data = {
            //     vendor_type: "WHOLESELLER",
            //   }
            //   this.purchaseService.getVendorCode(data).subscribe(
            //     (data) =>{
            //       this.vendorMasterForm.controls['vendorCodeFormControl'].setValue(data)
            //     },
            //     (error) => {
            //       this.nbtoastService.danger('Error while getting product code');
            //     }
            //     )
            //   }
              
             }  
              
            }catch(e){
        console.log(e);
    }
    };
  

  ngOnInit(): void {
    this.IsVendorInfo = true;
    this.vendorMasterForm  =  this.formBuilder.group({
      // vendorStateCodeFormControl: ['', [Validators.required]],
      // vendorStateNameFormControl: ['', [Validators.required]],      
      vendorStateCodeFormControl: ['', [Validators.required]],   
      // corporateOfficeFormControl: ['', [Validators.required]],   
      branchOfficeFormControl: ['', [Validators.required]],
      vendorTypeFormControl:['', [Validators.required]],   
      //vendorRegionFormControl: ['', [Validators.required]],
      // postalCode: ['', [Validators.required]],
      vendorCodeFormControl:['', [Validators.required]],
      vendorNameFormControl:['', [Validators.required]],
      //vendorAadharNo:['',[Validators.required]],
 //     imageVendorPanNo:['',[Validators.required]],
      vendorGSTNo:['',[Validators.minLength(15)]],
     // vendorPOCName:['',[Validators.required]],
      //vendorDesignation:['',[Validators.required]],
      vendorMobileNo:['',[Validators.pattern('^[0-9]{10}$')]],
      //vendorPanNo:['',[Validators.required]],
      emailId:['',[Validators.email]],
     // vendorLandLine:['',[Validators.required]],
      //paymentTermsFormControl:['',[Validators.required]],
      //alternative:['',[Validators.required]],
      //creditDaysFormControl:['',[Validators.required]],
      //tdsApplicableFormControl:['',[Validators.required]],
      //approvedTransporterFormControl:['',[Validators.required]],
      //accountTypeFormControl:['',[Validators.required]],
      //dedcuteeTypeFormControl:['',[Validators.required]],
      //ifscCodeFormControl:['',[Validators.required]],
      //bankNameFormControl:['',[Validators.required]],
      //accountNumberFormControl:['',[Validators.required]],
      //micrCodeFormControl:['',[Validators.required]],
      //beneficiaryNameFormControl:['',[Validators.required]],
      //imageVendorGSTNo:['',[Validators.required]],

      // vendorDesignation:['',[Validators.required]],
      // vendorDesignation:['',[Validators.required]],
      // vendorDesignation:['',[Validators.required]],
      // vendorDesignation:['',[Validators.required]],
      //
    });

    let param1 = this.route.snapshot.queryParams["id"];

    if (param1) {
      this.purchaseService.getVendor(param1).subscribe(
        (data) => {
          this.vendor_id = data.id;
          this.vendorMasterForm.controls['vendorCodeFormControl'].setValue(data.vendor_code);
          this.vendorMasterForm.controls['vendorNameFormControl'].setValue(data.vendor_name);
          this.vendorMasterForm.controls['vendorTypeFormControl'].setValue(data.vendor_type);
          // this.vendorMasterForm.controls['vendorStateCodeFormControl'].setValue(data.state_code);
          // this.vendorMasterForm.controls['vendorStateNameFormControl'].setValue(data.state_name);
          // this.vendorMasterForm.controls['vendorRegionFormControl'].setValue(data.region);
          // this.vendorMasterForm.controls['corporateOfficeFormControl'].setValue(data.corp_ofc_addr);
          this.vendorMasterForm.controls['branchOfficeFormControl'].setValue(data.branch_ofc_addr);
          // this.vendorMasterForm.controls['postalCode'].setValue(data.postal_code);
          // this.vendorMasterForm.controls['vendorPanNo'].setValue(data.pan_no);
          // this.vendorMasterForm.controls['imageVendorPanNo'].setValue(data.panDoc);
          // this.vendorMasterForm.controls['vendorAadharNo'].setValue(data.aadhar_no);
          this.vendorMasterForm.controls['vendorGSTNo'].setValue(data.gst_no);
          // this.vendorMasterForm.controls['imageVendorGSTNo'].setValue(data.gstDoc);
          // this.vendorMasterForm.controls['vendorPOCName'].setValue(data.poc_name);
          // this.vendorMasterForm.controls['vendorDesignation'].setValue(data.designation);
          this.vendorMasterForm.controls['vendorMobileNo'].setValue(data.mobile_no);
          // this.vendorMasterForm.controls['vendorLandLine'].setValue(data.land_line_no);
          this.vendorMasterForm.controls['emailId'].setValue(data.email_id);
          // this.vendorMasterForm.controls['alternative'].setValue(data.alternative);
          // this.vendorMasterForm.controls['paymentTermsFormControl'].setValue(data.payment_terms);
          // this.vendorMasterForm.controls['creditDaysFormControl'].setValue(data.credit_days);
          // this.vendorMasterForm.controls['approvedTransporterFormControl'].setValue(data.approved_transporter);
          // this.vendorMasterForm.controls['tdsApplicableFormControl'].setValue(data.tds_applicable);
          // this.vendorMasterForm.controls['accountTypeFormControl'].setValue(data.account_type);
          // this.vendorMasterForm.controls['dedcuteeTypeFormControl'].setValue(data.dedcutee_type);

          // this.vendorMasterForm.controls['bankNameFormControl'].setValue(data.bank_name);
          // this.vendorMasterForm.controls['ifscCodeFormControl'].setValue(data.ifsc_code);
          // this.vendorMasterForm.controls['micrCodeFormControl'].setValue(data.micr_code);
          // this.vendorMasterForm.controls['accountNumberFormControl'].setValue(data.account_no);
          // this.vendorMasterForm.controls['beneficiaryNameFormControl'].setValue(data.beneficiary_name);

          });
        }
      
    
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
    // else {
    //   this.vendorTypeStr = "WHOLESELLER"
    // }

    formData.append('vendor_type', this.vendorTypeStr)
    formData.append('state_code', this.vendorMasterForm.controls['vendorStateCodeFormControl'].value)
    // formData.append('state_name', this.vendorMasterForm.controls['vendorStateNameFormControl'].value)
    // formData.append('region', this.vendorMasterForm.controls['vendorRegionFormControl'].value)
    
    // formData.append('corp_ofc_addr', this.vendorMasterForm.controls['corporateOfficeFormControl'].value)
    formData.append('branch_ofc_addr', this.vendorMasterForm.controls['branchOfficeFormControl'].value)
    // formData.append('postal_code', this.vendorMasterForm.controls['postalCode'].value)
    // formData.append('pan_no', this.vendorMasterForm.controls['vendorPanNo'].value)
    // formData.append('aadhar_no', this.vendorMasterForm.controls['vendorAadharNo'].value)
    formData.append('gst_no', this.vendorMasterForm.controls['vendorGSTNo'].value)
    // formData.append('poc_name', this.vendorMasterForm.controls['vendorPOCName'].value)
    // formData.append('designation', this.vendorMasterForm.controls['vendorDesignation'].value)
    formData.append('mobile_no', this.vendorMasterForm.controls['vendorMobileNo'].value)
    // formData.append('land_line_no', this.vendorMasterForm.controls['vendorLandLine'].value)
    formData.append('email_id', this.vendorMasterForm.controls['emailId'].value)
    // formData.append('alternative', this.vendorMasterForm.controls['alternative'].value)
    // formData.append('bank_name', this.vendorMasterForm.controls['bankNameFormControl'].value)
    // formData.append('ifsc_code', this.vendorMasterForm.controls['ifscCodeFormControl'].value)
    // formData.append('micr_code', this.vendorMasterForm.controls['micrCodeFormControl'].value)
    // formData.append('account_no', this.vendorMasterForm.controls['accountNumberFormControl'].value)
    // formData.append('beneficiary_name', this.vendorMasterForm.controls['beneficiaryNameFormControl'].value)

    // formData.append('payment_terms', this.vendorMasterForm.controls['paymentTermsFormControl'].value)
    // formData.append('credit_days', this.vendorMasterForm.controls['creditDaysFormControl'].value)
    // formData.append('approved_transporter', this.vendorMasterForm.controls['approvedTransporterFormControl'].value)
    // formData.append('tds_applicable', this.vendorMasterForm.controls['tdsApplicableFormControl'].value)
    // formData.append('account_type', this.vendorMasterForm.controls['accountTypeFormControl'].value)
    // formData.append('dedcutee_type', this.vendorMasterForm.controls['dedcuteeTypeFormControl'].value)

    // if(this.panDoc.length){
    //   for(let i=0 ; i < this.panDoc.length ; i++)
    //     formData.append('panDoc[]', this.panDoc[i],this.panDoc[i].name);
    // }

    // if(this.gstDoc.length){
    //   for(let i=0 ; i < this.gstDoc.length ; i++)
    //     formData.append('gstDoc[]', this.gstDoc[i],this.gstDoc[i].name);
    // }


  this.purchaseService.saveVendor(formData).subscribe(
    (data) => {
      this.nbtoastService.success("Vendor Details Saved Successfully")
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

