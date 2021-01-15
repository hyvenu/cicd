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
  inc_flag: boolean;
  dec_flag: boolean;

  constructor(private msg : MessengerService ,private cartService: CartService) { }

  ngOnInit(): void {
    this.handelSubscription();
    this.loadCartItems();

}

handleRemoveFromCart(cartItem){
  const data = {
    "id" : cartItem.id
  }
  this.cartService.removeFromCart(data).subscribe(()=>{
    this.refresh();
  })
}

refresh(): void {
  window.location.reload();
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

calculatCartTotal(){
  this.cartTotal=0;
  this.cartItems.forEach(item =>{
    this.cartTotal += (item.sub_total)
  })
}

inc(cartItem){
  // console.log(cartItem)
   
  cartItem.qty = cartItem.qty+1;
  this.handleAddToCart(cartItem);
}

handleAddToCart(cartItem){
  const data = {
    'id':cartItem.id,
    'product_id' : cartItem.product__id,
    'pack_unit_id' : cartItem.pack_unit__id,
    'unit_price' : cartItem.pack_unit__sell_price,
    'qty' : cartItem.qty,
    'user_id': sessionStorage.getItem('user_id')
  }
  return this.cartService.addToCart(data).subscribe(
    (data) => {
       this.msg.sendMsg(data);
    },
    (error) => {

    }
  );
}

dec(cartItem){
  // console.log(cartItem)
  this.dec_flag = true;
  if(cartItem.qty != 1){
    cartItem.qty -= 1;
    this.handleAddToCart(cartItem);
  }


}

}
