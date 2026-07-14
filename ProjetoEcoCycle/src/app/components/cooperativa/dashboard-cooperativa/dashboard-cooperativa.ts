import { CommonModule } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';

import { Sidebar } from '../../sidebar/sidebar';

import {
  Coleta,
  StatusColeta
} from '../../../models/coleta';

import {
  StatusVeiculo,
  Veiculo
} from '../../../models/veiculo';

import { Usuario } from '../../../models/usuario';

@Component({
  selector: 'app-dashboard-cooperativa',
  standalone: true,
  imports: [
    CommonModule,
    Sidebar
  ],
  templateUrl: './dashboard-cooperativa.html',
  styleUrl: './dashboard-cooperativa.css'
})
export class DashboardCooperativa
  implements OnInit, OnDestroy {

  menuAberto = true;

  cooperativaAtual: Usuario | null = null;

  coletas: Coleta[] = [];
  coletasRecentes: Coleta[] = [];

  veiculos: Veiculo[] = [];

  carregando = true;

  private intervaloAtualizacao?:
    ReturnType<typeof setInterval>;

  constructor(private router: Router) {}

  ngOnInit(): void {

    this.carregarCooperativa();
    this.carregarDashboard();

    this.intervaloAtualizacao = setInterval(() => {
      this.carregarDashboard(false);
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
    this.carregarDashboard(false);
  };

  alterarMenu(aberto: boolean): void {
    this.menuAberto = aberto;
  }

  carregarDashboard(
    mostrarCarregamento = true
  ): void {

    if (mostrarCarregamento) {
      this.carregando = true;
    }

    this.carregarColetas();
    this.carregarVeiculos();

    if (mostrarCarregamento) {

      setTimeout(() => {
        this.carregando = false;
      }, 300);
    }
  }

  private carregarCooperativa(): void {

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
  }

  private carregarColetas(): void {

    const emailCooperativa =
      this.cooperativaAtual?.email.toLowerCase();

    if (!emailCooperativa) {
      this.coletas = [];
      this.coletasRecentes = [];
      return;
    }

    const todasColetas = this.obterColetas();

    /*
      Inclui:
      - coletas pendentes disponíveis;
      - coletas já vinculadas à cooperativa atual.
    */
    this.coletas = todasColetas
      .filter(
        coleta =>
          coleta.status === 'pendente' ||
          coleta.cooperativaEmail?.toLowerCase() ===
            emailCooperativa
      )
      .sort(
        (a, b) =>
          this.obterDataColeta(b).getTime() -
          this.obterDataColeta(a).getTime()
      );

    this.coletasRecentes =
      this.coletas.slice(0, 10);
  }

  private carregarVeiculos(): void {

    const emailCooperativa =
      this.cooperativaAtual?.email.toLowerCase();

    if (!emailCooperativa) {
      this.veiculos = [];
      return;
    }

    this.veiculos = this.obterVeiculos()
      .filter(
        veiculo =>
          veiculo.cooperativaEmail.toLowerCase() ===
          emailCooperativa
      )
      .sort(
        (a, b) =>
          new Date(b.criadoEm).getTime() -
          new Date(a.criadoEm).getTime()
      );
  }

  irParaMatch(): void {
    this.router.navigate([
      '/cooperativa/match-emapa'
    ]);
  }

  irParaFrota(): void {
    this.router.navigate([
      '/cooperativa/frota'
    ]);
  }

  nomeStatusColeta(
    status: StatusColeta
  ): string {

    switch (status) {

      case 'pendente':
        return 'Pendente';

      case 'matched':
      case 'aceita':
        return 'Aceita';

      case 'em_rota':
        return 'Em rota';

      case 'concluida':
        return 'Concluída';

      case 'cancelada':
        return 'Cancelada';

      default:
        return status;
    }
  }

  classeStatusColeta(
    status: StatusColeta
  ): string {

    switch (status) {

      case 'pendente':
        return 'status-pendente';

      case 'matched':
      case 'aceita':
        return 'status-aceita';

      case 'em_rota':
        return 'status-rota';

      case 'concluida':
        return 'status-concluida';

      case 'cancelada':
        return 'status-cancelada';

      default:
        return '';
    }
  }

  nomeStatusVeiculo(
    status: StatusVeiculo
  ): string {

    switch (status) {

      case 'disponivel':
        return 'Disponível';

      case 'em_rota':
        return 'Em rota';

      case 'manutencao':
        return 'Manutenção';

      default:
        return status;
    }
  }

  classeStatusVeiculo(
    status: StatusVeiculo
  ): string {

    switch (status) {

      case 'disponivel':
        return 'veiculo-disponivel';

      case 'em_rota':
        return 'veiculo-rota';

      case 'manutencao':
        return 'veiculo-manutencao';

      default:
        return '';
    }
  }

  obterPesoColeta(coleta: Coleta): number {

    if (
      coleta.pesoReal !== undefined &&
      coleta.pesoReal > 0
    ) {
      return coleta.pesoReal;
    }

    return coleta.pesoEstimado || 0;
  }

  formatarPeso(
    pesoKg: number
  ): string {

    if (pesoKg >= 1000) {

      const toneladas =
        pesoKg / 1000;

      return `${toneladas.toLocaleString(
        'pt-BR',
        {
          minimumFractionDigits: 1,
          maximumFractionDigits: 2
        }
      )} t`;
    }

    return `${pesoKg.toLocaleString(
      'pt-BR',
      {
        maximumFractionDigits: 2
      }
    )} kg`;
  }

  formatarData(
    data: string | undefined
  ): string {

    if (!data) {
      return '—';
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

    const dataConvertida =
      new Date(data);

    if (
      Number.isNaN(dataConvertida.getTime())
    ) {
      return data;
    }

    return new Intl.DateTimeFormat(
      'pt-BR'
    ).format(dataConvertida);
  }

  get nomeCooperativa(): string {

    return (
      this.cooperativaAtual?.nomeOrganizacao ||
      'Cooperativa'
    );
  }

  get totalPendentes(): number {

    return this.coletas.filter(
      coleta =>
        coleta.status === 'pendente' ||
        coleta.status === 'matched' ||
        coleta.status === 'aceita'
    ).length;
  }

  get totalEmRota(): number {

    return this.coletas.filter(
      coleta =>
        coleta.status === 'em_rota'
    ).length;
  }

  get totalConcluidas(): number {

    return this.coletas.filter(
      coleta =>
        coleta.status === 'concluida'
    ).length;
  }

  get pesoTotalColetado(): number {

    return this.coletas
      .filter(
        coleta =>
          coleta.status === 'concluida'
      )
      .reduce(
        (total, coleta) =>
          total + this.obterPesoColeta(coleta),
        0
      );
  }

  get tendenciaPendentes(): number {

    return this.calcularTendencia(
      ['pendente', 'matched', 'aceita']
    );
  }

  get tendenciaConcluidas(): number {

    return this.calcularTendencia(
      ['concluida']
    );
  }

  private calcularTendencia(
    statusPermitidos: StatusColeta[]
  ): number {

    const hoje = new Date();

    const inicioMesAtual =
      new Date(
        hoje.getFullYear(),
        hoje.getMonth(),
        1
      );

    const inicioMesAnterior =
      new Date(
        hoje.getFullYear(),
        hoje.getMonth() - 1,
        1
      );

    const fimMesAnterior =
      new Date(
        hoje.getFullYear(),
        hoje.getMonth(),
        0,
        23,
        59,
        59
      );

    const totalMesAtual =
      this.coletas.filter(coleta => {

        const data =
          this.obterDataColeta(coleta);

        return (
          statusPermitidos.includes(
            coleta.status
          ) &&
          data >= inicioMesAtual
        );
      }).length;

    const totalMesAnterior =
      this.coletas.filter(coleta => {

        const data =
          this.obterDataColeta(coleta);

        return (
          statusPermitidos.includes(
            coleta.status
          ) &&
          data >= inicioMesAnterior &&
          data <= fimMesAnterior
        );
      }).length;

    if (totalMesAnterior === 0) {

      return totalMesAtual > 0
        ? 100
        : 0;
    }

    return Math.round(
      (
        (
          totalMesAtual -
          totalMesAnterior
        ) /
        totalMesAnterior
      ) * 100
    );
  }

  private obterDataColeta(
    coleta: Coleta
  ): Date {

    const data =
      coleta.concluidaEm ||
      coleta.iniciadaEm ||
      coleta.aceitaEm ||
      coleta.dataDesejada ||
      coleta.criadaEm;

    if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {

      const [ano, mes, dia] =
        data.split('-').map(Number);

      return new Date(
        ano,
        mes - 1,
        dia
      );
    }

    const dataConvertida =
      new Date(data);

    if (
      Number.isNaN(
        dataConvertida.getTime()
      )
    ) {
      return new Date(0);
    }

    return dataConvertida;
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