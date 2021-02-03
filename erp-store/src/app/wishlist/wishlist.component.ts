import { Router } from '@angular/router';
import { WishlistService } from './wishlist.service';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
  wishlist:any;
  BaseUrl=environment.BASE_SERVICE_URL+'/';

  constructor(private Service:WishlistService,private route:Router) { }

  ngOnInit(): void {
    this.GetWishlist();
  }


  GetWishlist()
{
  this.Service.GetWishlist().subscribe((response)=>
   {
     this.wishlist = response;
    });
}

Goto(id:any)
{
  this.route.navigate(['/productview/'+id]);
}

RemoveFromWishlist(product) {
  let data = {
    product_id : product.id
  }
  this.Service.RemoveWishList(data).subscribe(
    (data) => {
     
    }
  )
}
refresh(): void {
  window.location.reload();
}

}
