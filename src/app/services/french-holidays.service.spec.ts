import { TestBed } from '@angular/core/testing';

import { FrenchHolidaysService } from './french-holidays.service';

describe('FrenchHolidaysService', () => {
  let service: FrenchHolidaysService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FrenchHolidaysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
