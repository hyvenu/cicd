import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-store-list',
  templateUrl: './store-list.component.html',
  styleUrls: ['./store-list.component.scss']
})
export class StoreListComponent implements OnInit {
  
  store_list = []

  settings = {
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
      store_name: {
        title: 'Store Name',        
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          return `<a href="ManageStore?id=${row.id}">${row.store_name}</a>`;
      }
      },
      address: {
        title: 'Store Address',
      },
      pin_code: {
        title: 'Pin Code',
      },
      
      
    },
  };
  constructor(private formBuilder: FormBuilder,
    private adminService: AdminService,
    private nbtoastService: NbToastrService,
    private routes: Router) { }

  ngOnInit(): void {
    const data = "";
    this.adminService.getStore(data).subscribe(
      (data) => {
          this.store_list = data
      },
      (error) => {
          this.nbtoastService.danger("Unable to get store Info","Error");
      }

    )
  }

}
