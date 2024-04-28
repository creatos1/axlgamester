import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcercaesComponent } from './acercaes.component';

describe('AcercaesComponent', () => {
  let component: AcercaesComponent;
  let fixture: ComponentFixture<AcercaesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcercaesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AcercaesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
