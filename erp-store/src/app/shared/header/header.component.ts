import { CartService } from './../../cart/cart.service';
import { ProductListComponent } from './../../product-list/product-list.component';
import { HomeserviceService } from './../../home/homeservice.service';
import { Router } from '@angular/router';
import { SharedService } from './../shared.service';
import { Component, OnInit, ViewChild, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { WishlistService } from 'src/app/wishlist/wishlist.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  @ViewChild(ProductListComponent) cartCount;
  isAuthenticated = false;
  userSub: Subscription;
  first_name: string;
  CategoryList: any;
  subcategorylist: any;
  count: string;
  showFiller = false;
  wishlistCount: string;

  @Output() public sidenavToggle = new EventEmitter();

  constructor(private sharedservice: SharedService, 
    private route: Router, 
    private Service: HomeserviceService, 
    private cartService: CartService,
    private wishlistService: WishlistService ) { }

  ngAfterViewInit() {
    this.sharedservice.count.subscribe(message => {
      if (message != 'service') {
        this.count = message;

      }
    })

    this.sharedservice.wishlistcount.subscribe(message => {
      if (message != 'service'){
        this.wishlistCount = message;
      }
    })
  }

  ngOnInit(): void {


    // this.userSub =  this.sharedservice.userSubject.subscribe(user=>
    //   {

    //     this.isAuthenticated = !!user;
    //   });
    if (sessionStorage.getItem("user_id")) {
      this.isAuthenticated = true;

      this.loadCartItems();
      this.loadWishListItems();

    }
    // else
    // {
    //   this.userSub =  this.sharedservice.userSubject.subscribe(user=>
    //     {

    //       this.isAuthenticated = this.sharedservice.checkLogin();
    //     });
    // }
    this.first_name = sessionStorage.getItem('first_name');

    this.GetCategories();
  }

  logout() {
    this.sharedservice.logout();
    sessionStorage.clear();
    window.location.href = "Home";
  }

  Search(data: any) {
    if (data.length >= 3) {
      // this.route.navigate(["/category/" + data]);
      window.location.href = '/category?data=' + data;
    }
    else {
      this.route.navigate(['/']);
    }
  }

  mouseEnter(subCategory: any) {
    this.subcategorylist = subCategory;
  }

  Displaysubcategory(subCategory: any) {
    this.subcategorylist = subCategory;
  }

  GetCategories() {
    let category = {};
    this.Service.GetCategory(category).subscribe((categories) => {
      //console.log(data[0].product_code);
      // console.log(products);


      this.Service.GetSubcategories().subscribe((subcategories) => {
        for (let i = 0; i < categories.length; i++) {

          //console.log(data[0].product_code);
          let subcatagorylist = [];
          let j = 0;
          while (j != subcategories.length) {

            if (categories[i].category_name == subcategories[j].category__category_name) {


              subcategories[j].category_image = categories[i].category_image;
              subcatagorylist.push(subcategories[j]);

            }
            j += 1;
          }

          if (i == 0) {
            this.subcategorylist = subcatagorylist;
          }

          categories[i].Subcatogories = subcatagorylist;
        }
      }, (error) => {
        console.log(error);
      });


      this.CategoryList = categories;
      //  console.log(this.CategoryList);

    }, (error) => {
      console.log(error);
    });
  }


  loadCartItems() {
    this.cartService.getcartItem().subscribe((items: any) => {
      this.count = items.length;
    })
  }

  loadWishListItems() {
    this.wishlistService.GetWishlist().subscribe((items: any) => {
      this.wishlistCount = items.length;
    })
  }

  GoToCategoryList(category) {
    // this.route.navigate(['/category/' + category])
    window.location.href = '/category?data=' + category;
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }

}
