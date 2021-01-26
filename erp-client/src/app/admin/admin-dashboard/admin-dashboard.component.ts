import { Component, OnInit } from '@angular/core';
import {DomSanitizer,SafeResourceUrl,} from '@angular/platform-browser';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  url: any;
  constructor(public sanitizer:DomSanitizer) { }

  ngOnInit(): void {
    // this.url= this.sanitizer.bypassSecurityTrustResourceUrl(environment.BASE_SERVICE_URL + '/admin');
    window.open(environment.BASE_SERVICE_URL + '/admin');

  }

}
