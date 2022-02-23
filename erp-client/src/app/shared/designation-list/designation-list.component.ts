import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { SharedService } from '../shared.service';


@Component({
  selector: 'app-designation-list',
  templateUrl: './designation-list.component.html',
  styleUrls: ['./designation-list.component.scss']
})
export class DesignationListComponent implements OnInit {

  data:any = [];
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
      designation_id: {
        title: 'Designation Code',
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          return `<a href="Designation?id=${row.id}">${row.designation_id}</a>`;
      }
      },
      designation_name: {
        title: 'Designation Name',
      }
    },
  };

  constructor(
    private formBuilder: FormBuilder,
    private routes: Router,
    private route: ActivatedRoute,
    private nbtoastService: NbToastrService,
    private dialogService: NbDialogService,
    private sharedService: SharedService,
  ) { }

  ngOnInit(): void {
    this.sharedService.getDesignationList().subscribe(
      (data) => {
        this.data = data;console.log("DATA", data)
        this.activeList = this.data.filter(item => item.active === true);
        this.inActiveList = this.data.filter(item => item.active === false);
      },
      (error) => {
        this.nbtoastService.danger("Unable to get designation List")
      }
    )
  }



}
