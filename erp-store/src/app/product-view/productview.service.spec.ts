import { TestBed } from '@angular/core/testing';

import { ProductviewService } from './productview.service';

describe('ProductviewService', () => {
  let service: ProductviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
