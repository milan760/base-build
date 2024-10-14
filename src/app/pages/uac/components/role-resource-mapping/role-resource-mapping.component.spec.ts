import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleResourceMappingComponent } from './role-resource-mapping.component';

describe('RoleResourceMappingComponent', () => {
  let component: RoleResourceMappingComponent;
  let fixture: ComponentFixture<RoleResourceMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleResourceMappingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoleResourceMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
