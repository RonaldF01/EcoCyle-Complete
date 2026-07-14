import { CommonModule } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import { Sidebar } from '../../sidebar/sidebar';
import { CollectionMap } from '../../shared/collection-map/collection-map';

import { Coleta } from '../../../models/coleta';
import { Usuario } from '../../../models/usuario';

@Component({
  selector: 'app-match-mapa',
  standalone: true,
  imports: [
    CommonModule,
    Sidebar,
    CollectionMap
  ],
  templateUrl: './match-emapa.html',
  styleUrl: './match-emapa.css'
})
export class MatchEmapa implements OnInit, OnDestroy {

  menuAberto = true;

  coletasDisponiveis: Coleta[] = [];
  meusMatches: Coleta[] = [];

  coletaSelecionada: Coleta | null = null;
  coletaExibidaNoMapa: Coleta | null = null;

  cooperativaAtual: Usuario | null = null;

  atualizando = false;

  private intervaloAtualizacao?: ReturnType<typeof setInterval>;

  ngOnInit(): void {

    this.carregarCooperativa();
    this.carregarColetas();

    this.intervaloAtualizacao = setInterval(() => {
      this.carregarColetas(false);
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

    window.removeEventListener(
      'storage',
      this.aoAlterarStorage
    );
  }

  private aoAlterarStorage = (): void => {
    this.carregarColetas(false);
  };

  alterarMenu(aberto: boolean): void {
    this.menuAberto = aberto;
  }

  carregarCooperativa(): void {

    const emailAtual =
      localStorage.getItem('usuarioAtual');

    if (!emailAtual) {
      this.cooperativaAtual = null;
      return;
    }

    const usuarios = this.obterUsuarios();

    this.cooperativaAtual =
      usuarios.find(
        usuario =>
          usuario.email.toLowerCase() ===
            emailAtual.toLowerCase() &&
          usuario.perfil === 'cooperativa'
      ) ?? null;

    if (!this.cooperativaAtual) {
      alert(
        'Não foi possível identificar a cooperativa conectada.'
      );
    }
  }

  carregarColetas(
    mostrarCarregamento = true
  ): void {

    if (mostrarCarregamento) {
      this.atualizando = true;
    }

    const coletas = this.obterColetas();

    this.coletasDisponiveis = coletas
      .filter(
        coleta =>
          coleta.status === 'pendente' &&
          !coleta.cooperativaEmail
      )
      .sort(
        (a, b) =>
          new Date(b.criadaEm).getTime() -
          new Date(a.criadaEm).getTime()
      );

    const emailCooperativa =
      this.cooperativaAtual?.email.toLowerCase();

    this.meusMatches = coletas
      .filter(
        coleta =>
          (
            coleta.status === 'matched' ||
            coleta.status === 'aceita' ||
            coleta.status === 'em_rota'
          ) &&
          coleta.cooperativaEmail?.toLowerCase() ===
            emailCooperativa
      )
      .sort(
        (a, b) =>
          new Date(
            b.aceitaEm ?? b.criadaEm
          ).getTime() -
          new Date(
            a.aceitaEm ?? a.criadaEm
          ).getTime()
      );

    if (this.coletaExibidaNoMapa) {

      const atualizada = coletas.find(
        coleta =>
          coleta.id ===
          this.coletaExibidaNoMapa?.id
      );

      this.coletaExibidaNoMapa =
        atualizada ?? null;
    }

    if (this.coletaSelecionada) {

      const aindaDisponivel =
        this.coletasDisponiveis.some(
          coleta =>
            coleta.id ===
            this.coletaSelecionada?.id
        );

      if (!aindaDisponivel) {
        this.coletaSelecionada = null;
      }
    }

    if (mostrarCarregamento) {
      setTimeout(() => {
        this.atualizando = false;
      }, 350);
    }
  }

  selecionarColeta(coleta: Coleta): void {

    if (this.coletaSelecionada?.id === coleta.id) {
      this.coletaSelecionada = null;
      return;
    }

    this.coletaSelecionada = coleta;
  }

  cancelarSelecao(
    evento?: MouseEvent
  ): void {

    evento?.stopPropagation();

    this.coletaSelecionada = null;
  }

  verNoMapa(
    coleta: Coleta,
    evento?: MouseEvent
  ): void {

    evento?.stopPropagation();

    this.coletaExibidaNoMapa = {
      ...coleta
    };

    setTimeout(() => {

      document
        .getElementById('secao-mapa')
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

    }, 50);
  }

  aceitarColeta(
    coletaSelecionada: Coleta,
    evento?: MouseEvent
  ): void {

    evento?.stopPropagation();

    if (!this.cooperativaAtual) {
      alert(
        'Não foi possível identificar a cooperativa.'
      );
      return;
    }

    const coletas = this.obterColetas();

    const indice = coletas.findIndex(
      coleta =>
        coleta.id === coletaSelecionada.id
    );

    if (indice === -1) {
      alert('Coleta não encontrada.');
      this.carregarColetas();
      return;
    }

    if (
      coletas[indice].status !== 'pendente' ||
      coletas[indice].cooperativaEmail
    ) {
      alert(
        'Esta coleta já foi aceita por outra cooperativa.'
      );

      this.carregarColetas();
      return;
    }

    const confirmou = window.confirm(
      `Deseja aceitar esta coleta?\n\n` +
      `Gerador: ${coletas[indice].geradorNome}\n` +
      `Resíduo: ${coletas[indice].tipoResiduo}\n` +
      `Peso: ${coletas[indice].pesoEstimado} kg\n` +
      `Destino: ${coletas[indice].enderecoColeta}\n` +
      `Saída: ${this.enderecoBaseCooperativa}`
    );

    if (!confirmou) {
      return;
    }

    const coletaAtualizada: Coleta = {
      ...coletas[indice],

      status: 'matched',

      cooperativaEmail:
        this.cooperativaAtual.email,

      cooperativaNome:
        this.cooperativaAtual.nomeOrganizacao,

      aceitaEm:
        new Date().toISOString()
    };

    coletas[indice] = coletaAtualizada;

    localStorage.setItem(
      'coletas',
      JSON.stringify(coletas)
    );

    this.coletaSelecionada = null;

    this.coletaExibidaNoMapa = {
      ...coletaAtualizada
    };

    this.carregarColetas(false);

    alert('Coleta aceita com sucesso!');

    setTimeout(() => {

      document
        .getElementById('secao-mapa')
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

    }, 80);
  }

  formatarData(
    data: string | undefined
  ): string {

    if (!data) {
      return 'Não informada';
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {

      const [ano, mes, dia] =
        data.split('-').map(Number);

      return new Intl.DateTimeFormat(
        'pt-BR'
      ).format(
        new Date(ano, mes - 1, dia)
      );
    }

    const dataConvertida = new Date(data);

    if (Number.isNaN(dataConvertida.getTime())) {
      return data;
    }

    return new Intl.DateTimeFormat(
      'pt-BR'
    ).format(dataConvertida);
  }

  get enderecoBaseCooperativa(): string {

    if (!this.cooperativaAtual) {
      return 'Endereço não identificado';
    }

    return [
      this.cooperativaAtual.endereco,
      this.cooperativaAtual.cidade,
      this.cooperativaAtual.estado
    ]
      .filter(Boolean)
      .join(', ');
  }

  get totalDisponiveis(): number {
    return this.coletasDisponiveis.length;
  }

  get totalMatches(): number {
    return this.meusMatches.length;
  }

  private obterUsuarios(): Usuario[] {

    try {

      return JSON.parse(
        localStorage.getItem('usuarios') || '[]'
      ) as Usuario[];

    } catch (erro) {

      console.error(
        'Erro ao carregar usuários:',
        erro
      );

      return [];
    }
  }

  private obterColetas(): Coleta[] {

    try {

      return JSON.parse(
        localStorage.getItem('coletas') || '[]'
      ) as Coleta[];

    } catch (erro) {

      console.error(
        'Erro ao carregar coletas:',
        erro
      );

      return [];
    }
  }
}