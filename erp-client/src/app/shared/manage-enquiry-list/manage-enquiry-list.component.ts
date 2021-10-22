import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { AdminService } from '../../admin/admin.service';

@Component({
  selector: 'app-manage-enquiry-list',
  templateUrl: './manage-enquiry-list.component.html',
  styleUrls: ['./manage-enquiry-list.component.scss']
})
export class ManageEnquiryListComponent implements OnInit {
  Settings = {
    // selectMode: 'multi',
    actions: {
      add: false,
      edit: false,
      delete: false,      
      },
    columns: {
      id: {
        title: 'id',
        hide:true
      },
      // departme_id: {
      //   title: 'Department Code',        
      //   type: 'html',
      //   valuePrepareFunction: (cell, row) => {
      //     return `<a href="Department?id=${row.id}">${row.department_id}</a>`;
      // }
      // },
      enquiry_code: {
        title: 'Enquiry Code',
        type:'html',
        valuePrepareFunction: (cell, row) => {
          return `<a href="Enquiry?id=${row.id}">${row.enquiry_code}</a>`;
        }
      },
      full_name:{
        title:'Full Name',
      },
      phone_number:{
        title: 'Phone Number',
      },
      service__service_name:{
        title: 'Service Name',
      },
      staff_name__employee_name:{
        title: 'Staff Name',
      },
      enquiry_date:{
        title: 'Enquiry Date',
      },
     
     
    
 
    },
  };

  data = [
  ]

  constructor(
    private formBuilder: FormBuilder,
    private adminservice: AdminService,
    private nbtoastService: NbToastrService,
    private dialogService: NbDialogService,
    private routes: Router,
  ) { }

  ngOnInit(): void {
    this.adminservice.getEnquiryList().subscribe(
      (data) => {
          this.data = data;
          console.log(data)
      },
      (error) => {
          this.nbtoastService.danger(error.error.detail);
      }
    )
  
  }

}
