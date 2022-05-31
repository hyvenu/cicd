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
       link: '/',
       icon:'grid',
      },
      // {
      //   title: 'Enquiry',
      //   link: 'EnquiryList',
      // },
      // {
      //   title: 'Members ',
      //   link: 'Members',
      // },
      {
        title: 'Customers',
        link: 'ManageCustomer',
        icon:'award'
      },
      {
        title: 'View Booking',
        link: 'ViewBooking',
        icon:'list'
       },
       {
        title: 'Calender',
        link: 'Calendar',
        icon:'calendar'
       },
      {
      title: 'Admin',
      expanded: false,
      icon:'person',
      children: [
        {
          title: 'Branch',
          link: 'ManageStoreList', // goes into angular `routerLink`,
          icon:'home',
          hidden: this.check_permission('store.view_storeuser')
        },
        {
          title: 'Services',
          link: 'Services', // goes into angular `routerLink`,
          icon:'layers'
          // hidden: this.check_permission('store.view_storeuser')
        },
        // {
        //   title: 'Offer Zone',
        //   link: 'OfferZone', // goes into angular `routerLink`,
        //   hidden: this.check_permission('store.view_productcampaigns')
        // },
        {
          title: 'Department',
          link: 'DepartmentList',
          icon:'arrowhead-right',
        },
        {
          title: 'Designation',
          link: 'DesignationList',
          icon:'arrowhead-right',
        },
        {
          title: 'Manage Employee',
          link: 'ManageEmployee',
          icon:'arrowhead-right',
        },
        {
          title: 'Admin',
          link: 'AdminSite',
          icon:'person',
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
        icon: 'book',
        children: [
          {
            title: 'Category',
            link: 'ManageCategory', // goes into angular `routerLink`
            icon:'arrowhead-right',
            hidden: this.check_permission('inventory.view_productcategory')
          },
          {
            title: 'Sub Category',
            link: 'ManageSubCategory', // goes into angular `routerLink`
            icon:'arrowhead-right',
            hidden: this.check_permission('inventory.view_productsubcategory')
          },
          {
            title: 'Brand',
            link: 'ManageBrandMaster', // goes into angular `routerLink`
            icon:'arrowhead-right',
            hidden: this.check_permission('inventory.view_productbrandmaster')
          },
          {
            title: 'Unit',
            link: 'ManageUnitMaster', // goes into angular `routerLink`
            icon:'arrowhead-right',
            hidden: this.check_permission('inventory.view_unitmaster')
          },
          {
            title: 'Product Master',
            link: 'ManageProductMaster', // goes into angular `routerLink`
            icon:'arrowhead-right',
            hidden: this.check_permission('inventory.view_productmaster')
          },

        ]

        },
         {
           title: 'Purchase',
           expanded: false,
           icon:'pricetags',
           children: [
             {
               title: 'Vendor Master',
               link: 'ManageVendortMaster', // goes into angular `routerLink`
               icon:'arrowhead-right',
               hidden: this.check_permission('vendor.view_vendormaster')
             },
             {
               title: 'Purchase Requisition',
               link: 'PurchaseRequisitionList', // goes into angular `routerLink`
               icon:'arrowhead-right',
               hidden: this.check_permission('purchase.view_purchaserequisition')
             },
             {
               title: 'Purchase Order',
               icon:'arrowhead-right',
               link: 'PurchaseOrderList', // goes into angular `routerLink`
            },
//             {
//               title: 'Purchase Invoice',
//               link: 'PurchaseInvoicePage', // goes into angular `routerLink`
//            },
           {
               title: 'Manage GRN',
               link: 'GrnList',
               icon:'arrowhead-right',
             },
           ]

        },
        {
          title: 'Sales',
          expanded: false,
          icon :'shopping-cart',
          children: [
            // {
            //   title: 'Orders',
            //   link: 'OrderList', // goes into angular `routerLink`
            //   hidden: this.check_permission('sales.view_orderrequest')
            // },
            {
              title: 'SalesBill List',
              url: 'SalesBillList', // goes into angular `routerLink`
              icon:'arrowhead-right',
              hidden: this.check_permission('sales.view_orderrequest'),

            },
            {
              title: ' Refund',
              link: 'Refund', // goes into angular `routerLink`
              icon :'flip-2',
              hidden: this.check_permission('sales.view_orderrequest')
            },
            {
              title: ' Exchange/Return',
              link: 'Exchange', // goes into angular `routerLink`
              icon :'flip-2',
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
              icon :'shopping-cart',
            },
            // {
            //   title: 'Invoice',
            //   link: 'InvoicePage',
            // }
          ]
        },
        {
          title: 'Reports',
          link: 'ReportsList',
          icon:'pie-chart'
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
