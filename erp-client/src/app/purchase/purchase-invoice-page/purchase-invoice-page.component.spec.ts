import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseInvoicePageComponent } from './purchase-invoice-page.component';

describe('PurchaseInvoicePageComponent', () => {
  let component: PurchaseInvoicePageComponent;
  let fixture: ComponentFixture<PurchaseInvoicePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseInvoicePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseInvoicePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
