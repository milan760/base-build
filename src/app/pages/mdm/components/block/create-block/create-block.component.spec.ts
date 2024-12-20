import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBlockComponent } from './create-block.component';

describe('CreateBlockComponent', () => {
  let component: CreateBlockComponent;
  let fixture: ComponentFixture<CreateBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateBlockComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
