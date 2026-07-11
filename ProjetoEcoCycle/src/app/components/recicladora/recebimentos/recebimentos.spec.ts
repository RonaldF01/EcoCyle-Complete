import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Recebimentos } from './recebimentos';

describe('Recebimentos', () => {
  let component: Recebimentos;
  let fixture: ComponentFixture<Recebimentos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Recebimentos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Recebimentos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
