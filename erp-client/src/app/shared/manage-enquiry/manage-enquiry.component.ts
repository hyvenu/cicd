import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manage-enquiry',
  templateUrl: './manage-enquiry.component.html',
  styleUrls: ['./manage-enquiry.component.scss']
})
export class ManageEnquiryComponent implements OnInit {
  submitted: boolean;
  enquiryForm: any;

  constructor() { }

  ngOnInit(): void {
  }


  get f() { return this.enquiryForm.controls; }

    onSubmit() {
        this.submitted = true;
        
        // stop here if form is invalid
        if (this.enquiryForm.invalid) {
            return;
        }
        if (!this.enquiryForm.invalid){
        
          // this.employeeForm.reset()
          
          return this.submitted = false;

        }
        

      
    }
    
}
