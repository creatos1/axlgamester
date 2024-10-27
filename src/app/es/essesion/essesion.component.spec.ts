import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EssesionComponent } from './essesion.component';

describe('EssesionComponent', () => {
  let component: EssesionComponent;
  let fixture: ComponentFixture<EssesionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EssesionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EssesionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
