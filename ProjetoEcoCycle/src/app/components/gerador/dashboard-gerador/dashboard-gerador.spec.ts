import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardGerador } from './dashboard-gerador';

describe('DashboardGerador', () => {
  let component: DashboardGerador;
  let fixture: ComponentFixture<DashboardGerador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardGerador]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardGerador);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
