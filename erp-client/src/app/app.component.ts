import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  store_name;

  ngOnInit(): void {
        this.store_name = sessionStorage.getItem('store_name');          
  }

  checkLogin():any {
    if(sessionStorage.getItem('user_id')){
      return true;
    }else{
      return false;
    }
  }
}
