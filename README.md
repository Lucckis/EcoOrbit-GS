#  EcoOrbit
<p align="center">
  Aplicativo mobile desenvolvido para a <strong>Global Solution</strong> da FIAP, com foco em sustentabilidade e consciência ambiental.
</p>

---

## Integrantes do Grupo

| Nome         | RM      |
| ------------ | ------- |
| Lucas Gomes de Araújo Lopes | RM 559607 |
| João Victor Alves da Silva | RM 559726 |
| Vinicius Kenzo Tocuyosi | RM 559982 |

---

## Sobre o Projeto

O **EcoOrbit** é um aplicativo mobile desenvolvido com React Native e Expo, criado como parte da Global Solution da FIAP. O projeto tem como objetivo disponibilizar acesso ao usuário uma visão via satelite do mapa mundial e assim escolher um lugar para análise, após escolher o lugar o usuário receberá um alerta sobre a possibilidade de ocorrer um incêndio na área, no projeto em si também é possivel se comunicar com um chatbot no qual responde perguntas relacionadas a perigos de incêndio e onde é mais provavel de ocorrerem.

---

## Tecnologias Utilizadas

| Tecnologia                         | Versão  | Descrição                                         |
| ---------------------------------- | ------- | ------------------------------------------------- |
| **React Native**                   | 0.85.3  | Framework principal para desenvolvimento mobile   |
| **Expo**                           | ~56.x   | Plataforma de desenvolvimento e build             |
| **Expo Router**                    | ~56.2.8 | Navegação baseada em arquivo (file-based routing) |
| **TypeScript**                     | ~6.0.3  | Tipagem estática para maior segurança no código   |
| **React**                          | 19.2.3  | Biblioteca de interface de usuário                |
| **React Native Reanimated**        | 4.3.1   | Animações fluidas e performáticas                 |
| **React Native Screens**           | 4.25.2  | Gerenciamento nativo de telas                     |
| **React Native Safe Area Context** | ~5.7.0  | Suporte a áreas seguras nos dispositivos          |
| **React Native Web**               | ~0.21.0 | Suporte à versão web do app                       |

---

## Dependências

### Produção

```json
{
  "expo": "~56.0.8",
  "expo-constants": "~56.0.16",
  "expo-font": "~56.0.5",
  "expo-linking": "~56.0.13",
  "expo-router": "~56.2.8",
  "expo-splash-screen": "~56.0.10",
  "expo-status-bar": "~56.0.4",
  "expo-symbols": "~56.0.5",
  "expo-web-browser": "~56.0.5",
  "react": "19.2.3",
  "react-dom": "19.2.3",
  "react-native": "0.85.3",
  "react-native-reanimated": "4.3.1",
  "react-native-safe-area-context": "~5.7.0",
  "react-native-screens": "4.25.2",
  "react-native-web": "~0.21.0",
  "react-native-worklets": "0.8.3"
}
```

### Desenvolvimento

```json
{
  "@types/react": "~19.2.2",
  "typescript": "~6.0.3"
}
```

---

## Como Executar o Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão LTS recomendada)
- [npm](https://www.npmjs.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) instalado globalmente
- [Expo Go](https://expo.dev/client) no dispositivo (para testes rápidos)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/Lucckis/EcoOrbit-GS.git

# Entre na pasta do projeto
cd EcoOrbit-GS

# Instale as dependências
npm install
```

### Executando

```bash
# Iniciar o servidor de desenvolvimento
npx expo start
```

---

## Estrutura do Projeto

```
EcoOrbit-GS/
├── app/              # Telas e rotas do aplicativo (Expo Router)
├── constants/        # Constantes e configurações globais
├── assets/           # Imagens, ícones e fontes
├── app.json          # Configuração do Expo
├── package.json      # Dependências e scripts
└── tsconfig.json     # Configuração do TypeScript
```

---

## Vídeo de Demonstração

Video de demonstração do aplicativo: https://www.youtube.com/watch?v=YMkqZ-ai-gw

---

## API

API da EcoOrbit: https://github.com/vinikenzo/EcoOrbit-API

---

## Download do APK

Link do download: https://expo.dev/accounts/lucckis/projects/EcoOrbit/builds/6d936689-d6b1-4b5b-be97-42d4ec5d93ad

---

## Licença

Este projeto está licenciado sob a licença **MIT**. Consulte o arquivo [LICENSE](./LICENSE) para mais detalhes.

---

<p align="center">
  Desenvolvido para a <strong>Global Solution — FIAP</strong>
</p>
