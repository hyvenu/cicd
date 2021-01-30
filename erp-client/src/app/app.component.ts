import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';
import { SharedService } from './shared/shared.service';
import { environment } from '../environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  store_name;
  has_permission = false;
  constructor(private permissionsService: NgxPermissionsService,private roleService:NgxRolesService, private sharedService: SharedService){
    
  }
  items: NbMenuItem[]; 

  ngOnInit(): void {
        this.store_name = sessionStorage.getItem('store_name');      
        this.sharedService.getUserPermissionList().subscribe(
        (data) =>{
           this.permissionsService.loadPermissions(data);
           this.roleService.addRoles(data);
           this.create_menu();
           
        },
        (error) =>{
           console.log("Unable to load permissions");
        }
        )
       
  }

  checkLogin():any {
    if(sessionStorage.getItem('user_id') && sessionStorage.getItem('store_id')){
      return true;
    }else{
      return false;
    }
  }
  // has_permission(perm): any{
  //   let data = this.permissionsService.hasPermission(perm) .then((value:boolean)=>{console.log(value); return value})
  //   return data
  // }
  create_menu (): any {
    this.items = [
      {
       title: 'Dashboard',
       link: '/'
      },
      {
      title: 'Admin',
      expanded: false,
      children: [
        {
          title: 'Store',
          link: 'ManageStoreList', // goes into angular `routerLink`,
          hidden: !Boolean(this.permissionsService.hasPermission('store.view_store') .then((value:boolean)=>{console.log(value); return value}))
        },
        {
          title: 'Admin',
          link: 'AdminSite'
        },]

      },
      {
        title: 'Manage Inventory',
        expanded: false,
        children: [
          {
            title: 'Category',
            link: 'ManageCategory', // goes into angular `routerLink`
            hidden: !Boolean(this.permissionsService.hasPermission('inventory.view_productcategory') .then((value:boolean)=>{console.log(value); return value}))
          },
          {
            title: 'Sub Category',
            link: 'ManageSubCategory', // goes into angular `routerLink`
            hidden: !Boolean(this.permissionsService.hasPermission('inventory.view_productsubcategory') .then((value:boolean)=>{console.log(value); return value}))
          },
          {
            title: 'Brand',
            link: 'ManageBrandMaster', // goes into angular `routerLink`
            hidden: !Boolean(this.permissionsService.hasPermission('inventory.view_productbrandmaster') .then((value:boolean)=>{console.log(value); return value}))
          },
          {
            title: 'Unit',
            link: 'ManageUnitMaster', // goes into angular `routerLink`
            hidden: !Boolean(this.permissionsService.hasPermission('inventory.view_unitmaster') .then((value:boolean)=>{console.log(value); return value}))
          },
          {
            title: 'Product Master',
            link: 'ManageProductMaster', // goes into angular `routerLink`
            hidden: this.check_permission('inventory.view_productmaster')
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
            {
              title: 'Purchase Requisition',
              link: 'PurchaseRequisitionList', // goes into angular `routerLink`
            },
            {
              title: 'Purchase Order',
              link: 'PurchaseOrderList', // goes into angular `routerLink`
           },
            {   
              title: 'Manage GRN',
              link: 'GrnList'
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
  }

  check_permission(permission):boolean {
    console.log(permission);
    // this.permissionsService.hasPermission(permission).then(
    //   (value:boolean)=>{
    //     console.log(permission +' ' +value); 
    //     // return value;
    //     this.has_permission = value;
    //   });
      if (this.permissionsService.getPermission(permission)){
        return false;
      }else{
        return true;
      }
  }
}
