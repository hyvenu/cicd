import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProductCampaignComponent } from './product-campaign.component';

describe('ProductCampaignComponent', () => {
  let component: ProductCampaignComponent;
  let fixture: ComponentFixture<ProductCampaignComponent>;

  beforeEach(waitForAsync(() => {
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
