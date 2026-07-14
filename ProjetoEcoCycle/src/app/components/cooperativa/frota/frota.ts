import { CommonModule } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Sidebar } from '../../sidebar/sidebar';

import {
  StatusVeiculo,
  Veiculo
} from '../../../models/veiculo';

import { Usuario } from '../../../models/usuario';

@Component({
  selector: 'app-frota',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Sidebar
  ],
  templateUrl: './frota.html',
  styleUrl: './frota.css'
})
export class Frota implements OnInit, OnDestroy {

  menuAberto = true;

  modalAberto = false;
  carregando = true;
  salvando = false;

  toastVisivel = false;
  mensagemToast = '';

  veiculos: Veiculo[] = [];

  cooperativaAtual: Usuario | null = null;

  placa = '';
  modelo = '';
  capacidadeKg: number | null = null;
  motorista = '';

  private intervaloAtualizacao?: ReturnType<typeof setInterval>;
  private temporizadorToast?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.carregarCooperativa();
    this.carregarVeiculos();

    this.intervaloAtualizacao = setInterval(() => {
      this.carregarVeiculos(false);
    }, 4000);

    window.addEventListener(
      'storage',
      this.aoAlterarStorage
    );
  }

  ngOnDestroy(): void {

    if (this.intervaloAtualizacao) {
      clearInterval(this.intervaloAtualizacao);
    }

    if (this.temporizadorToast) {
      clearTimeout(this.temporizadorToast);
    }

    window.removeEventListener(
      'storage',
      this.aoAlterarStorage
    );

    document.body.style.overflow = '';
  }

  private aoAlterarStorage = (): void => {
    this.carregarVeiculos(false);
  };

  alterarMenu(aberto: boolean): void {
    this.menuAberto = aberto;
  }

  abrirModal(): void {
    this.limparFormulario();
    this.modalAberto = true;

    document.body.style.overflow = 'hidden';
  }

  fecharModal(): void {
    this.modalAberto = false;
    this.salvando = false;

    document.body.style.overflow = '';

    this.limparFormulario();
  }

  fecharAoClicarFora(evento: MouseEvent): void {

    const elemento = evento.target as HTMLElement;

    if (elemento.classList.contains('modal-overlay')) {
      this.fecharModal();
    }
  }

  cadastrarVeiculo(): void {

    if (!this.cooperativaAtual) {
      alert(
        'Não foi possível identificar a cooperativa conectada.'
      );
      return;
    }

    const placaTratada = this.formatarPlaca(
      this.placa
    );

    if (!placaTratada) {
      alert('Preencha a placa do veículo.');
      return;
    }

    if (
      this.capacidadeKg === null ||
      this.capacidadeKg <= 0
    ) {
      alert(
        'Informe uma capacidade válida em quilogramas.'
      );
      return;
    }

    const todosVeiculos = this.obterVeiculos();

    const placaJaCadastrada = todosVeiculos.some(
      veiculo =>
        veiculo.placa.toUpperCase() ===
        placaTratada.toUpperCase()
    );

    if (placaJaCadastrada) {
      alert('Já existe um veículo com esta placa.');
      return;
    }

    this.salvando = true;

    const novoVeiculo: Veiculo = {
      id: Date.now(),

      cooperativaEmail:
        this.cooperativaAtual.email,

      cooperativaNome:
        this.cooperativaAtual.nomeOrganizacao,

      placa: placaTratada,

      modelo:
        this.modelo.trim() || 'Não informado',

      capacidadeKg:
        Number(this.capacidadeKg),

      motorista:
        this.motorista.trim() || 'Não informado',

      status: 'disponivel',

      criadoEm:
        new Date().toISOString()
    };

    todosVeiculos.push(novoVeiculo);

    localStorage.setItem(
      'veiculos',
      JSON.stringify(todosVeiculos)
    );

    this.salvando = false;

    this.fecharModal();
    this.carregarVeiculos(false);

    this.exibirToast(
      'Veículo cadastrado com sucesso!'
    );
  }

  alterarStatus(
    veiculo: Veiculo,
    novoStatus: StatusVeiculo
  ): void {

    const todosVeiculos = this.obterVeiculos();

    const indice = todosVeiculos.findIndex(
      item => item.id === veiculo.id
    );

    if (indice === -1) {
      alert('Veículo não encontrado.');
      this.carregarVeiculos();
      return;
    }

    todosVeiculos[indice] = {
      ...todosVeiculos[indice],

      status: novoStatus,

      atualizadoEm:
        new Date().toISOString()
    };

    localStorage.setItem(
      'veiculos',
      JSON.stringify(todosVeiculos)
    );

    this.carregarVeiculos(false);

    this.exibirToast(
      `Status alterado para ${this.nomeStatus(novoStatus)}.`
    );
  }

  carregarVeiculos(
    mostrarCarregamento = true
  ): void {

    if (mostrarCarregamento) {
      this.carregando = true;
    }

    const emailCooperativa =
      localStorage.getItem('usuarioAtual');

    if (!emailCooperativa) {
      this.veiculos = [];
      this.carregando = false;
      return;
    }

    this.veiculos = this.obterVeiculos()
      .filter(
        veiculo =>
          veiculo.cooperativaEmail.toLowerCase() ===
          emailCooperativa.toLowerCase()
      )
      .sort(
        (a, b) =>
          new Date(b.criadoEm).getTime() -
          new Date(a.criadoEm).getTime()
      );

    if (mostrarCarregamento) {
      setTimeout(() => {
        this.carregando = false;
      }, 300);
    }
  }

  nomeStatus(status: StatusVeiculo): string {

    switch (status) {

      case 'disponivel':
        return 'Disponível';

      case 'em_rota':
        return 'Em Rota';

      case 'manutencao':
        return 'Manutenção';

      default:
        return status;
    }
  }

  classeStatus(status: StatusVeiculo): string {

    switch (status) {

      case 'disponivel':
        return 'status-disponivel';

      case 'em_rota':
        return 'status-rota';

      case 'manutencao':
        return 'status-manutencao';

      default:
        return '';
    }
  }

  get totalDisponiveis(): number {

    return this.veiculos.filter(
      veiculo => veiculo.status === 'disponivel'
    ).length;
  }

  get totalEmRota(): number {

    return this.veiculos.filter(
      veiculo => veiculo.status === 'em_rota'
    ).length;
  }

  get totalManutencao(): number {

    return this.veiculos.filter(
      veiculo => veiculo.status === 'manutencao'
    ).length;
  }

  private carregarCooperativa(): void {

    const emailAtual =
      localStorage.getItem('usuarioAtual');

    if (!emailAtual) {
      this.cooperativaAtual = null;
      return;
    }

    const usuarios: Usuario[] = JSON.parse(
      localStorage.getItem('usuarios') || '[]'
    );

    this.cooperativaAtual =
      usuarios.find(
        usuario =>
          usuario.email.toLowerCase() ===
            emailAtual.toLowerCase() &&
          usuario.perfil === 'cooperativa'
      ) ?? null;
  }

  private formatarPlaca(placa: string): string {

    const placaLimpa = placa
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '');

    if (!placaLimpa) {
      return '';
    }

    if (placaLimpa.length === 7) {
      return `${placaLimpa.slice(0, 3)}-${placaLimpa.slice(3)}`;
    }

    return placa.trim().toUpperCase();
  }

  private limparFormulario(): void {
    this.placa = '';
    this.modelo = '';
    this.capacidadeKg = null;
    this.motorista = '';
  }

  private exibirToast(mensagem: string): void {

    if (this.temporizadorToast) {
      clearTimeout(this.temporizadorToast);
    }

    this.mensagemToast = mensagem;
    this.toastVisivel = true;

    this.temporizadorToast = setTimeout(() => {
      this.toastVisivel = false;
    }, 3000);
  }

  private obterVeiculos(): Veiculo[] {

    try {

      return JSON.parse(
        localStorage.getItem('veiculos') || '[]'
      ) as Veiculo[];

    } catch (erro) {

      console.error(
        'Erro ao carregar veículos:',
        erro
      );

      return [];
    }
  }
}