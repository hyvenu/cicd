import { Directive, ElementRef, Renderer2, OnInit } from '@angular/core';

@Directive({
  selector: '[appCarouselImage]'
})
export class CarouselImageDirective implements OnInit{

  constructor(private renderer:Renderer2, private elRef:ElementRef) { }


  ngOnInit(): void {
    this.elRef.nativeElement.childNodes[0].childNodes[0].style.width = "100%";
  }

}
