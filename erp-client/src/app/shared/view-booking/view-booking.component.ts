import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { AdminService } from 'src/app/admin/admin.service';


@Component({
  selector: 'app-view-booking',
  templateUrl: './view-booking.component.html',
  styleUrls: ['./view-booking.component.scss']
})
export class ViewBookingComponent implements OnInit {
  booking_list:any;
  selected_stylist : [];
  dailog_ref;
  stylist_list =  []
  serviceId: any;
  booking_details: any;
  customer_id: any;
  service_list: any;
  app_id: any;
  passed_flag: any=false;
  service_id:any=[];
  searchStylist: any;




  constructor(private adminService: AdminService,
              private nbtoastService: NbToastrService,
              private dialogService: NbDialogService,
              private routes: Router,
              private route: ActivatedRoute,) { }



  ngOnInit(): void {

    this.get_booking_list();


    this.adminService.getEmployeeList().subscribe(
      (data) => {
        this.stylist_list = data;
      },
      (error) => {
          this.nbtoastService.danger("Unable get appointment data");
      }
    )
  }

  get_booking_list() {
    this.adminService.getViewbookingList().subscribe(
      (data) => {
          this.booking_list = data;

         //this.service_list = this.booking_list.service_list
        //  this.service_id = this.service_list.forEach(element => {
        //    element.service__id
        //  });
          console.log("booking_list",this.booking_list)

            let sort:any = this.booking_list.sort((a, b) => {
              return <any>(b.phone_number) - <any>(a.phone_number);
            });
            console.log("sorted array" +sort)

      },
      (error) => {
          this.nbtoastService.danger("Unable get appointment data");
      }
    )
  }

  stylist_open(dialog: TemplateRef<any>,item) {
    this.searchStylist = ""
    this.dailog_ref= this.dialogService.open(dialog, { context: this.stylist_list })
    .onClose.subscribe(data => {
      console.log("sty",data)
       item.assigned_staff = data
       console.log(item.assigned_staff.id)
       console.log(item.id)
       this.app_id = item.id
       this.customer_id = item.customer__id
       console.log(this.customer_id)
       this.service_id = []
       item.service_list.forEach(element => {
         console.log(element.service__id)
         this.service_id.push(element.service__id)
       });
       console.log("service",this.service_id)
       let form_data = new FormData();
       if(this.app_id){
        form_data.append('id', this.app_id);
        form_data.append('assigned_staff',item.assigned_staff.id)

      }
        let service_ids=[];
        service_ids =[{ "id":(item.service_list.map(service => {return service.id})).toString(),"service_id":(item.service_list.map(service => {return service.service__id}).toString()),"stylist_id":item.assigned_staff.id}]
       form_data.append('store',sessionStorage.getItem('store_id'));
       form_data.append('customer_name', item.customer_name);
       form_data.append('phone_number', item.phone_number);
       form_data.append('service',JSON.stringify(service_ids));
       form_data.append('start_time', item.start_time);
       form_data.append('end_time', item.end_time);
       form_data.append('booking_date', item.booking_date);
       form_data.append('customer', this.customer_id);
       form_data.append('is_paid',new Boolean(this.passed_flag).toString())

      //  this.checkoutToBill(this.customer_id)


       this.adminService.updateBooking(form_data).subscribe(
        (data) => {

           this.nbtoastService.success("Assigned Stylist")
           this.ngOnInit()
          //  this.routes.navigateByUrl("/SalesBill?id=" + this.customer_id)


        },
        (error) => {
            this.nbtoastService.danger("Failed to update");
        }
      )


    }
    );

  }

  checkOutToBill(item){
    this.routes.navigateByUrl("/SalesBill?id=" + item)

  }

  appointmentBooking(id, cus_id){
    this.routes.navigateByUrl("/ManageBooking?id="+ id + "&customer_id=" + cus_id )

  }

  appointmentDelete(id){
    this.adminService.deleteAppointment(id).subscribe({
      next: data => {
        let arr = data
        if (data[0] > 0) {
          console.log("refreshing booking list");
          this.get_booking_list();
        }
        console.log("Del Result: "+data);
        return data;
    },
    error: error => {
        let errorMessage = error.message;
        console.error('Error Message:', errorMessage);
        console.error('Error Stack:', error);
    }
      })


  }


}
