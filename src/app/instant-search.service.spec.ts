import { TestBed } from '@angular/core/testing';

import { InstantSearchService } from './instant-search.service';

describe('InstantSearchService', () => {
  let service: InstantSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstantSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
