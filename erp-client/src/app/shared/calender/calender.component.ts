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


    this.store_id = sessionStorage.getItem('store_id')
    this.get_employee(this.getCorrectDate(true, ""));

  }

  getCorrectDate(today:boolean, specific_date:any) {
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
    console.log("CORECT DATE:"+date);
  }catch(e){
    alert(e);
  }
    return date;
  }
  formatDate(sdate:any, hours:any, minutes:any) {
    // Split timestamp into [ Y, M, D, h, m, s ]
    //var t = "2010-06-09 13:12:01".split(/[- :]/);
    var t = sdate.split(/[- :]/);

    // Apply each element to the Date function
    var d = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));
    d.setHours(hours, minutes, 0, 0);
    console.log("FORMATED")
    console.log(d)
    return d;
  }
  formatDate2(sdate:any) {
    // Split timestamp into [ Y, M, D, h, m, s ]
    //var t = "2010-06-09 13:12:01".split(/[- :]/);
    var t = sdate.split(/[- :]/);

    // Apply each element to the Date function
    var d = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));
    console.log("FORMATED CUSTOM")
    console.log(d)
    return d;
  }
  onStartDateChanged = (event) => {
    console.log("################# onStartDateChanged");
    console.log(event._i);
    const specific_date = new Date(event)
    let dateStr = this.getCorrectDate(false, specific_date);
    this.calStart = this.formatDate2(dateStr+" 07:00:00").toUTCString();
    this.calEnd  = this.formatDate2(dateStr+" 23:00:00").toUTCString();

    //this.calStart = this.today(7, 0);
    //this.calEnd  = this.today(23, 0);
    this.get_appointment_details(false, dateStr);



    //this.calendarFun(start, end)

    /*this.next_previous_date = new Date(specific_date)
    const current_date: any = new Date();
    specific_date.setHours(0,0,0,0);
    current_date.setHours(0,0,0,0);
    if (specific_date.getTime() > current_date.getTime()) {
      this.calendarFun(current_date, specific_date)
    } if (current_date.getTime() > specific_date.getTime()) {
      current_date.setHours(24,0,0,0);
      this.calendarFun(specific_date, current_date)
    } else {
      specific_date.setHours(24,0,0,0);
      this.calendarFun(current_date, specific_date)
    }

*/
  }

  nextDate = () => {
    console.log("################# nextDate");
    if(!this.next_previous_date){
    this.next_previous_date = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
    }else{
      this.next_previous_date = new Date(this.next_previous_date.getTime() + 24 * 60 * 60 * 1000)

    }
    const start = new Date(this.next_previous_date)
    const end = new Date(this.next_previous_date)
    start.setHours(0,0,0,0);
    end.setHours(24,0,0,0);
    this.calendarFun(start, end)
  }

  previousDate = () =>{
    console.log("################# previousDate");
    if(!this.next_previous_date){
      this.next_previous_date = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
      }else{
        this.next_previous_date = new Date(this.next_previous_date.getTime() - 24 * 60 * 60 * 1000)

      }
      const start = new Date(this.next_previous_date)
      const end = new Date(this.next_previous_date)
      start.setHours(0,0,0,0);
      end.setHours(24,0,0,0);
      this.calendarFun(start, end)
  }

  calendarFun = (start, end) => {
    console.log("start:"+start)
    console.log("end:"+end)
    try{
    console.log("started")
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
      /*
      if( this.event_details["start"] < this.current_date){
        this.nbtoastService.danger(" You Have Selected Invalid Date or Time For Booking");
      }else{
        this.routes.navigateByUrl("/ManageBooking?start=" +this.event_details["start"] + "&end="+this.event_details["end"]+ "&assign="+this.event_details["location"])
      }
      */
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
  get_hours = (date) => {
    let hours_obj = {}
    const specific_date: any = new Date(date);
    const current_date: any = new Date();
    specific_date.setHours(0,0,0,0);
    current_date.setHours(0,0,0,0);
    if (specific_date.getTime() > current_date.getTime()) {
      const milliseconds = Math.abs((specific_date - current_date));
      let hours = milliseconds / 36e5; current_date
      hours = Math.round(hours)
      hours_obj = {
        offset: "tomorrow",
        hours: hours
      }
    } else if (current_date.getTime() > specific_date.getTime()) {
      const milliseconds = Math.abs(current_date - specific_date);
      let hours = milliseconds / 36e5;
      hours = Math.round(hours)
      hours_obj = {
        offset: "yesterday",
        hours: hours
      }
    } else {
      let hours = 0
      hours_obj = {
        offset: "today",
        hours: hours
      }
    }
    return hours_obj
  }

  today(hours, minutes) {
    var date = new Date();
    date.setHours(hours, minutes, 0, 0);
    console.log("TODAY")
    console.log(date)
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

/*
  today = (hours, minutes) => {
    var date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;

  }
  yesterday = (hours, minutes, hoursOffset) => {
    var date = this.today(hours, minutes);
    date.setTime(date.getTime() - hoursOffset * 60 * 60 * 1000);
    // var date = new Date();
    // date.setHours(7, 0, 0, 0);
    var gdate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    return gdate;

  }
  tomorrow = (hours, minutes, hoursOffset) => {
    var date = this.today(hours, minutes);
    date.setTime(date.getTime() + hoursOffset * 60 * 60 * 1000);
    var gdate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    return gdate;
  }
*/
  get_date_range = (hours, minutes, offset, hoursOffset) => {
    var date = this.today(hours, minutes);
    if (offset == "+") {
      date.setTime(date.getTime() + hoursOffset * 60 * 60 * 1000);
    } else {
      date.setTime(date.getTime() - hoursOffset * 60 * 60 * 1000);
    }

    var gdate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    return gdate;
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
        console.log("CALENDAR DATA")
        console.log(data)
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
              /*
              let start: any;
              let end: any
              const hoursOffset: any = this.get_hours(data[0].booking_date);
              if (hoursOffset.offset == "today") {
                start = this.today(Number(start_hour), Number(start_min))
                end = this.today(Number(end_hour), Number(end_min))
              } else if (hoursOffset.offset == "yesterday") {
                start = this.get_date_range(Number(start_hour), Number(start_min), "-", hoursOffset.hours)
                end = this.get_date_range(Number(end_hour), Number(end_min), "-", hoursOffset.hours)
              } else if (hoursOffset.offset == "tomorrow") {
                start = this.get_date_range(Number(start_hour), Number(start_min), "+", hoursOffset.hours)
                end = this.get_date_range(Number(end_hour), Number(end_min), "+", hoursOffset.hours)
              }
              */
    /*
              this.locations.push({
                  id: element.assigned_staff__id,
                  name: element.assigned_staff__employee_name
                })*/
                console.log("LOCATIONS")
                console.log(this.locations)

              this.events.push({
                name: element.service__service_name +  "-"  + serv.customer__customer_name,
                location: element.assigned_staff__id,
                start: this.formatDate(data[0].booking_date+" 00:00:00", start_hour, start_min).toUTCString(),
                end: this.formatDate(data[0].booking_date+" 00:00:00", end_hour, end_min).toUTCString()
              })

              console.log("EVENTS")
              console.log(this.events)
            }
            });
        });


      }

      if(onload) {
        const start = this.today(7, 0);

        const end = this.today(23, 0);


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
