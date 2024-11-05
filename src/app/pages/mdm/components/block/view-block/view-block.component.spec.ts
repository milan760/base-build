import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBlockComponent } from './view-block.component';

describe('ViewBlockComponent', () => {
  let component: ViewBlockComponent;
  let fixture: ComponentFixture<ViewBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewBlockComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
