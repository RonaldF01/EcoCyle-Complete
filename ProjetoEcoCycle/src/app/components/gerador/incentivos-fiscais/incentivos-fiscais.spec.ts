import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncentivosFiscais } from './incentivos-fiscais';

describe('IncentivosFiscais', () => {
  let component: IncentivosFiscais;
  let fixture: ComponentFixture<IncentivosFiscais>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncentivosFiscais]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncentivosFiscais);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
