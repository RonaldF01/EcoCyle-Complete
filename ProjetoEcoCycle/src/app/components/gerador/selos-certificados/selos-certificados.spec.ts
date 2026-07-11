import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelosCertificados } from './selos-certificados';

describe('SelosCertificados', () => {
  let component: SelosCertificados;
  let fixture: ComponentFixture<SelosCertificados>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelosCertificados]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelosCertificados);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
