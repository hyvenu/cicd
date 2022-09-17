import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReportHomeComponent } from './report-home.component';

describe('ReportHomeComponent', () => {
  let component: ReportHomeComponent;
  let fixture: ComponentFixture<ReportHomeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
