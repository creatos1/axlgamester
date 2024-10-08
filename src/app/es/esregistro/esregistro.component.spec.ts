import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsregistroComponent } from './esregistro.component';

describe('EsregistroComponent', () => {
  let component: EsregistroComponent;
  let fixture: ComponentFixture<EsregistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EsregistroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EsregistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
