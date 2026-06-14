import { TestBed } from '@angular/core/testing';

import { ErrorAdaptor } from './error.adaptor';

describe('ErrorAdaptor', () => {
  let service: ErrorAdaptor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorAdaptor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
