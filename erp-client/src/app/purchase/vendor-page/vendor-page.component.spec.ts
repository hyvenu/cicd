import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VendorPageComponent } from './vendor-page.component';

describe('VendorPageComponent', () => {
  let component: VendorPageComponent;
  let fixture: ComponentFixture<VendorPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
