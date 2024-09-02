import { TestBed } from '@angular/core/testing';

import { LocalisationService } from './localisation.component';

describe('LocalisationService', () => {
  let service: LocalisationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalisationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
