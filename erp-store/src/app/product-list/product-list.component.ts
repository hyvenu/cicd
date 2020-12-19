import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  constructor(private route:Router) { }

  ngOnInit(): void {
  }

  GotoProductview(data:any)
  {
    let routeTo = "productview/"+data;
    this.route.navigate([routeTo]);
  }


}
