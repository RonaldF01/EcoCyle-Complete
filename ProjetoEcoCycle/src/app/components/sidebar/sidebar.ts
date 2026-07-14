import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar implements OnInit {

  @Input()
  perfil: 'gerador' | 'cooperativa' | 'recicladora' = 'gerador';

  @Output()
  menuAlterado = new EventEmitter<boolean>();

  menuAberto = true;
  telaMobile = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.verificarTamanhoTela();
  }

  @HostListener('window:resize')
  aoRedimensionar(): void {
    this.verificarTamanhoTela();
  }

  private verificarTamanhoTela(): void {

    this.telaMobile = window.innerWidth <= 768;

    if (this.telaMobile) {
      this.menuAberto = false;
    } else {
      this.menuAberto = true;
    }

    this.menuAlterado.emit(this.menuAberto);
  }

  toggleMenu(): void {

    this.menuAberto = !this.menuAberto;

    this.menuAlterado.emit(this.menuAberto);
  }

  fecharMenuMobile(): void {

    if (this.telaMobile) {
      this.menuAberto = false;
      this.menuAlterado.emit(false);
    }
  }

  sair(): void {

    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('usuarioAtual');
    localStorage.removeItem('perfilUsuario');

    localStorage.removeItem('emailCadastroTemporario');
    localStorage.removeItem('senhaCadastroTemporaria');
    localStorage.removeItem('perfilCadastroTemporario');

    this.router.navigate(['/']);
  }
}