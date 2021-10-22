import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMembersListComponent } from './manage-members-list.component';

describe('ManageMembersListComponent', () => {
  let component: ManageMembersListComponent;
  let fixture: ComponentFixture<ManageMembersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageMembersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageMembersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
