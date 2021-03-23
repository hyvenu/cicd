import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HomeserviceService } from 'src/app/home/homeservice.service';

@Component({
  selector: 'app-side-navbar-content',
  templateUrl: './side-navbar-content.component.html',
  styleUrls: ['./side-navbar-content.component.scss']
})
export class SideNavbarContentComponent implements OnInit {
  CategoryList: any;
  first_name: string;

  constructor(private Service:HomeserviceService,private router:Router) { }

  ngOnInit(): void {
    this.first_name = sessionStorage.getItem('first_name')
    this.GetCategories();
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

          //console.log(data[0].product_code);
          let subcatagorylist =[];
          let j = 0;
          while( j != subcategories.length)
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


      this.CategoryList = categories;
    //  console.log(this.CategoryList);

    },(error)=>
    {
      console.log(error);
    });
  }

  GoToCategoryList(category)
  {
    // this.router.navigate(['/category/'+category])
    window.location.href='/category?data='+category;
  }

}
