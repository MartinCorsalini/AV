import { TestBed } from '@angular/core/testing';

import { CryptoPrice } from './crypto-price';

describe('CryptoPrice', () => {
  let service: CryptoPrice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CryptoPrice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
