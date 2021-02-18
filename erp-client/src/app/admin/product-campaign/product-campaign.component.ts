import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-product-campaign',
  templateUrl: './product-campaign.component.html',
  styleUrls: ['./product-campaign.component.scss']
})
export class ProductCampaignComponent implements OnInit {
  product_campaign_list: [];
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
      code: {
        title: 'Promo Code',        
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          return `<a href="ManageProduct?id=${row.id}">${row.code}</a>`;
}
      },
      start_time: {
        title: 'Start Date',
      },
      end_time: {
        title: 'End Date',
      },
      value: {
        title: 'Amount',
      },
      type: {
        title: 'Promo Code Type',
      },
      min_order_amount: {
        title: 'Min Order Amount ',
      },
      use_count: {
        title: 'Use Count',
      },
      max_use: {
        title: 'Max Use',
      },
    },
  };

  data = [
  ]
  constructor(  private formBuilder: FormBuilder,
                private nbtoastService: NbToastrService,
                private routes: Router,
                private adminService: AdminService,
                private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.adminService.getProductCampaigns().subscribe(
      (data) => {
        this.product_campaign_list = data;
      },
      (error) => {
        
      }
    )
  }

}
