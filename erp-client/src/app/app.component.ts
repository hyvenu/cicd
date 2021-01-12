import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  store_name;

  items: NbMenuItem[] = [
      {
       title: 'Dashboard',
       link: '/'
      },
      {
      title: 'Manage Store',
      expanded: false,
      children: [
        {
          title: 'Store',
          link: '', // goes into angular `routerLink`
        },]

      },
      {
        title: 'Manage Inventory',
        expanded: false,
        children: [
          {
            title: 'Category',
            link: 'ManageCategory', // goes into angular `routerLink`
          },
          {
            title: 'Sub Category',
            link: 'ManageSubCategory', // goes into angular `routerLink`
          },
          {
            title: 'Brand',
            link: 'ManageBrandMaster', // goes into angular `routerLink`
          },
          {
            title: 'Unit',
            link: 'ManageUnitMaster', // goes into angular `routerLink`
          },
          {
            title: 'Product Master',
            link: 'ManageProductMaster', // goes into angular `routerLink`
          },
         
        ]
  
        },
        {
          title: 'Manage Purchase',
          expanded: false,
          children: [
            {
              title: 'Vendor Master',
              link: 'ManageVendortMaster', // goes into angular `routerLink`
            },
          ]

          
        },
        {
          title: 'Manage Sales',
          expanded: false,
          children: [
            {
              title: 'Orders',
              link: 'OrderList', // goes into angular `routerLink`
            },
          ]
        }
       
      ]

  ngOnInit(): void {
        this.store_name = sessionStorage.getItem('store_name');          
  }

  checkLogin():any {
    if(sessionStorage.getItem('user_id') && sessionStorage.getItem('store_id')){
      return true;
    }else{
      return false;
    }
  }
}
