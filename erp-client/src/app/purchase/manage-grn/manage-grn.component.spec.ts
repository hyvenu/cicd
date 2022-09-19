import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManageGrnComponent } from './manage-grn.component';

describe('ManageGrnComponent', () => {
  let component: ManageGrnComponent;
  let fixture: ComponentFixture<ManageGrnComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageGrnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageGrnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
