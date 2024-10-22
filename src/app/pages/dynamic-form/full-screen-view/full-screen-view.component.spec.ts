import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullScreenViewComponent } from './full-screen-view.component';

describe('FullScreenViewComponent', () => {
  let component: FullScreenViewComponent;
  let fixture: ComponentFixture<FullScreenViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullScreenViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FullScreenViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
