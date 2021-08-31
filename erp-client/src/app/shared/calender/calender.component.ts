import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NbToastrService } from '@nebular/theme';
import { AdminService } from 'src/app/admin/admin.service';
import * as $ from 'jquery';
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
 
 

  date:any
  event_details: Promise<boolean>;


  constructor(private nbtoastService: NbToastrService,
    private adminService: AdminService,
    private datePipe: DatePipe,
    private routes: Router,
    private route: ActivatedRoute) {

  }

  ngOnInit(): void {

   
    this.get_employee()


 

  }
  
  onStartDateChanged = (event) => {
    console.log(event._i);
    const specific_date = new Date(event)
    this.next_previous_date = new Date(specific_date)
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
    

  }

  nextDate = () => {
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
            hrs: 'ч.',
            min: 'мин.'
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
      
      this.routes.navigateByUrl("/ManageBooking?start=" +this.event_details["start"] + "&end="+this.event_details["end"])
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
    return date;

  }
  tomorrow = (hours, minutes, hoursOffset) => {
    var date = this.today(hours, minutes);
    date.setTime(date.getTime() + hoursOffset * 60 * 60 * 1000);
    return date;
  }

  get_date_range = (hours, minutes, offset, hoursOffset) => {
    var date = this.today(hours, minutes);
    if (offset == "+") {
      date.setTime(date.getTime() + hoursOffset * 60 * 60 * 1000);
    } else {
      date.setTime(date.getTime() - hoursOffset * 60 * 60 * 1000);
    }

    return date;
  }

  get_employee() {
    this.adminService.getEmployeeList().subscribe(
      (data) => {
        console.log(data)
        this.locations = data.map(emp => {
          return {
            id: emp.id, name: emp.employee_name
          }
        });
        //,tzOffset: -10 * 60,
        this.get_appointment_details()
      }
    )
  }

  get_appointment_details() {
    this.adminService.getAppointmentList().subscribe(
      (data) => {
        console.log(data)
        data.forEach(element => {
          if(element.assigned_staff__id){
          const start_hour = element.start_time.split(':')[0]
          const start_min = element.start_time.split(':')[1]
          const end_hour = element.end_time.split(':')[0]
          const end_min = element.end_time.split(':')[1]
          let start: any;
          let end: any
          const hoursOffset: any = this.get_hours(element.booking_date);
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

          this.events.push({
            name: element.service__service_name +  "-"  + element.customer__customer_name,
            location: element.assigned_staff__id,
            start: start,
            end: end,
            userData:element
          })
        }
        });
        const start = this.today(7, 0);
        const end = this.today(24, 0)
        
        this.calendarFun(start, end)

      },
      (error) => {
        this.nbtoastService.danger("Unable get appointment data");
      }
    )
  }


}
