import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroOrganizacao } from './cadastro-organizacao';

describe('CadastroOrganizacao', () => {
  let component: CadastroOrganizacao;
  let fixture: ComponentFixture<CadastroOrganizacao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroOrganizacao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroOrganizacao);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
