import { HomeserviceService } from './homeservice.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  CategoryList:any;
  BaseUrl=environment.BASE_SERVICE_URL+'/';

  CartForm:FormGroup;
  constructor(private router:Router,private Service:HomeserviceService) { }

  ngOnInit(): void {
    this.CartForm = new FormGroup(
      {
        'Quantity' :new FormControl('',Validators.required),
        'Measurement' : new FormControl(null,Validators.required)
      }
    );
    this.GetCategories();
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
    let category={};
    this.Service.GetCategory(category).subscribe((categories)=>
    {
      //console.log(data[0].product_code);
     // console.log(products);
     

        this.Service.GetSubcategories().subscribe((subcategories)=>
        {
          for(let i=0;i<categories.length;i++)
          {
    
          console.log(categories[i].category_name);
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

    },(error)=>
    {
      console.log(error);
    });
  }

}
