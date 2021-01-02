import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckOutProductsComponent } from './check-out-products.component';

describe('CheckOutProductsComponent', () => {
  let component: CheckOutProductsComponent;
  let fixture: ComponentFixture<CheckOutProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckOutProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckOutProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
