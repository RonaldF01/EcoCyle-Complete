import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCooperativa } from './dashboard-cooperativa';

describe('DashboardCooperativa', () => {
  let component: DashboardCooperativa;
  let fixture: ComponentFixture<DashboardCooperativa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCooperativa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCooperativa);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
