import { TestBed } from '@angular/core/testing';

import { searchReceiverMixteComponent } from './searchReceverMixte.component';

describe('searchReceiverMixteComponent', () => {
  let service: searchReceiverMixteComponent ;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(searchReceiverMixteComponent );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
