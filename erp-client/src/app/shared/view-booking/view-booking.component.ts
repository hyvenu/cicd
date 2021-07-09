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
  booking_list: [];
  selected_stylist : [];
  dailog_ref;
  stylist_list =  []
  serviceId: any;
  booking_details: any;

  constructor(private adminService: AdminService,
              private nbtoastService: NbToastrService,
              private dialogService: NbDialogService,
              private routes: Router,
              private route: ActivatedRoute,) { }

  ngOnInit(): void {

    this.adminService.getAppointmentList().subscribe(
      (data) => {
          this.booking_list = data;
          
          console.log(this.booking_list)
      },
      (error) => {
          this.nbtoastService.danger("Unable get appointment data");
      }
    )


    this.adminService.getEmployeeList().subscribe(
      (data) => {
        this.stylist_list = data;
      },
      (error) => {
          this.nbtoastService.danger("Unable get appointment data");
      }
    )
  }

  stylist_open(dialog: TemplateRef<any>,item) {
    this.dailog_ref= this.dialogService.open(dialog, { context: this.stylist_list })
    .onClose.subscribe(data => {
       item.assigned_staff = data       
       let form_data = new FormData();

       form_data.append('store',sessionStorage.getItem('store_id'));
       form_data.append('customer_name', item.customer_name);
       form_data.append('phone_number', item.phone_number);
       form_data.append('service', item.service);
       form_data.append('start_time', item.start_time);
       form_data.append('end_time', item.end_time);
       form_data.append('booking_date', item.booking_date);
       form_data.append('assigned_staff',item.assigned_staff.id)

       this.adminService.updateBooking(item.id,form_data).subscribe(
        (data) => {
           this.nbtoastService.success("Assigned Stylist")
          this.ngOnInit()
        },  
        (error) => {
            this.nbtoastService.danger("Failed to update");
        }
      )

        
    }
    );
  }

}
