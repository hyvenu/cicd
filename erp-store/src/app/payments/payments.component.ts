import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WindowRefService } from '../window-ref.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css'],
  providers: [WindowRefService]
})
export class PaymentsComponent implements OnInit {
  order_id: any;
  user_name: string;
  email: string;
  phone_number: string;
  amount: any;

  constructor(private winRef: WindowRefService,private route: ActivatedRoute) {}
                         
  ngOnInit() {
    this.user_name = sessionStorage.getItem("first_name");
    this.email = sessionStorage.getItem("email");
    this.phone_number = sessionStorage.getItem("phone_number");
    this.createRzpayOrder();
    

  }

  createRzpayOrder( ) {
    console.log( );
    this.order_id = this.route.snapshot.queryParams["id"]; 
    this.amount = this.route.snapshot.queryParams["amount"];
    // this.route.params.subscribe(paramsId => {
    //   this.order_id = paramsId.id;
    // });
    // call api to create order_id
    this.payWithRazor(this.order_id);
  }

  payWithRazor(val) {
    const options: any = {
      key: 'rzp_test_veBhpMqs1IlGQO',
      amount: this.amount + '00', // amount should be in paise format to display Rs 1255 without decimal point
      currency: 'INR',
      name: 'Saffran E Commerece', // company name or product name
      description: '',  // product description
      image: '/assets/img/Saffaran-logo.png', // company logo or product image
      order_id: val, // order_id created by you in backend
      modal: {
        // We should prevent closing of the form when esc key is pressed.
        escape: false,
      },
      prefill: {
        name: this.user_name,
        email: this.email,
        contact: this.phone_number
      },
      notes: {
        // include notes if any
      },
      theme: {
        color: '#0c238a'
      }
    };
    options.handler = ((response, error) => {
      options.response = response;
      console.log(response);
      console.log(options);
      // call your backend api to verify payment signature & capture transaction
    });
    options.modal.ondismiss = (() => {
      // handle the case when user closes the form while transaction is in progress
      console.log('Transaction cancelled.');
    });
    const rzp = new this.winRef.nativeWindow.Razorpay(options);
    rzp.open();
  }

}