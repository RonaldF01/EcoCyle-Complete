import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  imports: [],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css',
})
export class Cadastro {

  perfilSelecionado = '';

  constructor(private router: Router) {}

  selecionarPerfil(perfil: string) {
    this.perfilSelecionado = perfil;
  }

  voltarLogin() {
    this.router.navigate(['/']);
  }

  criarConta() {

    if (!this.perfilSelecionado) {
      alert('Selecione um perfil.');
      return;
    }

    // Salva o perfil escolhido
    localStorage.setItem('perfilUsuario', this.perfilSelecionado);

    // Vai para a próxima etapa
    this.router.navigate(['/cadastro-organizacao']);
  }

}