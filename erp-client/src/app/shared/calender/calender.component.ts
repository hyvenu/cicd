import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NbToastrService } from '@nebular/theme';
import { AdminService } from 'src/app/admin/admin.service';
// import * as $ from 'jquery';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.css'],


})
export class CalenderComponent implements OnInit {

  events = [];
  locations = [];

  myCalendar: any;
  employeeData: any;
  booking_list: any;
  next_previous_date:any=null;
  selectedDate:any;


  store_id: string | Blob;
  selected_date: any;
  current_date :any = new Date().toUTCString();



  calStart:any;
  calEnd:any;

  date:any
  event_details: Promise<boolean>;



  constructor(private nbtoastService: NbToastrService,
    private adminService: AdminService,
    private datePipe: DatePipe,
    private routes: Router,
    private route: ActivatedRoute) {

  }

  ngOnInit(): void {


    this.store_id = localStorage.getItem('store_id')
    this.get_employee(this.getDateOnly(true, ""));

  }

  getDateOnly(today:boolean, specific_date:any) {
    let dt:any;
    let date:any;
    try{
      if(today) {
        //get today
        dt = new Date();
        date = dt.getFullYear()+"-"+(dt.getMonth()+1)+"-"+dt.getDate();
      }else{
        dt = new Date(specific_date);
        date = dt.getFullYear()+"-"+(dt.getMonth()+1)+"-"+dt.getDate();
      }
    }catch(e){
      console.log("Get Date Error:"+e);
    }
    return date;
  }

  formatDate(sdate:any, hours:any, minutes:any) {
    //Split timestamp into [ Y, M, D, h, m, s ]
    //var t = "2010-06-09 13:12:01".split(/[- :]/);
    var t = sdate.split(/[- :]/);

    //Apply each element to the Date function
    var d = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));
    d.setHours(hours, minutes, 0, 0);
    return d;
  }

  onStartDateChanged = (event) => {
    console.log(event._i);
    this.selectedDate = new Date(event)
    let dateStr = this.getDateOnly(false, this.selectedDate);
    this.calStart = this.formatDate(dateStr+" 00:00:00", 1, 0);
    this.calEnd  = this.formatDate(dateStr+" 0:00:00", 24, 0);
    this.get_appointment_details(false, dateStr);
  }

  nextDate = () => {
    this.next_previous_date = this.selectedDate;
    if(!this.next_previous_date){
    this.next_previous_date = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
    }else{
      this.next_previous_date = new Date(this.next_previous_date.getTime() + 24 * 60 * 60 * 1000)
    }
    this.selectedDate = this.next_previous_date;

    let dateStr = this.getDateOnly(false, this.next_previous_date);
    this.calStart = this.formatDate(dateStr+" 00:00:00", 1, 0);
    this.calEnd  = this.formatDate(dateStr+" 0:00:00", 24, 0);
    this.get_appointment_details(false, dateStr);
  }

  previousDate = () =>{
    this.next_previous_date = this.selectedDate;
    if(!this.next_previous_date){
      this.next_previous_date = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
      }else{
        this.next_previous_date = new Date(this.next_previous_date.getTime() - 24 * 60 * 60 * 1000)
      }
      this.selectedDate = this.next_previous_date;

      let dateStr = this.getDateOnly(false, this.next_previous_date);
      this.calStart = this.formatDate(dateStr+" 00:00:00", 1, 0);
      this.calEnd  = this.formatDate(dateStr+" 0:00:00", 24, 0);
      this.get_appointment_details(false, dateStr);
  }

  calendarFun = (start, end) => {
    try{
    $('#container').empty();
    this.myCalendar = $('#container').skedTape({
      caption: 'Employee',
      start: start,
      end: end,
      showEventTime: true,
      showEventDuration: true,
      scrollWithYWheel: true,
      locations: this.locations.slice(),
      events: this.events.slice(),
      maxTimeGapHi: 60 * 1000, // 1 minute
      minGapTimeBetween: 1 * 60 * 1000,
      snapToMins: 1,
      editMode: true,
      timeIndicatorSerifs: true,
      showIntermission: true,
      showPopovers:"always",
      formatters: {
        date: function (date) {
          return $.fn.skedTape.format.date(date, 'l', '.');
        },
        duration: function (ms, opts) {
          return $.fn.skedTape.format.duration(ms, {
            hrs: 'H',
            min: 'M'
          });
        },
      },
      postRenderLocation: function ($el, location, canAdd) {
        this.constructor.prototype.postRenderLocation($el, location, canAdd);
        $el.prepend('<i class="fas fa-thumbtack text-muted"/> ');
      }
    });


    this.myCalendar.on('event:dragEnded.skedtape', (e) => {

      this.event_details  = e.detail.event
      console.log(this.event_details);
      console.log(this.current_date)

      //if( this.event_details["start"] < this.current_date){
        //this.nbtoastService.danger(" You Have Selected Invalid Date or Time For Booking");
      //}else{
        //this.routes.navigateByUrl("/ManageBooking?id=" +this.event_details["app_id"])
      //}

    });
    this.myCalendar.on('event:click.skedtape', (e) => {

      this.myCalendar.skedTape('removeEvent', e.detail.event.id);
    });
    this.myCalendar.on('timeline:click.skedtape', (e, api) => {

      try {
        this.myCalendar.skedTape('startAdding', {
          name: '',
          duration: 60 * 60 * 1000
        });

      }

      catch (e) {
        if (e.name !== 'SkedTape.CollisionError') throw e;
        //alert('Already exists');
      }

    });

  }catch(e) {
    alert(e);
  }
  }

  today(hours, minutes) {
    var date = new Date();
    date.setHours(hours, minutes, 0, 0);
    //console.log("TODAY")
    //console.log(date)
    return date;
}
 yesterday(hours, minutes) {
    var date = this.today(hours, minutes);
    date.setTime(date.getTime() - 24 * 60 * 60 * 1000);
    return date;
}
 tomorrow(hours, minutes) {
    var date = this.today(hours, minutes);
    date.setTime(date.getTime() + 24 * 60 * 60 * 1000);
    return date;
}


  get_employee(date) {
    this.adminService.getEmployeeList().subscribe(
      (data) => {
        console.log(data)
/*
        this.locations = data.map(emp => {
          return {
            id: emp.id, name: emp.employee_name
          }
        });
*/
  data.forEach(element => {
        this.locations.push({
          id: element.id,
          name: element.employee_name
        })
      })
        //,tzOffset: -10 * 60,
        this.get_appointment_details(true, date)
      }
    )
  }

  get_appointment_details(onload:any, forDate:any) {
    this.adminService.getAppointmentListCalendar(this.store_id, forDate).subscribe(
      (data) => {
        if(data.length > 0) {
          this.events = [];
        data.forEach(serv => {
            let service = serv.service_list
            service.forEach(element => {
              if(element.assigned_staff__id){
              const start_hour = element.start_time.split(':')[0]
              const start_min = element.start_time.split(':')[1]
              const end_hour = element.end_time.split(':')[0]
              const end_min = element.end_time.split(':')[1]

              this.events.push({
                name: element.service__service_name +  "-"  + serv.customer__customer_name,
                location: element.assigned_staff__id,
                start: this.formatDate(data[0].booking_date+" 00:00:00", start_hour, start_min).toUTCString(),
                end: this.formatDate(data[0].booking_date+" 00:00:00", end_hour, end_min).toUTCString(),
                app_id: serv.id
              })

            }
            });
        });

      }

      if(onload) {
        const start = this.today(1, 0);

        const end = this.today(24, 0);


        this.calendarFun(start, end);
      }else{
        this.calendarFun(this.calStart, this.calEnd);
      }
      },
      (error) => {
        this.nbtoastService.danger("Unable get appointment data");
      }
    )
  }


}
