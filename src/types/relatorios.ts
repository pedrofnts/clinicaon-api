export interface AniversariantesRequest {
  nomeRelatorio: string;
  dataDe: string;
  dataAte: string;
  situacaoId: string;
}

export interface AniversarianteItem {
  pessoaId: number;
  data: string;
  nomeCliente: string;
  sexo: string;
  telefone: string;
  celular: string;
  email: string;
  nomeSituacao: string;
}

export interface AniversariantesResponse {
  success: boolean;
  data: AniversarianteItem[];
  count: number;
  periodo: {
    dataDe: string;
    dataAte: string;
  };
}