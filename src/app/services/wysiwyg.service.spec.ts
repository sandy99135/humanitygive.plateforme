import { TestBed } from '@angular/core/testing';

import { WysiWygService } from './wysiwyg.service';

describe('RecapAbsService', () => {
  let service:  WysiWygService ;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject( WysiWygService );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
