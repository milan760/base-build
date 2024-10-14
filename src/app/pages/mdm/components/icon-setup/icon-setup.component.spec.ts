import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconSetupComponent } from './icon-setup.component';

describe('IconSetupComponent', () => {
  let component: IconSetupComponent;
  let fixture: ComponentFixture<IconSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconSetupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IconSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
