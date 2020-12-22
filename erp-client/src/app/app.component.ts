import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  store_name;

  ngOnInit(): void {
        this.store_name = localStorage.getItem('store_name');          
  }
}
