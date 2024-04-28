import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModsesComponent } from './modses.component';

describe('ModsesComponent', () => {
  let component: ModsesComponent;
  let fixture: ComponentFixture<ModsesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModsesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
