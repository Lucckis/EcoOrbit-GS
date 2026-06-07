import { API } from "@/constants/ApiConfig";
import axios, { AxiosError } from "axios";
import { Alert } from "react-native";

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "Sem conexão com o servidor. Verifique se a API está rodando.";
    }
    const status = error.response.status;
    const serverMsg = (error.response.data as { message?: string })?.message;
    if (status === 400) return serverMsg ?? "Requisição inválida.";
    if (status === 401) return "Sessão expirada. Faça login novamente.";
    if (status === 403) return "Acesso não autorizado.";
    if (status === 404) return "Recurso não encontrado.";
    if (status === 409) return serverMsg ?? "Este recurso já existe.";
    if (status === 500) return "Erro interno do servidor. Tente novamente.";
    return serverMsg ?? `Erro ${status}.`;
  }
  if (error instanceof Error) return error.message;
  return "Erro desconhecido.";
}

function buildClient(baseURL: string) {
  const client = axios.create({
    baseURL,
    timeout: 15_000,
    headers: { "Content-Type": "application/json" },
  });

  client.interceptors.request.use((config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (res) => res,
    (error: AxiosError) => {
      if (!error.response) {
        Alert.alert(
          "Sem conexão",
          "Não foi possível alcançar o servidor.\n\nVerifique se a API está rodando e se o endereço em constants/ApiConfig.ts está correto.",
          [{ text: "OK" }],
        );
      }
      return Promise.reject(error);
    },
  );

  return client;
}
export const usuarioClient = buildClient(API.USUARIO);
export const iaClient = buildClient(API.IA);
export const predictClient = buildClient(API.PREDICT);
