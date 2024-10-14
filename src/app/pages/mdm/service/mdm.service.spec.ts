import { TestBed } from '@angular/core/testing';

import { MdmService } from './mdm.service';

describe('MdmService', () => {
  let service: MdmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MdmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
