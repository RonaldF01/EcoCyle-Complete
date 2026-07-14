import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Sidebar } from '../../../sidebar/sidebar';
import { Usuario } from '../../../../models/usuario';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Sidebar
  ],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil implements OnInit {

  menuAberto = true;

  usuario: Usuario | null = null;

  carregando = true;

  salvando = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.carregarUsuario();
  }

  alterarMenu(aberto: boolean): void {
    this.menuAberto = aberto;
  }

  carregarUsuario(): void {

    this.carregando = true;

    const usuarioLogado =
      localStorage.getItem('usuarioLogado');

    const emailUsuarioAtual =
      localStorage.getItem('usuarioAtual');

    const perfilUsuario =
      localStorage.getItem('perfilUsuario');

    if (
      usuarioLogado !== 'true' ||
      !emailUsuarioAtual ||
      !perfilUsuario
    ) {
      this.encerrarSessao();
      return;
    }

    const usuarios: Usuario[] = this.obterUsuarios();

    const usuarioEncontrado = usuarios.find(
      usuario =>
        usuario.email.toLowerCase() ===
        emailUsuarioAtual.toLowerCase()
    );

    if (!usuarioEncontrado) {
      this.encerrarSessao();
      return;
    }

    if (usuarioEncontrado.perfil !== perfilUsuario) {
      this.encerrarSessao();
      return;
    }

    /*
      Cria uma cópia do usuário.

      Assim, os dados no localStorage só são alterados
      quando a pessoa clicar em Salvar Alterações.
    */
    this.usuario = {
      ...usuarioEncontrado
    };

    this.carregando = false;
  }

  salvarAlteracoes(): void {

    if (!this.usuario) {
      alert('Não foi possível identificar o usuário.');
      return;
    }

    if (!this.validarFormulario()) {
      return;
    }

    this.salvando = true;

    const emailUsuarioAtual =
      localStorage.getItem('usuarioAtual');

    if (!emailUsuarioAtual) {
      this.salvando = false;
      this.encerrarSessao();
      return;
    }

    const usuarios: Usuario[] = this.obterUsuarios();

    const indiceUsuario = usuarios.findIndex(
      usuario =>
        usuario.email.toLowerCase() ===
        emailUsuarioAtual.toLowerCase()
    );

    if (indiceUsuario === -1) {
      this.salvando = false;
      alert('Usuário não encontrado.');
      this.encerrarSessao();
      return;
    }

    /*
      Mantém os dados de autenticação originais.

      Nesta tela, somente os dados da organização
      podem ser alterados.
    */
    const usuarioAtualizado: Usuario = {
      ...usuarios[indiceUsuario],

      nomeOrganizacao:
        this.usuario.nomeOrganizacao.trim(),

      cnpj:
        this.usuario.cnpj.trim(),

      telefone:
        this.usuario.telefone.trim(),

      endereco:
        this.usuario.endereco.trim(),

      cidade:
        this.usuario.cidade.trim(),

      estado:
        this.usuario.estado.trim().toUpperCase()
    };

    usuarios[indiceUsuario] = usuarioAtualizado;

    localStorage.setItem(
      'usuarios',
      JSON.stringify(usuarios)
    );

    this.usuario = {
      ...usuarioAtualizado
    };

    this.salvando = false;

    alert('Dados atualizados com sucesso!');
  }

  private validarFormulario(): boolean {

    if (!this.usuario) {
      return false;
    }

    if (!this.usuario.nomeOrganizacao.trim()) {
      alert('Preencha o nome da organização.');
      return false;
    }

    if (!this.usuario.cnpj.trim()) {
      alert('Preencha o CNPJ.');
      return false;
    }

    if (!this.usuario.telefone.trim()) {
      alert('Preencha o telefone.');
      return false;
    }

    if (!this.usuario.endereco.trim()) {
      alert('Preencha o endereço.');
      return false;
    }

    if (!this.usuario.cidade.trim()) {
      alert('Preencha a cidade.');
      return false;
    }

    if (!this.usuario.estado.trim()) {
      alert('Preencha o estado.');
      return false;
    }

    return true;
  }

  private obterUsuarios(): Usuario[] {

    try {

      const usuariosSalvos =
        localStorage.getItem('usuarios');

      if (!usuariosSalvos) {
        return [];
      }

      return JSON.parse(usuariosSalvos) as Usuario[];

    } catch (erro) {

      console.error(
        'Erro ao carregar os usuários:',
        erro
      );

      return [];
    }
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
        return 'Usuário';
    }
  }

  get iconePerfil(): string {

    if (!this.usuario) {
      return 'fa-user';
    }

    switch (this.usuario.perfil) {

      case 'gerador':
        return 'fa-building';

      case 'cooperativa':
        return 'fa-recycle';

      case 'recicladora':
        return 'fa-industry';

      default:
        return 'fa-user';
    }
  }

  voltarDashboard(): void {

    if (!this.usuario) {
      return;
    }

    switch (this.usuario.perfil) {

      case 'gerador':
        this.router.navigate([
          '/gerador/dashboard'
        ]);
        break;

      case 'cooperativa':
        this.router.navigate([
          '/cooperativa/dashboard'
        ]);
        break;

      case 'recicladora':
        this.router.navigate([
          '/recicladora/dashboard'
        ]);
        break;
    }
  }

  sair(): void {
    this.encerrarSessao();
  }

  private encerrarSessao(): void {

    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('usuarioAtual');
    localStorage.removeItem('perfilUsuario');

    this.router.navigate(['/']);
  }
}