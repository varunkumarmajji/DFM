import { TestBed } from '@angular/core/testing';

import { NavbarbuttoncommunicationService } from './navbarbuttoncommunication.service';

describe('NavbarbuttoncommunicationService', () => {
  let service: NavbarbuttoncommunicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavbarbuttoncommunicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
