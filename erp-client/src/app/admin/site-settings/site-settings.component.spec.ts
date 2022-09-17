import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SiteSettingsComponent } from './site-settings.component';

describe('SiteSettingsComponent', () => {
  let component: SiteSettingsComponent;
  let fixture: ComponentFixture<SiteSettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
