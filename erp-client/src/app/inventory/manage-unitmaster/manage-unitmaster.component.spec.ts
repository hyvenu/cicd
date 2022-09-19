import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManageUnitmasterComponent } from './manage-unitmaster.component';

describe('ManageUnitmasterComponent', () => {
  let component: ManageUnitmasterComponent;
  let fixture: ComponentFixture<ManageUnitmasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageUnitmasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUnitmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
