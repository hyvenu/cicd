import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PrInvoiceComponent } from './pr-invoice.component';

describe('PrInvoiceComponent', () => {
  let component: PrInvoiceComponent;
  let fixture: ComponentFixture<PrInvoiceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PrInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
