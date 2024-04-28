import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GaleriaesComponent } from './galeriaes.component';

describe('GaleriaesComponent', () => {
  let component: GaleriaesComponent;
  let fixture: ComponentFixture<GaleriaesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GaleriaesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GaleriaesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
