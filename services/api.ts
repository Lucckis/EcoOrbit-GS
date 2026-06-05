// ═══════════════════════════════════════════════════════════════
//  EcoOrbit — Camada de acesso às APIs
//
//  Microserviços e portas:
//    • ecoorbit_api_usuario  → porta 8080  (auth / usuários)
//    • ecoorbit_api_ia       → porta 8082  (chat com IA, requer JWT)
//    • ecoorbit_api_predict  → porta 8083  (análise de risco de incêndio)
//    • ecoorbit_api_server   → porta 8761  (Eureka — uso interno)
//
//  Em produção, substitua os BASE_URLs pelo endereço real do servidor.
// ═══════════════════════════════════════════════════════════════

const USUARIO_API = 'http://localhost:8080';
const IA_API      = 'http://localhost:8082';
const PREDICT_API = 'http://localhost:8083';
// Para dispositivo físico, use o IP da máquina na rede local:
// const USUARIO_API = 'http://192.168.x.x:8080';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Erro ${res.status}${body ? `: ${body}` : ''}`);
  }
  return res.json() as Promise<T>;
}

export function toLocalDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// ══════════════════════════════════════════════════════════════
//  1. AUTH  —  POST /auth/login  |  POST /auth/register
// ══════════════════════════════════════════════════════════════

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
}

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const res = await fetch(`${USUARIO_API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<LoginResponse>(res);
}

export async function register(payload: RegisterRequest): Promise<void> {
  const res = await fetch(`${USUARIO_API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Erro ${res.status}${body ? `: ${body}` : ''}`);
  }
}

// ══════════════════════════════════════════════════════════════
//  2. ANÁLISE DE RISCO  —  POST /analyze
// ══════════════════════════════════════════════════════════════

export interface AnalyzeRequest {
  lat: number;
  lon: number;
  data: string; // "YYYY-MM-DD"
}

export interface AnalyzeResponse {
  status: string;
  coordinates: { lat: number; lon: number };
  analysisDate: string;
  fireDetected: boolean;
  confidencePercentage: number;
}

export async function analyzeRegion(
  payload: AnalyzeRequest
): Promise<AnalyzeResponse> {
  const res = await fetch(`${PREDICT_API}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<AnalyzeResponse>(res);
}

// ══════════════════════════════════════════════════════════════
//  3. CHAT COM IA  —  POST /ia/chat  |  GET /ia/chat/historico
// ══════════════════════════════════════════════════════════════

export interface ChatRequest {
  pergunta: string;
}

export interface ChatResponse {
  pergunta: string;
  resposta: string;
}

export async function sendChat(
  payload: ChatRequest,
  token: string
): Promise<ChatResponse> {
  const res = await fetch(`${IA_API}/ia/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<ChatResponse>(res);
}

export async function getChatHistory(
  token: string
): Promise<Array<{ role: string; content: string }>> {
  const res = await fetch(`${IA_API}/ia/chat/historico`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
}

// ══════════════════════════════════════════════════════════════
//  4. USUÁRIOS  —  GET/PUT/DELETE /usuarios
// ══════════════════════════════════════════════════════════════

export interface UsuarioResponse {
  id: number;
  nome: string;
  email: string;
  role: string;
}

export interface AtualizarUsuarioRequest {
  nome?: string;
  email?: string;
  senha?: string;
}

export async function getUsuarioById(
  id: number,
  token: string
): Promise<UsuarioResponse> {
  const res = await fetch(`${USUARIO_API}/usuarios/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse<UsuarioResponse>(res);
}

export async function updateUsuario(
  id: number,
  payload: AtualizarUsuarioRequest,
  token: string
): Promise<UsuarioResponse> {
  const res = await fetch(`${USUARIO_API}/usuarios/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<UsuarioResponse>(res);
}

export async function deleteUsuario(id: number, token: string): Promise<void> {
  const res = await fetch(`${USUARIO_API}/usuarios/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Erro ${res.status}${body ? `: ${body}` : ''}`);
  }
}
