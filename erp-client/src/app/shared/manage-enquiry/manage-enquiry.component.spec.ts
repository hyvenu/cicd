import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEnquiryComponent } from './manage-enquiry.component';

describe('ManageEnquiryComponent', () => {
  let component: ManageEnquiryComponent;
  let fixture: ComponentFixture<ManageEnquiryComponent>;

  beforeEach(async(() => {
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
