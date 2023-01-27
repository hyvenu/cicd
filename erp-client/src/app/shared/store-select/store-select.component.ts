import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-store-select',
  templateUrl: './store-select.component.html',
  styleUrls: ['./store-select.component.scss']
})
export class StoreSelectComponent implements OnInit {

  stores=[]

  constructor(private sharedService: SharedService ,private router:Router) { }

  ngOnInit(): void {
    this.sharedService.getStoreList().subscribe(
      (data) => {
          this.stores = data;
      },
      (error) => {

      }
    )
  }

  selected_store(store): any {
    localStorage.setItem('store_name',store.store_name);
    localStorage.setItem('store_city',store.city);
    localStorage.setItem('state_code',store.state_code);
    localStorage.setItem('store_id',store.id);
    this.router.navigate(["/"]);


  }

}
