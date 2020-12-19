import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  CartForm:FormGroup;
  constructor(private router:Router) { }

  ngOnInit(): void {
    this.CartForm = new FormGroup(
      {
        'Quantity' :new FormControl('',Validators.required),
        'Measurement' : new FormControl(null,Validators.required)
      }
    );
  }

  onSubmit()
  {
    if(this.CartForm.valid)
    {

    }
  }

  GoToProductList()
  {
    this.router.navigate(['/productlist'])
  }


  GotoProductview(data:any)
  {
    let routeTo = "productview/"+data;
    this.router.navigate([routeTo]);
  }

}
