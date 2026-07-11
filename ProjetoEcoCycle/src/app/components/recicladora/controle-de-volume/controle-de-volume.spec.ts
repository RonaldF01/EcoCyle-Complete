import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControleDeVolume } from './controle-de-volume';

describe('ControleDeVolume', () => {
  let component: ControleDeVolume;
  let fixture: ComponentFixture<ControleDeVolume>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControleDeVolume]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControleDeVolume);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
