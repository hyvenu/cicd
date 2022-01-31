import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesBillListComponent } from './sales-bill-list.component';

describe('SalesBillListComponent', () => {
  let component: SalesBillListComponent;
  let fixture: ComponentFixture<SalesBillListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesBillListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesBillListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
