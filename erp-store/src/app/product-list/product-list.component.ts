import { ToastService } from './../shared/toast/toast.service';
import { SharedService } from './../shared/shared.service';
import { ProductlistService } from './productlist.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  BaseUrl = environment.BASE_SERVICE_URL + '/';
  ProductList: any[] = [];
  categoryName: any;
  CartForm: FormGroup;
  FilterList: any[] = [];
  FilteredList: any[] = [];
  Filters = new Set();
  min: any;
  max: any;
  wishlist: any;
  constructor(private route: Router, private Service: ProductlistService, private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute, private sharedService: SharedService, private toastService: ToastService,
    private _snackBar: MatSnackBar) {

  }

  ngOnInit(): void {

    this.CartForm = new FormGroup(
      {
        'Quantity': new FormControl(null, Validators.required),
        'packingType': new FormControl(null, Validators.required)
      }
    );

    // this.activatedRoute.params.subscribe(paramsId => {
    //   this.categoryName = paramsId.id;
    // });
    this.categoryName = this.activatedRoute.snapshot.queryParams['data'];
    this.GetProducts();
    // this.loadWishlist();

  }

  GotoProductview(data: any) {
    // let routeTo = "productview/?data=" + data ;
    // this.route.navigate([routeTo]);
    // this.route.navigateByUrl("/productview?data=" + data) ;
    window.location.href = "/productview?data=" + data;
  }

  GetProducts() {
    this.spinner.show();
    console.log(this.categoryName);
    let data =
    {
      search_key: this.categoryName
    }
    this.Service.GetProducts(data).subscribe((Products) => {
      this.ProductList = Products;
      this.FilteredList = Products;

      let subcategories = new Set();
      let Brands = new Set();

      for (let i = 0; i < Products.length; i++) {
        let subcategoryname = Products[i].sub_category__sub_category_name;
        let brandname = Products[i].brand__brand_name;
        if (!subcategories.has(subcategoryname)) {
          subcategories.add(subcategoryname);
        }
        if (!Brands.has(brandname)) {
          Brands.add(brandname);
        }

      }

      let categorydata =
      {
        header: "Categories",
        filters: Array.from(subcategories)
      };
      let branddata =
      {
        header: "Brands",
        filters: Array.from(Brands)
      };

      this.FilterList.push(categorydata);
      this.FilterList.push(branddata);

      //console.log(this.FilterList);
      this.spinner.hide();

    }
    );
  }


  AddToCart(form: NgForm, product: any) {
    console.log(form);
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
          //this.count = data.length.toString();
          this.sharedService.changeMessage(data.length.toString());
          // this.toastService.show('Added to Cart', {
          //   classname: 'bg-primary text-light',
          //   delay: 2000,
          //   autohide: true,
          //   headertext: 'Successfull'
          // });
          this._snackBar.open('Item added to cart',"OK", {
            duration: 1000,
          })
          console.log(data);
        });
      }
    } else {
      this.route.navigate(['Login']);
    }
  }

  FilterData(type: any, filter: any) {
    let data = type + "," + filter;
    if (this.Filters.has(data)) {
      this.Filters.delete(data);
    }
    else {
      this.Filters.add(data);
    }

    this.Filter();

  }

  onInputChange(data: any) {

    this.max = data;
    this.Filter();

  }


  Filter() {


    let ProductList = this.ProductList;

    //filter price
    if (this.max != null) {
      ProductList = ProductList.filter(data => data.price.filter(data1 => Number(data1.sell_price) <= this.max).length > 0);

    }

    //filter category and brand

    if (ProductList.length > 0 && this.Filters.size > 0) {
      let filteredList = [];
      let categoryExist = false;
      for (let elements of this.Filters) {
        if (ProductList.length > 0) {
          let list = elements.toString().split(",");
          if (list[0] == "Categories") {
            categoryExist = true;
            let data = ProductList.filter(data => data.sub_category__sub_category_name == list[1]);
            Array.prototype.push.apply(filteredList, data);
          }
        }
        // console.log(ProductList);
      }
      if (categoryExist) {
        ProductList = filteredList;
      }
      filteredList = [];
      let brandExist = false;
      for (let elements of this.Filters) {
        if (ProductList.length > 0) {
          let list = elements.toString
            ().split(",");
          if (list[0] != "Categories") {
            brandExist = true;
            let data = ProductList.filter(data => data.brand__brand_name == list[1]);
            Array.prototype.push.apply(filteredList, data);
          }
        }
        // console.log(ProductList);
      }
      if (brandExist) {
        ProductList = filteredList;
      }
    }
    //console.log(ProductList);
    this.FilteredList = ProductList;

  }

  AddToWishlist(product) {
    let data = {
      product_id: product.id
    }
    if (sessionStorage.getItem('user_id')) {
      this.Service.AddToWishList(data).subscribe(
        (data) => {
          product.wish_list_flag = 1;
          // this.showSuccess();
          this._snackBar.open("Item added to whislist","OK", {
            duration: 1000,
          })
          this.sharedService.changewhilistMessage(data.length.toString());
        }
      )
    } else {
      this.route.navigate(['Login']);
    }
  }

  showSuccess() {
    this.toastService.show('Added to wishlist', {
      classname: 'bg-success text-light',
      delay: 2000,
      autohide: true,
      headertext: 'Successfull'
    });
  }

  showError() {
    this.toastService.show('Removed from wishlist', {
      classname: 'bg-danger text-light',
      delay: 2000,
      autohide: true,
      headertext: 'Successfull'
    });
  }

  RemoveFromWishlist(product) {
    let data = {
      product_id: product.id
    }
    this.Service.RemoveWishList(data).subscribe(
      (data) => {
        product.wish_list_flag = 0;
        // this.showError();
        this._snackBar.open("Removed from wishlist","OK", {
          duration: 1000,
        })
        this.sharedService.changewhilistMessage(data.length.toString());
      }
    )
  }


  ApplyFilter() {
    var applyFilter = document.getElementById("sidebar-wrapper");
    if (applyFilter.style.display == "none" || applyFilter.style.display == "") {
      applyFilter.style.display = "block";
    }
    else {
      applyFilter.style.display = "none";
    }
  }


  isTemplate(toast) {
    console.log(this.toastService.toasts);
    return toast.textOrTpl instanceof TemplateRef;
  }
}
