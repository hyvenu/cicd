import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { registerUser } from '../../models/regsiterUser'
import { AbstractControl, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { SharedService } from '../shared.service';
import { Router } from '@angular/router';



/**
 * 
 * @param form
 */

function passwordMatchValidator(form){
  const password = form.get('password')
  const confirmpassword = form.get('confirmpassword')

  if(password.value !== confirmpassword.value){
    confirmpassword.setErrors({passwordsMatch:true})
  }else{
    confirmpassword.setErrors(null)
  }
}


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
 
  errorMsg:any;
  RegisterForm:FormGroup;
  Invalid:any;
  flag=false;
  register = new registerUser();
  constructor(private Service:SharedService,private fb:FormBuilder,private router:Router) { }

   ngOnInit(): void {
     console.log(this.register);
    this.RegisterForm = this.fb.group(
      {
        'fullname' :new FormControl('',[Validators.required,Validators.minLength(3)]),
        'email' : new FormControl('',[Validators.required,Validators.email]),
        'phone_number' : new FormControl('',Validators.required,),
        // 'passGroup':this.fb.group({
          'password' : new FormControl('',[Validators.required,Validators.minLength(6)]),
          'confirmpassword' : new FormControl('',Validators.required)


        // },{validators:this.passwordMatcher})
         

        
        
      },{
        validators:passwordMatchValidator
      }
    );


  }

  // passwordMatcher(c: AbstractControl):{[key:string]:boolean} | null{
  //   const passwordControl = c.get('password');
  //   const confirmControl = c.get('confirmpassword');

  //   if(passwordControl.pristine || confirmControl.pristine){
  //     return null;
  //   }

  //   if(passwordControl.value === confirmControl.value){
  //     return null;
  //   }

  //   return {match:true};
  // }

 
    
  onSubmit()
  {
    console.log(this.RegisterForm.valid);
    if(this.RegisterForm.valid)
    {
      const user:registerUser=
      {
        first_name:this.RegisterForm.controls['fullname'].value,
        email:this.RegisterForm.controls['email'].value,
        phone_number:this.RegisterForm.controls['phone_number'].value,
        password:this.RegisterForm.controls['password'].value,
        confirmpassword:this.RegisterForm.controls['confirmpassword'].value
      };

      this.Service.registerUser(user).subscribe((data)=>
      {
        this.router.navigate(["/Login"]);
      },(error) => {
          console.log(error)
          this.flag=true;
          this.errorMsg = error.message;
          
      });
      
    }

  }

}