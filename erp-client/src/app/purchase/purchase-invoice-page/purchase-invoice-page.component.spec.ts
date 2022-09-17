import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PurchaseInvoicePageComponent } from './purchase-invoice-page.component';

describe('PurchaseInvoicePageComponent', () => {
  let component: PurchaseInvoicePageComponent;
  let fixture: ComponentFixture<PurchaseInvoicePageComponent>;

  beforeEach(waitForAsync(() => {
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
