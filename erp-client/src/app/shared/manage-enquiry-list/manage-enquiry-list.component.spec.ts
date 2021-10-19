import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEnquiryListComponent } from './manage-enquiry-list.component';

describe('ManageEnquiryListComponent', () => {
  let component: ManageEnquiryListComponent;
  let fixture: ComponentFixture<ManageEnquiryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageEnquiryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageEnquiryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
