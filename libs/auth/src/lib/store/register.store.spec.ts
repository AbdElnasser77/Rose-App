import { TestBed } from '@angular/core/testing';

import { RegisterStore } from './register.store';

describe('RegisterStore', () => {
  let service: RegisterStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisterStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
