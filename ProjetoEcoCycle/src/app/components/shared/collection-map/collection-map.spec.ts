import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionMap } from './collection-map';

describe('CollectionMap', () => {
  let component: CollectionMap;
  let fixture: ComponentFixture<CollectionMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionMap]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectionMap);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
