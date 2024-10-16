import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDistrictComponent } from './create-district.component';

describe('CreateDistrictComponent', () => {
  let component: CreateDistrictComponent;
  let fixture: ComponentFixture<CreateDistrictComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateDistrictComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateDistrictComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
