import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Coletas } from './coletas';

describe('Coletas', () => {
  let component: Coletas;
  let fixture: ComponentFixture<Coletas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Coletas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Coletas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
