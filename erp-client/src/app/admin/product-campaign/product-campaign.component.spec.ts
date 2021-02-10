import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCampaignComponent } from './product-campaign.component';

describe('ProductCampaignComponent', () => {
  let component: ProductCampaignComponent;
  let fixture: ComponentFixture<ProductCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductCampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
