import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.scss']
})
export class DepartmentListComponent implements OnInit {

  activeList:any = [];
  inActiveList:any = [];

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
      department_id: {
        title: 'Department Code',
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          return `<a href="Department?id=${row.id}">${row.department_id}</a>`;
        }
      },
      department_name: {
        title: 'Department Name',
      },

    },
  };

  data = [
  ]


  constructor(
    private sharedService: SharedService,
    private nbtoastService: NbToastrService,
    private dialogService: NbDialogService,
    private routes: Router,) { }

  ngOnInit(): void {
    this.sharedService.getDepartmentList().subscribe(
      (data) => {
        this.data = data;
        this.activeList = this.data.filter(item => item.active === true);
        this.inActiveList = this.data.filter(item => item.active === false);
      },
      (error) => {
        this.nbtoastService.danger("Unable to get Deparment List")
      }
    )
  }

}
