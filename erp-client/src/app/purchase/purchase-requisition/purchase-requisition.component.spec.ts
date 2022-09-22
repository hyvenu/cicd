import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PurchaseRequisitionComponent } from './purchase-requisition.component';

describe('PurchaseRequisitionComponent', () => {
  let component: PurchaseRequisitionComponent;
  let fixture: ComponentFixture<PurchaseRequisitionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseRequisitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseRequisitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
