[![preview program](/resources/preview.png)](/resources/preview.png)

![Electron](https://img.shields.io/badge/Electron-202324?style=for-the-badge&logo=electron&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

--- 

## 🔍 Sobre o projeto

Este projeto foi feito com [Electron](https://www.electronjs.org/pt/), [Vite](https://electron-vite.org/) para iniciar o projeto, [TypeScript](https://www.typescriptlang.org/) e [electron-builder](https://www.electron.build/index.html).

O app captura a imagem ou texto que estiver na área de transferência (Ctrl+C) e envia direto para a IA responder, sem enrolação.

Para imagens, usa o [Tesseract.js](https://tesseract.projectnaptha.com/) para transformar a imagem em texto. *(Essa funcionalidade está em versão beta, então a conversão pode não estar 100% precisa)*.

A inteligência utilizada é da [Groq](https://groq.com/) com o modelo `llama3-70b-8192` versão gratuita.

### 🧠 Como usar

- Copie um texto ou uma imagem (Ctrl+C)
- Pressione `Ctrl + I` (funciona apenas se o app estiver **minimizado ou fora de foco**)  
  **ou** `Ctrl + V` ou botão do scroll do mouse (caso o app esteja em foco)
- A resposta aparece na hora

---

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)


## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```
