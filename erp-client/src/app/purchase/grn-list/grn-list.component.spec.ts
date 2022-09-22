import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GrnListComponent } from './grn-list.component';

describe('GrnListComponent', () => {
  let component: GrnListComponent;
  let fixture: ComponentFixture<GrnListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GrnListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrnListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
