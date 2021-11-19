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
           console.log(this.permissionsService.getPermissions());
           console.log(this.permissionsService.hasPermission("store.view_store"));
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
        title: 'Department',
        link: 'DepartmentList',
      },
      {
        title: 'Designation',
        link: 'DesignationList',
      },
      {
        title: 'Enquiry',
        link: 'EnquiryList',
      },
      {
        title: 'Members ',
        link: 'Members',
      },
      {
        title: 'Manage Employee',
        link: 'ManageEmployee',
      },
      {
        title: 'Manage Customer',
        link: 'ManageCustomer'
      },
      {
        title: 'View Booking',
        link: 'ViewBooking'
       },
       {
        title: 'Calender',
        link: 'Calendar'
       },
      {
      title: 'Admin',
      expanded: false,
      children: [
        {
          title: 'Branch',
          link: 'ManageStoreList', // goes into angular `routerLink`,
          hidden: this.check_permission('store.view_storeuser')
        },
        {
          title: 'Services',
          link: 'Services', // goes into angular `routerLink`,
          // hidden: this.check_permission('store.view_storeuser')
        },
        // {
        //   title: 'Offer Zone',
        //   link: 'OfferZone', // goes into angular `routerLink`,
        //   hidden: this.check_permission('store.view_productcampaigns')
        // },
        {
          title: 'Admin',
          link: 'AdminSite',
          hidden: this.check_permission('admin.view_logentry')
        },
        // {
        //   title: 'Site Settings',
        //   link: 'sitesettings',
        //  // hidden: this.check_permission('admin.view_logentry')
        // },
      ]

      },
      {
        title: 'Inventory',
        expanded: false,
        children: [
          {
            title: 'Category',
            link: 'ManageCategory', // goes into angular `routerLink`
            hidden: this.check_permission('inventory.view_productcategory')
          },
          {
            title: 'Sub Category',
            link: 'ManageSubCategory', // goes into angular `routerLink`
            hidden: this.check_permission('inventory.view_productsubcategory')
          },
          {
            title: 'Brand',
            link: 'ManageBrandMaster', // goes into angular `routerLink`
            hidden: this.check_permission('inventory.view_productbrandmaster')
          },
          {
            title: 'Unit',
            link: 'ManageUnitMaster', // goes into angular `routerLink`
            hidden: this.check_permission('inventory.view_unitmaster')
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
               hidden: this.check_permission('vendor.view_vendormaster')
             },
             {
               title: 'Purchase Requisition',
               link: 'PurchaseRequisitionList', // goes into angular `routerLink`
               hidden: this.check_permission('purchase.view_purchaserequisition')
             },
             {
               title: 'Purchase Order',
               link: 'PurchaseOrderList', // goes into angular `routerLink`
            },
//             {
//               title: 'Purchase Invoice',
//               link: 'PurchaseInvoicePage', // goes into angular `routerLink`
//            },
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
              hidden: this.check_permission('sales.view_orderrequest')
            },
//             {
//               title: 'Sales Order',
//               link: 'SalesOrder', // goes into angular `routerLink`
//               // hidden: this.check_permission('sales.view_orderrequest')
//             },
//             {
//               title: 'Sales Records',
//               link: 'SalesDetails', // goes into angular `routerLink`
//               // hidden: this.check_permission('sales.view_orderrequest')
//             },
            {
              title: 'Sales Bill',
              link: 'SalesBill',
            },
            {
              title: 'Invoice',
              link: 'InvoicePage',
            }
          ]
        },
        {
          title: 'Reports',
          url:'http://103.146.177.164:8083/jasperserver/login.html',
          target: '_blank',
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
