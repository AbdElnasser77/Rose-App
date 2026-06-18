import { TestBed } from '@angular/core/testing';

import { MessageAdaptor } from './message.adaptor';

describe('MessageAdaptor', () => {
  let service: MessageAdaptor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageAdaptor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
