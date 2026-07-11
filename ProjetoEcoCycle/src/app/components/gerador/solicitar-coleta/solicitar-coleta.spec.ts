import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitarColeta } from './solicitar-coleta';

describe('SolicitarColeta', () => {
  let component: SolicitarColeta;
  let fixture: ComponentFixture<SolicitarColeta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitarColeta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitarColeta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
