import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AppointmentBookComponent } from './appointment-book.component';

describe('AppointmentBookComponent', () => {
  let component: AppointmentBookComponent;
  let fixture: ComponentFixture<AppointmentBookComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AppointmentBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
