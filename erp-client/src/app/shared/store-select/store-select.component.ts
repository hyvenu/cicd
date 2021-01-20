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
    sessionStorage.setItem('store_name',store.store_name);
    sessionStorage.setItem('store_city',store.city);
    sessionStorage.setItem('store_id',store.id);
    this.router.navigate(["/"]);


  }

}
