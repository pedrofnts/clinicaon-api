export interface LoginRequest {
  email: string;
  senha: string;
  client_id?: string;
  client_secret?: string;
}

export interface LoginResponse {
  sucesso: boolean;
  access_token: string;
  usuarioid: number;
  grupoUsuario: string;
  nomeUnidade: string;
  userName: string;
  unidadeId: number;
  tipoAssinatura: number;
  refreshToken: string;
  nutricional: boolean;
  nomeUsuario: string;
}

export interface JWTPayload {
  usuarioId: string;
  empresaId: string;
  empresapaiId: string;
  regionalId: string;
  grupoeconomicoId: string;
  server: string;
  pasta: string;
  basedados: string;
  assinaturaId: string;
  tipoAssinatura: string;
  nutricional: string;
  perfilId: string;
  email: string;
  multiRede: string;
  usuarioSistemaId: string;
  isSistema: string;
  isSistemaRestrito: string;
  exp: number;
  iss: string;
  aud: string;
}