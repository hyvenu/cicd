import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { data } from 'jquery';
import { WindowRefService } from '../../window-ref.service';
import { CheckoutService } from '../checkout.service';

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
  order_number: any;

  constructor(private winRef: WindowRefService,private route: ActivatedRoute,
              private checkOutService: CheckoutService,
              private router: Router) {}
                         
  ngOnInit() {
    this.user_name = sessionStorage.getItem("first_name");
    this.email = sessionStorage.getItem("email");
    this.phone_number = sessionStorage.getItem("phone_number");
    this.createRzpayOrder();
    

  }

  createRzpayOrder( ) {
    console.log( );
    this.order_id = this.route.snapshot.queryParams["order_id"]; 
    this.amount = this.route.snapshot.queryParams["amount"]; 
    this.order_number = this.route.snapshot.queryParams["order_number"]; 
    // this.route.params.subscribe(paramsId => {
    //   this.order_id = paramsId.id;
    // });
    // call api to create order_id
    this.payWithRazor(this.order_id);
  }

  payWithRazor(val) {
    alert(this.amount );
    const options: any = {
      key: 'rzp_test_veBhpMqs1IlGQO',
      amount: 1255 + '00', // amount should be in paise format to display Rs 1255 without decimal point
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
      this.checkOutService.verify_payment(response).subscribe(
        (data) =>{
          // this.router.navigateByUrl('OrderSummary?error=false&order_number='+this.order_number);
          window.location.href='OrderSummary?error=false&order_number='+this.order_number;

        },
        (error) => {
          // this.router.navigateByUrl('OrderSummary?error=true&order_number='+ this.order_number);
          window.location.href='OrderSummary?error=true&order_number='+ this.order_number;
        }
      )
    });
    options.modal.ondismiss = (() => {
      // handle the case when user closes the form while transaction is in progress
      console.log('Transaction cancelled.');
    });
    const rzp = new this.winRef.nativeWindow.Razorpay(options);
    rzp.open();
  }

}