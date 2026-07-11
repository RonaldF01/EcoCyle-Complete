import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRecicladora } from './dashboard-recicladora';

describe('DashboardRecicladora', () => {
  let component: DashboardRecicladora;
  let fixture: ComponentFixture<DashboardRecicladora>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardRecicladora]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardRecicladora);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
