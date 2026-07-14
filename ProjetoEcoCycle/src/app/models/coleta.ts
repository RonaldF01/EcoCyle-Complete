export type StatusColeta =
  | 'pendente'
  | 'matched'
  | 'aceita'
  | 'em_rota'
  | 'concluida'
  | 'entregue'
  | 'processado'
  | 'cancelada';

export interface Coleta {
  id: number;

  geradorEmail: string;
  geradorNome: string;

  tipoResiduo: string;

  pesoEstimado: number;
  pesoReal?: number;

  enderecoColeta: string;
  dataDesejada: string;
  horarioPreferido: string;
  observacoes: string;

  status: StatusColeta;

  cooperativaEmail?: string;
  cooperativaNome?: string;

  recicladoraEmail?: string;
  recicladoraNome?: string;

  placaVeiculo?: string;

  latitude?: number;
  longitude?: number;

  cooperativaLatitude?: number;
  cooperativaLongitude?: number;

  distanciaKm?: number;
  duracaoMinutos?: number;

  criadaEm: string;
  aceitaEm?: string;
  iniciadaEm?: string;
  concluidaEm?: string;
  entregueEm?: string;
  processadoEm?: string;
}