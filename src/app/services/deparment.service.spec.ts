import { TestBed } from '@angular/core/testing';

import { DeparmentService } from './deparment.service';

describe('DeparmentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeparmentService = TestBed.get(DeparmentService);
    expect(service).toBeTruthy();
  });
});
