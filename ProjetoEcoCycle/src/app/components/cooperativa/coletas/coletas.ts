import { CommonModule } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import { Sidebar } from '../../sidebar/sidebar';
import {
  Coleta,
  StatusColeta
} from '../../../models/coleta';

@Component({
  selector: 'app-coletas',
  standalone: true,
  imports: [
    CommonModule,
    Sidebar
  ],
  templateUrl: './coletas.html',
  styleUrl: './coletas.css'
})
export class Coletas implements OnInit, OnDestroy {

  menuAberto = true;

  coletasDaCooperativa: Coleta[] = [];

  carregando = false;

  private intervaloAtualizacao?: ReturnType<typeof setInterval>;

  ngOnInit(): void {

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

  carregarColetas(
    mostrarCarregamento = true
  ): void {

    if (mostrarCarregamento) {
      this.carregando = true;
    }

    const emailCooperativa =
      localStorage.getItem('usuarioAtual');

    if (!emailCooperativa) {
      this.coletasDaCooperativa = [];
      this.carregando = false;
      return;
    }

    const coletas = this.obterColetas();

    this.coletasDaCooperativa = coletas
      .filter(
        coleta =>
          coleta.cooperativaEmail?.toLowerCase() ===
            emailCooperativa.toLowerCase() &&
          (
            coleta.status === 'matched' ||
            coleta.status === 'aceita' ||
            coleta.status === 'em_rota' ||
            coleta.status === 'concluida'
          )
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

    if (mostrarCarregamento) {
      setTimeout(() => {
        this.carregando = false;
      }, 300);
    }
  }

  marcarEmRota(coleta: Coleta): void {

    if (
      coleta.status !== 'matched' &&
      coleta.status !== 'aceita'
    ) {
      alert(
        'Esta coleta não pode ser marcada como em rota.'
      );
      return;
    }

    const confirmou = window.confirm(
      `Deseja iniciar a rota para a coleta de ${coleta.geradorNome}?`
    );

    if (!confirmou) {
      return;
    }

    this.atualizarStatus(
      coleta.id,
      'em_rota'
    );

    alert('Coleta marcada como Em rota.');
  }

  concluirColeta(coleta: Coleta): void {

    if (coleta.status === 'concluida') {
      alert('Esta coleta já foi concluída.');
      return;
    }

    const confirmou = window.confirm(
      `Confirma a conclusão da coleta de ${coleta.geradorNome}?`
    );

    if (!confirmou) {
      return;
    }

    this.atualizarStatus(
      coleta.id,
      'concluida'
    );

    alert('Coleta concluída com sucesso!');
  }

  abrirNoMaps(coleta: Coleta): void {

    const parametros = new URLSearchParams({
      api: '1',
      travelmode: 'driving'
    });

    if (
      coleta.latitude !== undefined &&
      coleta.longitude !== undefined
    ) {
      parametros.set(
        'destination',
        `${coleta.latitude},${coleta.longitude}`
      );
    } else {
      parametros.set(
        'destination',
        coleta.enderecoColeta
      );
    }

    if (
      coleta.cooperativaLatitude !== undefined &&
      coleta.cooperativaLongitude !== undefined
    ) {
      parametros.set(
        'origin',
        `${coleta.cooperativaLatitude},${coleta.cooperativaLongitude}`
      );
    }

    window.open(
      `https://www.google.com/maps/dir/?${parametros.toString()}`,
      '_blank',
      'noopener,noreferrer'
    );
  }

  nomeStatus(status: StatusColeta): string {

    switch (status) {

      case 'matched':
      case 'aceita':
        return 'Coleta aceita';

      case 'em_rota':
        return 'Em rota';

      case 'concluida':
        return 'Concluída';

      case 'cancelada':
        return 'Cancelada';

      case 'pendente':
        return 'Pendente';

      default:
        return status;
    }
  }

  classeStatus(status: StatusColeta): string {

    switch (status) {

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
        return 'status-pendente';
    }
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
      'pt-BR',
      {
        dateStyle: 'short',
        timeStyle: 'short'
      }
    ).format(dataConvertida);
  }

  get totalColetas(): number {
    return this.coletasDaCooperativa.length;
  }

  get totalEmRota(): number {

    return this.coletasDaCooperativa.filter(
      coleta => coleta.status === 'em_rota'
    ).length;
  }

  get totalConcluidas(): number {

    return this.coletasDaCooperativa.filter(
      coleta => coleta.status === 'concluida'
    ).length;
  }

  private atualizarStatus(
    coletaId: number,
    novoStatus: StatusColeta
  ): void {

    const coletas = this.obterColetas();

    const indice = coletas.findIndex(
      coleta => coleta.id === coletaId
    );

    if (indice === -1) {
      alert('Coleta não encontrada.');
      return;
    }

    const coletaAtualizada: Coleta = {
      ...coletas[indice],
      status: novoStatus
    };

    if (novoStatus === 'em_rota') {
      coletaAtualizada.iniciadaEm =
        new Date().toISOString();
    }

    if (novoStatus === 'concluida') {
      coletaAtualizada.concluidaEm =
        new Date().toISOString();
    }

    coletas[indice] = coletaAtualizada;

    localStorage.setItem(
      'coletas',
      JSON.stringify(coletas)
    );

    this.carregarColetas(false);
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