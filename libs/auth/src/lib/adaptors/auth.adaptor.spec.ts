import { TestBed } from '@angular/core/testing';

import { AuthAdaptor } from './auth.adaptor';

describe('AuthAdaptor', () => {
  let service: AuthAdaptor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthAdaptor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
