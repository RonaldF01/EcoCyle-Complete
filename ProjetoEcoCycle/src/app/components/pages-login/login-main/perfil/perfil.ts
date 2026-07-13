import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Sidebar } from '../../../sidebar/sidebar';

import { Usuario } from '../../../../models/usuario';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule,Sidebar],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil implements OnInit {

  usuario: Usuario | null = null;
  
  perfilUsuario: 'gerador' | 'cooperativa' | 'recicladora' = 'gerador';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.carregarUsuario();
  }

  carregarUsuario(): void {

    const usuarioLogado = localStorage.getItem('usuarioLogado');
    const emailUsuarioAtual = localStorage.getItem('usuarioAtual');
    const usuariosSalvos = localStorage.getItem('usuarios');

    if (
      usuarioLogado !== 'true' ||
      !emailUsuarioAtual ||
      !usuariosSalvos
    ) {
      this.sair();
      return;
    }

    const usuarios: Usuario[] = JSON.parse(usuariosSalvos);

    const usuarioEncontrado = usuarios.find(
      usuario =>
        usuario.email.toLowerCase() ===
        emailUsuarioAtual.toLowerCase()
    );

    if (!usuarioEncontrado) {
      this.sair();
      return;
    }

    /*
      Cria uma cópia dos dados para permitir edição.
    */
    this.usuario = {
      ...usuarioEncontrado
    };

    this.perfilUsuario = usuarioEncontrado.perfil;
  }

  salvarAlteracoes(): void {

    if (!this.usuario) {
      alert('Usuário não encontrado.');
      return;
    }

    if (
      !this.usuario.nomeOrganizacao.trim() ||
      !this.usuario.cnpj.trim() ||
      !this.usuario.telefone.trim() ||
      !this.usuario.endereco.trim() ||
      !this.usuario.cidade.trim() ||
      !this.usuario.estado.trim()
    ) {
      alert('Preencha todos os campos.');
      return;
    }

    const emailUsuarioAtual = localStorage.getItem('usuarioAtual');
    const usuariosSalvos = localStorage.getItem('usuarios');

    if (!emailUsuarioAtual || !usuariosSalvos) {
      this.sair();
      return;
    }

    const usuarios: Usuario[] = JSON.parse(usuariosSalvos);

    const indiceUsuario = usuarios.findIndex(
      usuario =>
        usuario.email.toLowerCase() ===
        emailUsuarioAtual.toLowerCase()
    );

    if (indiceUsuario === -1) {
      alert('Usuário não encontrado.');
      return;
    }

    this.usuario.nomeOrganizacao =
      this.usuario.nomeOrganizacao.trim();

    this.usuario.cnpj =
      this.usuario.cnpj.trim();

    this.usuario.telefone =
      this.usuario.telefone.trim();

    this.usuario.endereco =
      this.usuario.endereco.trim();

    this.usuario.cidade =
      this.usuario.cidade.trim();

    this.usuario.estado =
      this.usuario.estado.trim().toUpperCase();

    /*
      Mantém o e-mail, senha e perfil originais.
    */
    this.usuario.email = usuarios[indiceUsuario].email;
    this.usuario.senha = usuarios[indiceUsuario].senha;
    this.usuario.perfil = usuarios[indiceUsuario].perfil;

    usuarios[indiceUsuario] = {
      ...this.usuario
    };

    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    alert('Dados atualizados com sucesso.');
  }

  get nomePerfil(): string {

    if (!this.usuario) {
      return '';
    }

    switch (this.usuario.perfil) {

      case 'gerador':
        return 'Gerador';

      case 'cooperativa':
        return 'Cooperativa';

      case 'recicladora':
        return 'Recicladora';

      default:
        return '';
    }
  }

  voltarDashboard(): void {

    if (!this.usuario) {
      return;
    }

    switch (this.usuario.perfil) {

      case 'gerador':
        this.router.navigate(['/gerador/dashboard']);
        break;

      case 'cooperativa':
        this.router.navigate(['/cooperativa/dashboard']);
        break;

      case 'recicladora':
        this.router.navigate(['/recicladora/dashboard']);
        break;
    }
  }

  sair(): void {
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('usuarioAtual');

    this.router.navigate(['/']);
  }
}