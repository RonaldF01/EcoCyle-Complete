import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Frota } from './frota';

describe('Frota', () => {
  let component: Frota;
  let fixture: ComponentFixture<Frota>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Frota]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Frota);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
