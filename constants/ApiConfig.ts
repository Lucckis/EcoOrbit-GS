//  CONFIGURAÇÃO DE AMBIENTE
//
// Emulador Android  → mantenha '10.0.2.2'
// Simulador iOS     → troque por 'localhost'
// Dispositivo físico → troque pelo IP da sua máquina
//   (Windows: `ipconfig`  |  Mac/Linux: `ifconfig`)
//   Exemplo: '192.168.1.100'

const DEV_HOST = "10.0.2.2"; // ← MUDE AQUI SE NECESSÁRIO

export const API = {
  USUARIO: `http://${DEV_HOST}:8080`,
  IA: `http://${DEV_HOST}:8082`,
  PREDICT: `http://${DEV_HOST}:8083`,
} as const;
