import { Component, OnInit } from '@angular/core';

import { CartService } from './cart.service';
import { MessengerService } from '../shared/messenger.service';
import { Product,CartItem } from '../models/index';
import { environment } from '../../environments/environment'

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  cartItems = [

    // {id:1,productId:1,productName:'test 1',qty:4,price:100 },
    // {id:2,productId:1,productName:'test 2',qty:1,price:150 },
    // {id:3,productId:1,productName:'test 3',qty:2,price:130 },
    // {id:4,productId:1,productName:'test 4',qty:3,price:160 },

  ];

  cartTotal = 0;

  BaseUrl = environment.BASE_SERVICE_URL;

  constructor(private msg : MessengerService ,private cartService: CartService) { }

  ngOnInit(): void {
    this.handelSubscription();
    this.loadCartItems();

}


handelSubscription(){
    this.msg.getMsg().subscribe((product : Product) =>{
      this.loadCartItems();
  })
}

loadCartItems(){
  this.cartService.getcartItem().subscribe((items: CartItem[])=>{
    this.cartItems = items;
    this.calculatCartTotal();
  })

}

// addProductToCart(product: Product){


//   let productExits = false

//   for(let i in this.cartItems){
//     if(this.cartItems[i].productId=== product.id){
//       this.cartItems[i].qty++
//       productExits = true
//       break;
//     }
//   }

//   if(!productExits){
//     this.cartItems.push({
//       productId:product.id,
//       productName:product.name,
//       qty:1,
//       price:product.price
//     })

//   }
// //   if(this.cartItems.length === 0){
// //     this.cartItems.push({
// //       productId:product.id,
// //       productName:product.name,
// //       qty:1,
// //       price:product.price
// //     })

// //   }else{

// //   for(let i in this.cartItems){
// //     if(this.cartItems[i].productId=== product.id){
// //       this.cartItems[i].qty++
// //     }else{

// //   this.cartItems.push({
// //     productId:product.id,
// //     productName:product.name,
// //     qty:1,
// //     price:product.price
// //   })
// //   }
// // }
// // }

// this.calculatCartTotal();

// }

calculatCartTotal(){
  this.cartTotal=0;
  this.cartItems.forEach(item =>{
    this.cartTotal += (item.qty * item.price)
  })
}

inc(cartItem){
  // console.log(cartItem)
  cartItem.qty = cartItem.qty+1;
  this.handleAddToCart(cartItem);
}

handleAddToCart(cartItem){
  this.cartService.addCartitemToCart(cartItem).subscribe(()=>{
    this.msg.sendMsg(cartItem);
  })
}

dec(cartItem){
  // console.log(cartItem)
  if(cartItem.qnt != 1){
    cartItem.qty -= 1;
  }
  this.handleAddToCart(cartItem);

}

}
