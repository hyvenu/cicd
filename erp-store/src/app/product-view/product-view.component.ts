import { SharedService } from './../shared/shared.service';
import { ProductviewService } from './productview.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { isDefined } from '@angular/compiler/src/util';
import { ToastService } from '../shared/toast/toast.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss']
})
export class ProductViewComponent implements OnInit {
  currentRate: any;
  productcode: any;
  Product: any;
  BaseUrl = environment.BASE_SERVICE_URL + '/';
  CartForm: FormGroup;
  productAttribute: any;
  comment: any;
  ratings= [{user:'',product:'',id:'',comment:'',is_delete:'',first_name:''}];
  Avgratings: any;

  constructor(private activatedRoute: ActivatedRoute,
    private Service: ProductviewService,
    private sharedService: SharedService,
    private route: Router,
    private spinner: NgxSpinnerService,
    private toastService:ToastService,
    private _snackBar: MatSnackBar) {
    //   this.activatedRoute.params.subscribe(paramsId => {
    //     this.productcode = paramsId.id;
    // });
    this.productcode = activatedRoute.snapshot.queryParams['data'];

  }

  ngOnInit(): void {
    this.GetProduct();

  }

  GetProduct() {
    this.spinner.show();
    let data =
    {
      product_code: this.productcode
    }
    this.Service.GetProduct(data).subscribe((Product) => {
      this.spinner.hide();
      console.log(Product);
      this.Product = Product[0];
      this.getRatings();
      this.getAvgRatings();
      this.productAttribute = JSON.parse(this.Product.product_attributes);
      // console.log(this.productAttribute);
    }
    );
  }


  AddToCart(form: NgForm, product: any) {
    if (sessionStorage.getItem('user_id')) {
      if (form.valid) {

        let user_id = sessionStorage.getItem("user_id");
        let price = product.price.filter(t => t.id === form.controls['packingType'].value)[0].sell_price;
        let Cart =
        {
          product_id: product.id,
          user_id: user_id,
          qty: form.controls['Quantity'].value,
          pack_unit_id: form.controls['packingType'].value,
          unit_price: price
        }
        this.Service.AddToCart(Cart).subscribe((data) => {
          // this.toastService.show('Added to Cart', {
          //   classname: 'bg-primary text-light',
          //   delay: 2000 ,
          //   autohide: true,
          //   headertext: 'Successfull'
          // });
          this._snackBar.open('Item added to cart',"OK", {
            duration: 1000,
          })
          this.sharedService.changeMessage(data.length.toString());
          console.log(data);
        });
      }
    }
    else {
      this.route.navigate(['Login']);
    }
  }


  getRatings() {
    let id = this.Product.id;
    this.Service.getRatings(id).subscribe((data) => {
      // 
      // console.log(data);
      if(data.length > 0){
        this.ratings = data;
      }
    });
  }


  getAvgRatings() {
    let id = this.Product.id;
    this.Service.GetAvgRating(id).subscribe((data) => {
     // console.log(data);
      this.Avgratings = data;
    });
  }

  rateProduct() {
    if (this.currentRate != null) {
      let uid = sessionStorage.getItem('user_id');
      let pid = this.Product.id;
      let checkIfCommented = this.ratings.filter(t => t.product === pid && t.user === uid);
      if (checkIfCommented.length <= 0) {
        let data =
        {
          user: uid,
          product: pid,
          rating: this.currentRate,
          comment: this.comment,
        };
        this.Service.postRating(data).subscribe((data) => {
          this.currentRate = 0;
          this.comment = "";
          this.getRatings();
          this.getAvgRatings();
        });
      }
      else {
        let id = checkIfCommented[0].id;
        let data =
        {
          user: uid,
          product: pid,
          rating: this.currentRate,
          comment: this.comment,
        };
        this.Service.UpdateRating(data, id).subscribe((data) => {
          this.currentRate = 0;
          this.comment = "";
          this.getRatings();
          this.getAvgRatings();
        });
      }

    }
  }

}
