import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../admin.service';
import { NbToastrService } from '@nebular/theme';
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

  settings = {
    // selectMode: 'multi',
    actions: {
      add: false,
      edit: true,
      delete: false,      
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

  constructor(private formBuilder: FormBuilder,
              private adminService: AdminService,
              private nbtoastService: NbToastrService,
              private routes: Router) {
                  this.store_id = sessionStorage.getItem('store_id')
               }

  ngOnInit(): void {
    this.ServiceFrom  =  this.formBuilder.group({
      ServiceNameFormControl: ['', [Validators.required]],
      ServiceDescFormControl: ['', [Validators.required]],
      ServicePriceFormControl: ['', [Validators.required]],
    });
    this.createFlag = true;
    this.adminService.getServiceList().subscribe(
      (data) => {
          this.services = data;
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
            store : this.store_id,
      }
      this.adminService.saveService(data).subscribe(
        (data) => {
          this.nbtoastService.success("Saved Successfully");
          this.ngOnInit();
        },
        (error) =>{
          this.nbtoastService.danger(error);
        }
      )
    }
    };
    update_Service(): void{

      if( this.ServiceFrom.dirty && this.ServiceFrom.valid){
        let data = {
              service_name: this.ServiceFrom.get(['ServiceNameFormControl']).value,
              service_desc: this.ServiceFrom.get(['ServiceDescFormControl']).value,
              price: this.ServiceFrom.get(['ServicePriceFormControl']).value,
              store : this.store_id,
        }
        this.adminService.updateService(this.Service_id, data).subscribe(
          (data) => {
            this.nbtoastService.success("Saved Successfully");
            this.ngOnInit();
          },
          (error) =>{
            this.nbtoastService.danger(error);
          }
        )
      }
      };

    selected_Service(data): any{
        this.ServiceFrom.controls['ServiceNameFormControl'].setValue(data.service_name);
        this.ServiceFrom.controls['ServiceDescFormControl'].setValue(data.service_desc);
        this.ServiceFrom.controls['ServicePriceFormControl'].setValue(data.price);
        this.createFlag = !this.createFlag;
        this.Service_id = data.id
    }

    delete_Service(Service){
      const data = {
        "id" : Service.Service_id
      }
      this.adminService.removeFromService(data).subscribe(()=>{
        this.refresh();
      })
    }
    refresh(): void {
      window.location.reload();
    }
}