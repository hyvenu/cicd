import { HomeserviceService } from './homeservice.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  CategoryList:any;
  BaseUrl=environment.BASE_SERVICE_URL+'/';

  CartForm:FormGroup;
  PrimaryBanner: any;
  SecondaryBanner: any;
  OfferBanner: any;
  testing:any[]=[];
  constructor(private router:Router,private Service:HomeserviceService,private spinner: NgxSpinnerService) { }

  ngOnInit(): void {

    var data =
    {
      setting_Value:'<p><img src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg" alt="" title=""></p>'
    }

    this.testing.push(data);
    this.testing.push(data);
    this.testing.push(data);

    this.CartForm = new FormGroup(
      {
        'Quantity' :new FormControl('',Validators.required),
        'Measurement' : new FormControl(null,Validators.required)
      }
    );
    this.GetCategories();
    this.getPrimaryBanner();
    this.getSecondaryBanner();
    this.getOfferBanner();
  }

  onSubmit()
  {
    if(this.CartForm.valid)
    {

    }
  }

  GoToCategoryList(category)
  {
    this.router.navigate(['/category/'+category])
  }


  GetCategories()
  {
    this.spinner.show();
    let category={};
    this.Service.GetCategory(category).subscribe((categories)=>
    {
      //console.log(data[0].product_code);
     // console.log(products);


        this.Service.GetSubcategories().subscribe((subcategories)=>
        {
          for(let i=0;i<categories.length;i++)
          {

         // console.log(categories[i].category_name);
          let subcatagorylist =[];
          let j = 0;
          while( subcatagorylist.length <4 && j != subcategories.length)
          {

            if(categories[i].category_name == subcategories[j].category__category_name)
            {


              subcategories[j].category_image = categories[i].category_image;
              subcatagorylist.push(subcategories[j]);

            }
            j+=1;
          }


          categories[i].Subcatogories = subcatagorylist;


        }
        },(error)=>
        {
          console.log(error);
        });

      // }
      this.CategoryList = categories;
      this.spinner.hide();
    },(error)=>
    {
      this.spinner.hide();
      console.log(error);
    });
  }

  getPrimaryBanner()
  {
    let type = "banner_1";
    this.Service.GetBanners(type).subscribe((data)=>
    {
      this.PrimaryBanner = data;
    });
  }

  getSecondaryBanner()
  {
    let type = "banner_2";
    this.Service.GetBanners(type).subscribe((data)=>
    {
      this.SecondaryBanner = data;
    });
  }

  getOfferBanner()
  {
    let type = "banner_3";
    this.Service.GetBanners(type).subscribe((data)=>
    {
      this.OfferBanner = data;
    });
  }

}
