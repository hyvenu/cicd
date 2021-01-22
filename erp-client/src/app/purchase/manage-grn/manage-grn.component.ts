import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage-grn',
  templateUrl: './manage-grn.component.html',
  styleUrls: ['./manage-grn.component.scss']
})
export class ManageGrnComponent implements OnInit {

  grnForm: FormGroup;
  isGRNInfo: boolean;
  constructor() {
    this.isGRNInfo = true;
   }

  ngOnInit(): void {
  }

}
