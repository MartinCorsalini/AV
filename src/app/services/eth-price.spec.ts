import { TestBed } from '@angular/core/testing';

import { EthPrice } from './eth-price';

describe('EthPrice', () => {
  let service: EthPrice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EthPrice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
