import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManageSubcategoryComponent } from './manage-subcategory.component';

describe('ManageSubcategoryComponent', () => {
  let component: ManageSubcategoryComponent;
  let fixture: ComponentFixture<ManageSubcategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageSubcategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSubcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
