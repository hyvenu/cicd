import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../admin.service';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-manage-service',
  templateUrl: './manage-services.component.html',
  styleUrls: ['./manage-services.component.css']
})

export class ManageServiceComponent implements OnInit {

  ServiceFrom: FormGroup;

  services;

  createFlag = true;

  Service_id;

  searchService:any;

  store_id: any;
  searchUnit:any;
  unitData: any;
  dailog_ref: any;
  selected_unit_id: any;

  settings = {
    // selectMode: 'multi',
    actions: {
      add: false,
      edit: true,
      delete: true,
      },
    columns: {
      id: {
        title: 'id',
        hide:true
      },
      service_name: {
        title: 'Service Name',
      },
      service_desc: {
        title: 'Service Description',
      },
      price: {
        title: 'Price',
      },
    }
  }
  submitted: boolean = false;
  pattern = '[0.0-9.0]*'

  constructor(private formBuilder: FormBuilder,
              private adminService: AdminService,
              private nbtoastService: NbToastrService,
              private dialogService: NbDialogService,
              private routes: Router) {
                  this.store_id = sessionStorage.getItem('store_id')
               }

  ngOnInit(): void {
    this.ServiceFrom  =  this.formBuilder.group({
      ServiceNameFormControl: ['', [Validators.required]],
      ServiceDescFormControl: ['', [Validators.required]],
      ServicePriceFormControl: ['', [Validators.required,Validators.pattern(this.pattern)]],
      gstFormControl: ['', [Validators.required]],
      serviceHourFormControl:['',[Validators.required]],
      unitFormControl:['',[Validators.required]]
    });

    this.createFlag = true;

    this.get_service_list();

    this.get_unit_list();



  }

  get_service_list() {
    this.adminService.getServiceList().subscribe(
      (data) => {
          this.services = data;
      },
      (error) => {
          this.nbtoastService.danger(error,"Error")
      }
    )
  }

  get_unit_list() {
    this.adminService.getUnitList().subscribe(
      (data) => {
          this.unitData = data;
          console.log(this.unitData)
      },
      (error) => {
          this.nbtoastService.danger(error,"Error")
      }
    )
  }

  save_Service(): void{

    if( this.ServiceFrom.dirty && this.ServiceFrom.valid){
      let data = {
            service_name: this.ServiceFrom.get(['ServiceNameFormControl']).value,
            service_desc: this.ServiceFrom.get(['ServiceDescFormControl']).value,
            price: this.ServiceFrom.get(['ServicePriceFormControl']).value,
            service_gst: this.ServiceFrom.get(['gstFormControl']).value,
            service_hour:this.ServiceFrom.get(['serviceHourFormControl']).value,
            unit: this.selected_unit_id,
            store : this.store_id,
      }
      this.adminService.saveService(data).subscribe(
        (data) => {
          this.nbtoastService.success("Saved Successfully");
          this.get_service_list();
        },
        (error) =>{
          console.log(error)
          if(error === "exist"){
            this.nbtoastService.danger("Service Name already"+" "+error);
            }
            else{
              this.nbtoastService.danger(error);
            }
        }
      )
    }
    };
    update_Service(): void{
try{
      //if( this.ServiceFrom.dirty && this.ServiceFrom.valid){
        if(this.ServiceFrom.valid){
        let pdata = {
              service_id: this.Service_id,
              service_name: this.ServiceFrom.get(['ServiceNameFormControl']).value,
              service_desc: this.ServiceFrom.get(['ServiceDescFormControl']).value,
              price: this.ServiceFrom.get(['ServicePriceFormControl']).value,
              service_gst: this.ServiceFrom.get(['gstFormControl']).value,
              service_hour:this.ServiceFrom.get(['serviceHourFormControl']).value,
              unit: this.selected_unit_id
        }
        this.adminService.updateService(pdata).subscribe(
          (data) => {
            this.nbtoastService.success("Service Updated Successfully");
            this.get_service_list();
          },
          (error) =>{
            this.nbtoastService.danger(error);
          }
        )
      }
    }catch(e) {
      console.log("Catch:"+e)
    }
    }

    selected_Service(data): any{
        this.ServiceFrom.controls['ServiceNameFormControl'].setValue(data.service_name);
        this.ServiceFrom.controls['ServiceDescFormControl'].setValue(data.service_desc);
        this.ServiceFrom.controls['ServicePriceFormControl'].setValue(data.price);
        this.ServiceFrom.controls['gstFormControl'].setValue(data.service_gst);
        this.ServiceFrom.controls['serviceHourFormControl'].setValue(data.service_hour);
        this.ServiceFrom.controls['unitFormControl'].setValue(data.unit__PrimaryUnit +" - "+data.unit__SecondaryUnit);
        this.createFlag = false;
        this.Service_id = data.id;
        this.selected_unit_id = data.unit__id;
    }

    delete_Service(service_id){
      this.adminService.removeOneService(service_id).subscribe(()=>{
        this.get_service_list();
        this.ServiceFrom.reset();
        this.createFlag = true;
        //this.refresh();
      })
    }

    delete_all_service(){
      this.adminService.removeAllService().subscribe(()=>{
        this.get_service_list();
        this.ServiceFrom.reset();
        this.createFlag = true;
        //this.refresh();
      })
    }

    refresh(): void {
      window.location.reload();
    }

    get f() { return this.ServiceFrom.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.ServiceFrom.invalid) {
            return;
        }
        if (!this.ServiceFrom.invalid){
          return this.submitted = false;
        }
      }

      open_unit_list(dialog: TemplateRef<any>) {
        this.dailog_ref= this.dialogService.open(dialog, { context: this.unitData })
        .onClose.subscribe(data => {
           this.selected_unit_id = data.id;
           this.ServiceFrom.controls['unitFormControl'].setValue(data.PrimaryUnit +" - "+data.SecondaryUnit);


        }
        );
      }
}
