import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { optFlowGuard } from './opt-flow-guard';

describe('optFlowGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => optFlowGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
