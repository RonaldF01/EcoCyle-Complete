import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchEMapa } from './match-emapa';

describe('MatchEMapa', () => {
  let component: MatchEMapa;
  let fixture: ComponentFixture<MatchEMapa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchEMapa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchEMapa);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
