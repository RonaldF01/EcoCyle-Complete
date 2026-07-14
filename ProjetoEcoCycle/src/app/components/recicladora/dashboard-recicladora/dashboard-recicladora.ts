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

import { Usuario } from '../../../models/usuario';

interface VolumeResiduo {
  tipo: string;
  pesoKg: number;
  percentual: number;
}

@Component({
  selector: 'app-dashboard-recicladora',
  standalone: true,
  imports: [
    CommonModule,
    Sidebar
  ],
  templateUrl: './dashboard-recicladora.html',
  styleUrl: './dashboard-recicladora.css'
})
export class DashboardRecicladora
  implements OnInit, OnDestroy {

  menuAberto = true;

  recicladoraAtual: Usuario | null = null;

  recebimentos: Coleta[] = [];
  recebimentosRecentes: Coleta[] = [];

  volumesPorResiduo: VolumeResiduo[] = [];

  carregando = true;

  private intervaloAtualizacao?: ReturnType<typeof setInterval>;

  constructor(private router: Router) {}

  ngOnInit(): void {

    this.carregarRecicladora();
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

    this.carregarRecebimentos();
    this.calcularVolumesPorResiduo();

    if (mostrarCarregamento) {

      setTimeout(() => {
        this.carregando = false;
      }, 300);
    }
  }

  private carregarRecicladora(): void {

    const emailAtual =
      localStorage.getItem('usuarioAtual');

    if (!emailAtual) {
      this.recicladoraAtual = null;
      return;
    }

    const usuarios = this.obterUsuarios();

    this.recicladoraAtual =
      usuarios.find(
        usuario =>
          usuario.email.toLowerCase() ===
            emailAtual.toLowerCase() &&
          usuario.perfil === 'recicladora'
      ) ?? null;
  }

  private carregarRecebimentos(): void {

    const emailRecicladora =
      this.recicladoraAtual?.email.toLowerCase();

    if (!emailRecicladora) {
      this.recebimentos = [];
      this.recebimentosRecentes = [];
      return;
    }

    const todasColetas =
      this.obterColetas();

    this.recebimentos = todasColetas
      .filter(
        coleta =>
          (
            coleta.status === 'entregue' ||
            coleta.status === 'processado'
          ) &&
          coleta.recicladoraEmail?.toLowerCase() ===
            emailRecicladora
      )
      .sort(
        (a, b) =>
          this.obterDataRecebimento(b).getTime() -
          this.obterDataRecebimento(a).getTime()
      );

    this.recebimentosRecentes =
      this.recebimentos.slice(0, 15);
  }

  private calcularVolumesPorResiduo(): void {

    const agrupamento = new Map<string, number>();

    this.recebimentos.forEach(recebimento => {

      const tipo =
        recebimento.tipoResiduo.trim() ||
        'Não informado';

      const peso =
        this.obterPesoRecebimento(recebimento);

      agrupamento.set(
        tipo,
        (agrupamento.get(tipo) ?? 0) + peso
      );
    });

    const maiorPeso = Math.max(
      ...Array.from(agrupamento.values()),
      0
    );

    this.volumesPorResiduo = Array.from(
      agrupamento.entries()
    )
      .map(([tipo, pesoKg]) => ({
        tipo,
        pesoKg,
        percentual:
          maiorPeso > 0
            ? (pesoKg / maiorPeso) * 100
            : 0
      }))
      .sort(
        (a, b) =>
          b.pesoKg - a.pesoKg
      );
  }

  irParaRecebimentos(): void {
    this.router.navigate([
      '/recicladora/recebimentos'
    ]);
  }

  irParaControleVolume(): void {
    this.router.navigate([
      '/recicladora/controle-de-volume'
    ]);
  }

  obterPesoRecebimento(
    coleta: Coleta
  ): number {

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

      return `${(pesoKg / 1000).toLocaleString(
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

  formatarToneladas(
    pesoKg: number
  ): string {

    const toneladas =
      pesoKg / 1000;

    return `${toneladas.toLocaleString(
      'pt-BR',
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    )} t`;
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
      Number.isNaN(
        dataConvertida.getTime()
      )
    ) {
      return data;
    }

    return new Intl.DateTimeFormat(
      'pt-BR'
    ).format(dataConvertida);
  }

  nomeStatus(
    status: StatusColeta
  ): string {

    switch (status) {

      case 'entregue':
        return 'Aguardando processamento';

      case 'processado':
        return 'Processado';

      default:
        return status;
    }
  }

  classeStatus(
    status: StatusColeta
  ): string {

    switch (status) {

      case 'entregue':
        return 'status-entregue';

      case 'processado':
        return 'status-processado';

      default:
        return '';
    }
  }

  get nomeRecicladora(): string {

    return (
      this.recicladoraAtual?.nomeOrganizacao ||
      'Recicladora'
    );
  }

  get pesoTotalRecebidoKg(): number {

    return this.recebimentos.reduce(
      (total, recebimento) =>
        total +
        this.obterPesoRecebimento(recebimento),
      0
    );
  }

  get totalAguardandoProcessamento(): number {

    return this.recebimentos.filter(
      recebimento =>
        recebimento.status === 'entregue'
    ).length;
  }

  get totalProcessados(): number {

    return this.recebimentos.filter(
      recebimento =>
        recebimento.status === 'processado'
    ).length;
  }

  get totalCooperativasParceiras(): number {

    const cooperativas =
      new Set<string>();

    this.recebimentos.forEach(
      recebimento => {

        const identificador =
          recebimento.cooperativaEmail ||
          recebimento.cooperativaNome;

        if (identificador) {
          cooperativas.add(
            identificador
              .trim()
              .toLowerCase()
          );
        }
      }
    );

    return cooperativas.size;
  }

  get tendenciaTotalRecebido(): number {

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

    const pesoMesAtual =
      this.recebimentos
        .filter(recebimento => {

          const data =
            this.obterDataRecebimento(
              recebimento
            );

          return data >= inicioMesAtual;
        })
        .reduce(
          (total, recebimento) =>
            total +
            this.obterPesoRecebimento(
              recebimento
            ),
          0
        );

    const pesoMesAnterior =
      this.recebimentos
        .filter(recebimento => {

          const data =
            this.obterDataRecebimento(
              recebimento
            );

          return (
            data >= inicioMesAnterior &&
            data <= fimMesAnterior
          );
        })
        .reduce(
          (total, recebimento) =>
            total +
            this.obterPesoRecebimento(
              recebimento
            ),
          0
        );

    if (pesoMesAnterior === 0) {

      return pesoMesAtual > 0
        ? 100
        : 0;
    }

    return Math.round(
      (
        (
          pesoMesAtual -
          pesoMesAnterior
        ) /
        pesoMesAnterior
      ) * 100
    );
  }

  private obterDataRecebimento(
    coleta: Coleta
  ): Date {

    const data =
      coleta.processadoEm ||
      coleta.entregueEm ||
      coleta.concluidaEm ||
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
}