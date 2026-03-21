import { TestBed } from '@angular/core/testing';

import { Av } from './av';

describe('Av', () => {
  let service: Av;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Av);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
