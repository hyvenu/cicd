import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-designation-list',
  templateUrl: './designation-list.component.html',
  styleUrls: ['./designation-list.component.scss']
})
export class DesignationListComponent implements OnInit {
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
      designation_id: {
        title: 'Designation Code',        
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          return `<a href="Designation?id=${row.id}">${row.designation_id}</a>`;
        }
      },
      designation_name: {
        title: 'Designation Name',
      },
    
    },
  };

  data = [
  ]


  constructor(  private sharedService: SharedService,
    private nbtoastService: NbToastrService,
    private dialogService: NbDialogService,
    private routes: Router,) { }

  ngOnInit(): void {
    this.sharedService.getDesignationList().subscribe(
      (data) => {
        this.data = data;
      },
      (error) => {
        this.nbtoastService.danger("Unable to get Deparment List")
      }
    )

  }

}
