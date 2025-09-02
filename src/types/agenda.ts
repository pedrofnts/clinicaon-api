export interface AgendaRequest {
  startDate: string;
  endDate: string;
  semFalta?: boolean;
  status?: string | string[];
}

export interface AgendaItemRaw {
  Id: number;
  Tipo: string;
  Subject: string;
  StartTime: string;
  EndTime: string;
  IsAllDay: boolean;
  IsBlock: boolean;
  IsReadonly: boolean;
  RoomId: number;
  ResourceId: number;
  ColunaId: number;
  PessoaId: number;
  AtendenteId: number;
  Color: string;
  StatusId: number;
  Descricao: string;
  Telefone: string | null;
  NomePessoa: string;
  Celular: string;
  Preferencia: string;
  Servicos: string;
  NomeStatus: string;
  Aniversario: boolean;
  SemCPF: boolean;
  PedidosAberto: boolean;
  IsReserva: boolean;
  AssinaturaPendente: boolean;
  NomeAtendente: string;
  NomeColuna: string;
  HoraInicio: string;
  HoraFim: string;
  Duracao: number;
  PrimeiraVez: boolean;
}

export interface AgendaItem {
  id: number;
  horaInicio: string;
  horaFim: string;
  nomePessoa: string;
  telefone: string | null;
  celular: string;
  servicos: string[];
  status: string;
}

export interface AgendaPayload {
  params: {
    StartDate: string;
    EndDate: string;
  };
  StartDate: string;
  EndDate: string;
}