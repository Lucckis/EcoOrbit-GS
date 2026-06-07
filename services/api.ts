import { iaClient, predictClient, usuarioClient } from "./axiosInstance";

export function toLocalDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function decodeJwtPayload(
  token: string,
): Record<string, unknown> | null {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

// Auth
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

// Usuários
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

// Análise
export interface AnalyzeRequest {
  lat: number;
  lon: number;
  data: string;
}
export interface AnalyzeResponse {
  status: string;
  coordinates: { lat: number; lon: number };
  analysisDate: string;
  fireDetected: boolean;
  confidencePercentage: number;
}

// Chat com IA
export interface ChatRequest {
  pergunta: string;
}
export interface ChatResponse {
  pergunta: string;
  resposta: string;
}
export interface ChatHistoryItem {
  role: string;
  content: string;
}

// ══════════════════════════════════════════════════════════════
//  1. AUTH  ─  porta 8080
//  POST /auth/register  |  POST /auth/login
// ══════════════════════════════════════════════════════════════

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const { data } = await usuarioClient.post<LoginResponse>(
    "/auth/login",
    payload,
  );
  return data;
}

export async function register(payload: RegisterRequest): Promise<void> {
  await usuarioClient.post("/auth/register", payload);
}

// ══════════════════════════════════════════════════════════════
//  2. USUÁRIOS  ─  porta 8080
//  GET /usuarios  |  GET /usuarios/{id}
//  PUT /usuarios/{id}  |  DELETE /usuarios/{id}
// ══════════════════════════════════════════════════════════════

export async function getUsuarios(): Promise<UsuarioResponse[]> {
  const { data } = await usuarioClient.get<UsuarioResponse[]>("/usuarios");
  return data;
}

export async function getUsuarioById(id: number): Promise<UsuarioResponse> {
  const { data } = await usuarioClient.get<UsuarioResponse>(`/usuarios/${id}`);
  return data;
}

export async function updateUsuario(
  id: number,
  payload: AtualizarUsuarioRequest,
): Promise<UsuarioResponse> {
  const { data } = await usuarioClient.put<UsuarioResponse>(
    `/usuarios/${id}`,
    payload,
  );
  return data;
}

export async function deleteUsuario(id: number): Promise<void> {
  await usuarioClient.delete(`/usuarios/${id}`);
}

// ══════════════════════════════════════════════════════════════
//  3. ANÁLISE DE RISCO  ─  porta 8083
//  POST /analyze
// ══════════════════════════════════════════════════════════════

export async function analyzeRegion(
  payload: AnalyzeRequest,
): Promise<AnalyzeResponse> {
  const { data } = await predictClient.post<AnalyzeResponse>(
    "/analyze",
    payload,
  );
  return data;
}

// ══════════════════════════════════════════════════════════════
//  4. CHAT COM IA  ─  porta 8082
//  POST /ia/chat  |  GET /ia/chat/historico
// ══════════════════════════════════════════════════════════════

export async function sendChat(payload: ChatRequest): Promise<ChatResponse> {
  const { data } = await iaClient.post<ChatResponse>("/ia/chat", payload);
  return data;
}

export async function getChatHistory(): Promise<ChatHistoryItem[]> {
  const { data } = await iaClient.get<ChatHistoryItem[]>("/ia/chat/historico");
  return data;
}
