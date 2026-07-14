export type StatusVeiculo =
  | 'disponivel'
  | 'em_rota'
  | 'manutencao';

export interface Veiculo {
  id: number;

  cooperativaEmail: string;
  cooperativaNome: string;

  placa: string;
  modelo: string;
  capacidadeKg: number;
  motorista: string;

  status: StatusVeiculo;

  criadoEm: string;
  atualizadoEm?: string;
}