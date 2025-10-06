import axios, { AxiosInstance } from 'axios';
import jwt from 'jsonwebtoken';
import { LoginRequest, LoginResponse, JWTPayload } from '../types/auth';
import { AgendaPayload, AgendaItemRaw, AgendaItem } from '../types/agenda';
import { AniversariantesRequest, AniversarianteItem } from '../types/relatorios';

export class ClinicaOnClient {
  private client: AxiosInstance;
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;
  private storedEmail: string | null = null;
  private storedPassword: string | null = null;

  constructor(private baseURL: string = 'https://api.clinicaon.com.br') {
    this.client = axios.create({
      baseURL,
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Origin': 'https://app.clinicaon.com.br',
        'Referer': 'https://app.clinicaon.com.br/',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'
      }
    });

    this.client.interceptors.request.use((config) => {
      if (this.accessToken) {
        config.headers.Authorization = `Bearer ${this.accessToken}`;
      }
      return config;
    });
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const loginData: LoginRequest = {
      email,
      senha: password,
      client_id: '',
      client_secret: ''
    };

    const response = await this.client.post<LoginResponse>('/api/auth/login', loginData);
    
    if (response.data.sucesso && response.data.access_token) {
      this.accessToken = response.data.access_token;
      this.storedEmail = email;
      this.storedPassword = password;
      
      // Decode JWT to get expiry
      const decoded = jwt.decode(response.data.access_token) as JWTPayload;
      if (decoded && decoded.exp) {
        this.tokenExpiry = decoded.exp * 1000; // Convert to milliseconds
      }
    }

    return response.data;
  }

  isTokenValid(): boolean {
    if (!this.accessToken || !this.tokenExpiry) {
      return false;
    }
    return Date.now() < this.tokenExpiry - 60000; // 1 minute buffer
  }

  getToken(): string | null {
    return this.accessToken;
  }

  async makeRequest<T>(method: 'GET' | 'POST', endpoint: string, data?: any, params?: any): Promise<T> {
    if (!this.isTokenValid()) {
      if (this.storedEmail && this.storedPassword) {
        try {
          await this.login(this.storedEmail, this.storedPassword);
        } catch (error) {
          throw new Error('Auto-login failed. Please login manually.');
        }
      } else {
        throw new Error('No valid token available. Please login first.');
      }
    }

    const response = await this.client.request<T>({
      method,
      url: endpoint,
      data,
      params
    });

    return response.data;
  }

  async getAgenda(startDate: string, endDate: string, semFalta = false, statusFilter?: string | string[]): Promise<AgendaItem[]> {
    const payload: AgendaPayload = {
      params: {
        StartDate: startDate,
        EndDate: endDate
      },
      StartDate: startDate,
      EndDate: endDate
    };

    const rawData = await this.makeRequest<AgendaItemRaw[]>(
      'POST',
      `/api/agenda/retornaagendamentos?semfalta=${semFalta}`,
      payload
    );

    // Transform raw data to clean format
    let filteredData = rawData.map(item => {
      // Extract date from StartTime (format: yyyy-MM-dd)
      const startDate = new Date(item.StartTime);
      const data = startDate.toISOString().split('T')[0];

      return {
        id: item.Id,
        data,
        horaInicio: item.HoraInicio,
        horaFim: item.HoraFim,
        nomePessoa: item.NomePessoa,
        telefone: item.Telefone,
        celular: item.Celular,
        servicos: item.Servicos ? item.Servicos.split(',').map(s => s.trim()) : [],
        status: item.NomeStatus
      };
    });

    // Apply status filtering if provided
    if (statusFilter) {
      const statusArray = Array.isArray(statusFilter) ? statusFilter : [statusFilter];
      filteredData = filteredData.filter(item => 
        statusArray.some(status => 
          item.status.toLowerCase().includes(status.toLowerCase())
        )
      );
    }

    return filteredData;
  }

  async getAniversariantes(startDate: string, endDate: string, situacaoId: string = ''): Promise<AniversarianteItem[]> {
    const requestData: AniversariantesRequest = {
      nomeRelatorio: 'aniversariantes',
      dataDe: startDate,
      dataAte: endDate,
      situacaoId
    };

    const response = await this.makeRequest<AniversarianteItem[]>(
      'POST',
      '/api/relatorios/cadastros',
      requestData
    );

    return response;
  }
}