import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'erp-store';
  routerSubscription: Subscription;

    constructor(private router: Router,private swUpdate: SwUpdate) {
      swUpdate.available.subscribe(event => {
          window.location.reload();
      });
    }
  ngonInit(){

    // this.routerSubscription = this.router.events.filter(event => event instanceof NavigationEnd)
    // .subscribe(event => {
    //     document.body.scrollTop = 0;
    // });

  }
  onActivate(event,outlet){
    outlet.scrollTop = 0;
    document.body.scrollTop = 0;
  }
  ngAfterViewChecked() {
    window.scrollTo(0, 0);
    }

}
