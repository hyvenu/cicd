import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManageEnquiryComponent } from './manage-enquiry.component';

describe('ManageEnquiryComponent', () => {
  let component: ManageEnquiryComponent;
  let fixture: ComponentFixture<ManageEnquiryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageEnquiryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
